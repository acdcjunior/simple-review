"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Utils = require("../util/Utils");
const sesol2Repository = require("../domain/Sesol2Repository");
const Committer = require("../domain/Committer");
const GitLabService_1 = require("../gitlab/GitLabService");
function getEmailsDosCommittersDosUltimosCommits() {
    return GitLabService_1.GitLabService.getCommits(100).then((commits) => {
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
function carregarCommitters() {
    return new Promise(resolve => {
        getEmailsDosCommittersDosUltimosCommits().then((committersDosUltimosCommits) => {
            let promisesDeCommittersInseridos = [];
            console.log(`\tInserindo, se necessario, ultimos ${committersDosUltimosCommits.length} committers...`);
            committersDosUltimosCommits.forEach((committerEmail) => {
                promisesDeCommittersInseridos.push(GitLabService_1.GitLabService.getUser(committerEmail).then((gitlabUser) => {
                    return sesol2Repository.insertIfNotExists(new Committer(committerEmail, gitlabUser.name, gitlabUser.avatar_url, gitlabUser.username));
                }));
            });
            Promise.all(promisesDeCommittersInseridos).then(resultadosDasPromises => {
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
                console.info("Fim da carga de committers!");
                Utils.printBar();
                resolve();
            });
        });
    });
}
exports.carregarCommitters = carregarCommitters;
