"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Sesol2Repository_1 = require("../geral/Sesol2Repository");
const Commit_1 = require("./Commit");
const RevisoresService_1 = require("./RevisoresService");
const GitLabService_1 = require("../gitlab/GitLabService");
class CommitFactory {
    static carregarCommits() {
        return GitLabService_1.GitLabService.getCommits().then(commits => {
            const promisesDeCommitsInseridos = [];
            console.log(`\n\nCommitFactory: Processando COMMITS...`);
            console.log(`\tCommitFactory: Processando ${commits.length} commits...`);
            commits.forEach(commit => {
                promisesDeCommitsInseridos.push(Sesol2Repository_1.sesol2Repository.insertIfNotExists(new Commit_1.Commit(commit.id, commit.title, commit.message, commit.author_email, commit.created_at)));
            });
            return Promise.all(promisesDeCommitsInseridos).then((resultadosDasPromises) => {
                let jahExistiam = 0;
                resultadosDasPromises.forEach(resultadoDePromise => {
                    if (!resultadoDePromise) {
                        jahExistiam++;
                    }
                    else {
                        console.log('\t\tCommitFactory: ' + resultadoDePromise);
                    }
                });
                console.log(`\tCommitFactory: Jah existiam: ${jahExistiam}\n\n`);
                return RevisoresService_1.RevisoresService.atribuirRevisores();
            });
        });
    }
}
exports.CommitFactory = CommitFactory;
