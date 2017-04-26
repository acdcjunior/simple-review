import * as fs from "fs";
import {GitLabService} from "../gitlab/GitLabService";
import {GitLabUser} from "../gitlab/GitLabUser";
import {sesol2Repository} from "../geral/Sesol2Repository";
import {Committer} from "./Committer";
import {Email} from "../geral/Email";
import {GitLabCommit} from "../gitlab/GitLabCommit";
import {GitLabImpersonationToken} from "../gitlab/GitLabImpersonationToken";
import {arquivoProjeto, CommitterConfigStruct} from "../geral/arquivoProjeto";

export class CommittersFactory {

    static carregarCommittersDoArquivo() {
        console.log(`\n\nCommittersFactory: Iniciando carga dos committers do projeto.json...`);
        console.log(`\tCommittersFactory: Inserindo (se nao existirem) ${arquivoProjeto.committers.length} committers...`);

        let promisesDeCommittersInseridos: Promise<string>[] = [];
        arquivoProjeto.committers.forEach((committer: CommitterConfigStruct) => {
            promisesDeCommittersInseridos.push(
                GitLabService.getUserByUsername(committer.username).then((gitlabUser: GitLabUser) => {
                    if (!gitlabUser) {
                        throw new Error(`CommittersFactory: Commiter de username ${committer.username} não foi encontrado no GitLab!`);
                    }
                    return GitLabService.criarImpersonationToken(gitlabUser.id).then((gitlabImpersonationToken: GitLabImpersonationToken) => {
                        return sesol2Repository.insertIfNotExists(
                            new Committer(gitlabUser, gitlabImpersonationToken, committer.aliases, committer.quota, committer.sexo)
                        );
                    });
                })
            );
        });
        return Promise.all(promisesDeCommittersInseridos).then((resultadosDasPromises: string[]) => {
            CommittersFactory.exibirQuantidadeQueJahExistia(resultadosDasPromises);
            console.log(`CommittersFactory: projeto.json processado por completo!\n`);
            return Promise.resolve();
        });
    }


    static carregarCommittersDosUltimosCommits() {
        console.log(`\n\nCommittersFactory: Iniciando carga dos committers dos ultimos commits...`);

        return CommittersFactory.getEmailsDosCommittersDosUltimosCommits().then((committersDosUltimosCommits: Email[]) => {
            let promisesDeCommittersInseridos: Promise<any>[] = [];

            console.info(`\tCommittersFactory: Inserindo (se nao existirem) ultimos ${committersDosUltimosCommits.length} committers...`);
            committersDosUltimosCommits.forEach((committerEmail: Email) => {
                console.info(`\t\tCommittersFactory: Inserindo commiter de email ${committerEmail.email}...`);
                promisesDeCommittersInseridos.push(
                    GitLabService.getUserByEmail(committerEmail).then((gitlabUser: GitLabUser) => {
                        if (!gitlabUser) {
                            throw new Error(`CommittersFactory: Commiter de email ${committerEmail.email} não foi encontrado no GitLab!`);
                        }
                        console.info(`\t\t\tCommittersFactory: commiter de email ${committerEmail.email} encontrado com o username ${gitlabUser.username} e email ${gitlabUser.email}...`);
                        return GitLabService.criarImpersonationToken(gitlabUser.id).then((gitlabImpersonationToken: GitLabImpersonationToken) => {
                            return sesol2Repository.insertIfNotExists(
                                new Committer(gitlabUser, gitlabImpersonationToken)
                            );
                        });
                    })
                );
            });

            return Promise.all(promisesDeCommittersInseridos).then((resultadosDasPromises: string[]) => {
                CommittersFactory.exibirQuantidadeQueJahExistia(resultadosDasPromises);
                console.log("CommittersFactory: committers dos ultimos commits processados por completo!\n\n");
            });
        });
    }

    private static exibirQuantidadeQueJahExistia(resultadosDasPromises: string[]) {
        let jahExistiam = 0;
        resultadosDasPromises.forEach(resultadoDePromise => {
            if (!resultadoDePromise) {
                jahExistiam++;
            } else {
                console.info('\t\tCommittersFactory: ' + resultadoDePromise);
            }
        });
        console.info(`\tCommittersFactory: Jah existiam: ${jahExistiam}`);
    }

    static getEmailsDosCommittersDosUltimosCommits(): Promise<Email[]> {
        return GitLabService.getCommits(100).then((commits: GitLabCommit[]) => {

            console.log(`\tCommittersFactory: Carregando committers de ${commits.length} commits...`);

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
