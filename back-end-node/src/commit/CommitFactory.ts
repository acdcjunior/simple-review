import {sesol2Repository} from "../geral/Sesol2Repository";
import {Commit} from "./Commit";
import {RevisoresService} from "./RevisoresService";
import {GitLabService} from "../gitlab/GitLabService";

export class CommitFactory {

    static carregarCommits() {

        return GitLabService.getCommits().then(commits => {
            const promisesDeCommitsInseridos: Promise<string>[] = [];

            console.log(`\n\nCommitFactory: Processando COMMITS...`);
            console.log(`\tCommitFactory: Processando ${commits.length} commits...`);
            commits.forEach(commit => {
                promisesDeCommitsInseridos.push(sesol2Repository.insertIfNotExists(
                    new Commit(commit.id, commit.title, commit.message, commit.author_email, commit.created_at)
                ));
            });

            return Promise.all(promisesDeCommitsInseridos).then((resultadosDasPromises: string[]) => {
                let jahExistiam = 0;
                resultadosDasPromises.forEach(resultadoDePromise => {
                    if (!resultadoDePromise) {
                        jahExistiam++;
                    } else {
                        console.log('\t\tCommitFactory: ' + resultadoDePromise);
                    }
                });
                console.log(`\tCommitFactory: Jah existiam: ${jahExistiam}\n\n`);

                return RevisoresService.atribuirRevisores();
            });
        });

    }

}