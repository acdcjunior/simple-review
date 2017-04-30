import {sesol2Repository} from "../geral/Sesol2Repository";
import {Commit} from "./Commit";
import {RevisoresService} from "./RevisoresService";
import {GitLabService} from "../gitlab/GitLabService";

export class CommitFactory {

    static carregarCommits() {

        return GitLabService.getCommits().then(commits => {
            console.log(`\n\n\tCommitFactory: Processando Commits...`);

            console.log(`\t\tCommitFactory: Inserindo (se nao existirem) ${commits.length} commits...`);
            return Promise.all(commits.map(commit =>
                sesol2Repository.insertIfNotExists(
                    new Commit(commit.id, commit.title, commit.message, commit.author_email, commit.created_at)
                )
            )).then((resultadosDasPromises: string[]) => {
                let jahExistiam = 0;
                resultadosDasPromises.forEach(resultadoDePromise => {
                    if (!resultadoDePromise) {
                        jahExistiam++;
                    } else {
                        console.log('\t\t\tCommitFactory: ' + resultadoDePromise);
                    }
                });
                console.log(`\t\tCommitFactory: Jah existiam: ${jahExistiam}`);
                console.log(`\tCommitFactory: insercao de commits concluida!\n`);

                return RevisoresService.atribuirRevisores();
            });
        });

    }

}