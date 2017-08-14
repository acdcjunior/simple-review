"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Sesol2Repository_1 = require("../geral/Sesol2Repository");
const Commit_1 = require("./Commit");
const RevisoresService_1 = require("./RevisoresService");
const GitLabService_1 = require("../gitlab/GitLabService");
class CommitFactory {
    static carregarCommits() {
        return GitLabService_1.GitLabService.getCommits().then(commits => {
            console.log(`\n\n\tCommitFactory: Processando Commits...`);
            console.log(`\t\tCommitFactory: Inserindo (se nao existirem) ${commits.length} commits...`);
            return Promise.all(commits.map(commit => Sesol2Repository_1.sesol2Repository.insertIfNotExists(new Commit_1.Commit(commit.id, commit.title, commit.message, commit.author_email, commit.created_at)).catch((e) => {
                console.error('Error while inserting into repository!', e);
            }))).then((resultadosDasPromises) => {
                let jahExistiam = 0;
                resultadosDasPromises.forEach(resultadoDePromise => {
                    if (!resultadoDePromise) {
                        jahExistiam++;
                    }
                    else {
                        console.log('\t\t\tCommitFactory: ' + resultadoDePromise);
                    }
                });
                console.log(`\t\tCommitFactory: Jah existiam: ${jahExistiam}`);
                console.log(`\tCommitFactory: insercao de commits concluida!\n`);
                return RevisoresService_1.RevisoresService.atribuirRevisores();
            });
        });
    }
}
exports.CommitFactory = CommitFactory;
