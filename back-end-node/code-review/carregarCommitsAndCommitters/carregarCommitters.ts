import {GitLabCommit} from "../gitlab/GitLabCommit";
import * as Utils from "../util/Utils";
import * as sesol2Repository from "../domain/Sesol2Repository";
import * as Committer from "../domain/Committer";
import {GitLabService} from "../gitlab/GitLabService";
import {GitLabUser} from "../gitlab/GitLabUser";


function getEmailsDosCommittersDosUltimosCommits(): Promise<string[]> {
    return GitLabService.getCommits(100).then((commits: GitLabCommit[]) => {

        console.log(`Processando COMMITTERS...`);
        console.log(`\tCarregrando committers de ${commits.length} commits...`);

        let committersHash = {};
        commits.forEach(commit => {
            const emailCorrigido = Committer.corrigirEmail(commit.author_email);
            committersHash[emailCorrigido] = true;
        });
        const committers = Object.keys(committersHash);

        return Promise.resolve(committers);
    });
}

export function carregarCommitters() {

    return new Promise(resolve => {

        getEmailsDosCommittersDosUltimosCommits().then((committersDosUltimosCommits: string[]) => {
            let promisesDeCommittersInseridos = [];

            console.log(`\tInserindo, se necessario, ultimos ${committersDosUltimosCommits.length} committers...`);
            committersDosUltimosCommits.forEach((committerEmail: string) => {
                promisesDeCommittersInseridos.push(

                    GitLabService.getUser(committerEmail).then((gitlabUser:GitLabUser) => {
                        return sesol2Repository.insertIfNotExists(
                            new Committer(committerEmail, gitlabUser.name, gitlabUser.avatar_url, gitlabUser.username)
                        );

                    })

                );
            });

            Promise.all(promisesDeCommittersInseridos).then(resultadosDasPromises => {
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
                resolve();
            });
        })

    });
}