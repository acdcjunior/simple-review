import * as fs from "fs";
import {GitLabService} from "../gitlab/GitLabService";
import {GitLabUser} from "../gitlab/GitLabUser";
import {sesol2Repository} from "../domain/Sesol2Repository";
import {Committer} from "./Committer";
import {Email} from "../geral/Email";
import {GitLabCommit} from "../gitlab/GitLabCommit";

class CommitterConfigStruct {
    public username: string; // "alexandrevr",
    public sexo: string; // "m",
    public aliases: string[]; // ["alex", "alexandre"],
    public quota: number; // 25
}

export class CommittersFactory {

    static carregarCommittersDoArquivo() {
        console.log(`CommittersFactory: Iniciando carga dos committers do committers.json...`);

        const arquivoCommitters = JSON.parse(fs.readFileSync('../config/committers.json', 'utf8'));

        let inserts: Promise<string>[] = [];
        arquivoCommitters.committers.forEach((committer: CommitterConfigStruct) => {
            inserts.push(
                GitLabService.getUserByUsername(committer.username).then((gitlabUser: GitLabUser) => {
                    if (!gitlabUser) {
                        throw new Error(`CommittersConfig: Commiter de username ${committer.username} não foi encontrado no GitLab!`);
                    }
                    return sesol2Repository.insertIfNotExists(
                        new Committer(gitlabUser, committer.aliases, committer.quota, committer.sexo)
                    );
                })
            );
        });
        return Promise.all(inserts).then(() => {
            console.log(`CommittersFactory: committers.json processado por completo.`);
            return Promise.resolve();
        });
    }


    static carregarCommittersDosUltimosCommits() {
        console.log(`CommittersFactory: Iniciando carga dos committers dos ultimos commits...`);

        return CommittersFactory.getEmailsDosCommittersDosUltimosCommits().then((committersDosUltimosCommits: Email[]) => {
            let promisesDeCommittersInseridos: Promise<any>[] = [];

            console.info(`\tInserindo, se necessario, ultimos ${committersDosUltimosCommits.length} committers...`);
            committersDosUltimosCommits.forEach((committerEmail: Email) => {
                promisesDeCommittersInseridos.push(
                    GitLabService.getUserByEmail(committerEmail).then((gitlabUser: GitLabUser) => {
                        return sesol2Repository.insertIfNotExists(
                            new Committer(gitlabUser)
                        );
                    })
                );
            });

            return Promise.all(promisesDeCommittersInseridos).then(resultadosDasPromises => {
                let jahExistiam = 0;
                resultadosDasPromises.forEach(resultadoDePromise => {
                    if (!resultadoDePromise) {
                        jahExistiam++;
                    } else {
                        console.info('\t\t' + resultadoDePromise);
                    }
                });
                console.info(`\tJah existiam: ${jahExistiam}`);
                console.log("CommittersFactory: committers dos ultimos commits processados por completo!");
            });
        });
    }

    static getEmailsDosCommittersDosUltimosCommits(): Promise<Email[]> {
        return GitLabService.getCommits(100).then((commits: GitLabCommit[]) => {

            console.log(`\tCarregrando committers de ${commits.length} commits...`);

            let committersHash = {};
            commits.forEach(commit => {
                const emailCorrigido = Email.corrigirEmail(commit.author_email);
                committersHash[emailCorrigido] = true;
            });
            const committers = Object.keys(committersHash).map(c => new Email(c));

            return Promise.resolve(committers);
        });
    }

}
