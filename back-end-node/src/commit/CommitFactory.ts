import {Utils} from "../util/Utils";
import {sesol2Repository} from "../domain/Sesol2Repository";
import {Commit} from "./Commit";
import {atribuirRevisores} from "./RevisoresService";
import {GitLabService} from "../gitlab/GitLabService";

export class CommitFactory {

    static carregarCommits() {

    return GitLabService.getCommits().then(commits => {
        const promisesDeCommitsInseridos = [];

        console.log(`Processando COMMITS...`);
        console.log(`\tProcessando ${commits.length} commits...`);
        commits.forEach(commit => {
            promisesDeCommitsInseridos.push(sesol2Repository.insertIfNotExists(
                new Commit(commit.id, commit.title, commit.message, commit.author_email, commit.created_at)
            ));
        });

        return Promise.all(promisesDeCommitsInseridos).then(resultadosDasPromises => {
            let jahExistiam = 0;
            resultadosDasPromises.forEach(resultadoDePromise => {
                if (!resultadoDePromise) {
                    jahExistiam++;
                } else {
                    console.log('\t\t' + resultadoDePromise);
                }
            });
            console.log(`\tJah existiam: ${jahExistiam}`);
            Utils.printBar();

            return atribuirRevisores();
        });
    });

}

}