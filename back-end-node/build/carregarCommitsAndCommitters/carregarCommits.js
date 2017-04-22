"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Utils_1 = require("../util/Utils");
const Sesol2Repository_1 = require("../domain/Sesol2Repository");
const Commit_1 = require("../domain/Commit");
const atribuirRevisores_1 = require("./atribuirRevisores");
const GitLabService_1 = require("../gitlab/GitLabService");
function carregarCommits() {
    return GitLabService_1.GitLabService.getCommits().then(commits => {
        const promisesDeCommitsInseridos = [];
        console.log(`Processando COMMITS...`);
        console.log(`\tProcessando ${commits.length} commits...`);
        commits.forEach(commit => {
            promisesDeCommitsInseridos.push(Sesol2Repository_1.sesol2Repository.insertIfNotExists(new Commit_1.Commit(commit.id, commit.title, commit.message, commit.author_email, commit.created_at)));
        });
        return Promise.all(promisesDeCommitsInseridos).then(resultadosDasPromises => {
            let jahExistiam = 0;
            resultadosDasPromises.forEach(resultadoDePromise => {
                if (!resultadoDePromise) {
                    jahExistiam++;
                }
                else {
                    console.log('\t\t' + resultadoDePromise);
                }
            });
            console.log(`\tJah existiam: ${jahExistiam}`);
            Utils_1.Utils.printBar();
            return atribuirRevisores_1.atribuirRevisores();
        });
    });
}
exports.carregarCommits = carregarCommits;
