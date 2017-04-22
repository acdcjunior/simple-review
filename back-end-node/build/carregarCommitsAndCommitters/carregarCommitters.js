"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Utils_1 = require("../util/Utils");
const Sesol2Repository_1 = require("../domain/Sesol2Repository");
const Committer_1 = require("../domain/Committer");
const GitLabService_1 = require("../gitlab/GitLabService");
const Email_1 = require("../geral/Email");
function getEmailsDosCommittersDosUltimosCommits() {
    return GitLabService_1.GitLabService.getCommits(100).then((commits) => {
        console.log(`Processando COMMITTERS...`);
        console.log(`\tCarregrando committers de ${commits.length} commits...`);
        let committersHash = {};
        commits.forEach(commit => {
            const emailCorrigido = Email_1.Email.corrigirEmail(commit.author_email);
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
                promisesDeCommittersInseridos.push(GitLabService_1.GitLabService.getUserByEmail(new Email_1.Email(committerEmail)).then((gitlabUser) => {
                    return Sesol2Repository_1.sesol2Repository.insertIfNotExists(new Committer_1.Committer(committerEmail, gitlabUser.name, gitlabUser.avatar_url, gitlabUser.username));
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
                Utils_1.Utils.printBar();
                resolve();
            });
        });
    });
}
exports.carregarCommitters = carregarCommitters;
