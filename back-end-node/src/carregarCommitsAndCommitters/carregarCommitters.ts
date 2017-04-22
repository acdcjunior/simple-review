import {GitLabCommit} from "../gitlab/GitLabCommit";
import {Utils} from "../util/Utils";
import {sesol2Repository} from "../domain/Sesol2Repository";
import {Committer} from "../domain/Committer";
import {GitLabService} from "../gitlab/GitLabService";
import {GitLabUser} from "../gitlab/GitLabUser";
import {Email} from "../geral/Email";


function getEmailsDosCommittersDosUltimosCommits(): Promise<Email[]> {
    return GitLabService.getCommits(100).then((commits: GitLabCommit[]) => {

        console.log(`Processando COMMITTERS...`);
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

export function carregarCommitters() {
    return getEmailsDosCommittersDosUltimosCommits().then((committersDosUltimosCommits: Email[]) => {
        let promisesDeCommittersInseridos = [];

        console.log(`\tInserindo, se necessario, ultimos ${committersDosUltimosCommits.length} committers...`);
        committersDosUltimosCommits.forEach((committerEmail: Email) => {
            promisesDeCommittersInseridos.push(
                GitLabService.getUserByEmail(committerEmail).then((gitlabUser: GitLabUser) => {
                    return sesol2Repository.insertIfNotExists(
                        new Committer(committerEmail, gitlabUser.name, gitlabUser.avatar_url, gitlabUser.username)
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
                    console.log('\t\t' + resultadoDePromise);
                }
            });
            console.log(`\tJah existiam: ${jahExistiam}`);
            console.info("Fim da carga de committers!");

            Utils.printBar();
        });
    });
}
