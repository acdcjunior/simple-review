"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const GitLabService_1 = require("../gitlab/GitLabService");
const Sesol2Repository_1 = require("../geral/Sesol2Repository");
const Committer_1 = require("./Committer");
const Email_1 = require("../geral/Email");
class CommitterConfigStruct {
}
class CommittersFactory {
    static carregarCommittersDoArquivo() {
        console.log(`CommittersFactory: Iniciando carga dos committers do committers.json...`);
        const arquivoCommitters = JSON.parse(fs.readFileSync('../config/committers.json', 'utf8'));
        let inserts = [];
        arquivoCommitters.committers.forEach((committer) => {
            inserts.push(GitLabService_1.GitLabService.getUserByUsername(committer.username).then((gitlabUser) => {
                if (!gitlabUser) {
                    throw new Error(`CommittersConfig: Commiter de username ${committer.username} não foi encontrado no GitLab!`);
                }
                return Sesol2Repository_1.sesol2Repository.insertIfNotExists(new Committer_1.Committer(gitlabUser, committer.aliases, committer.quota, committer.sexo));
            }));
        });
        return Promise.all(inserts).then(() => {
            console.log(`CommittersFactory: committers.json processado por completo.`);
            return Promise.resolve();
        });
    }
    static carregarCommittersDosUltimosCommits() {
        console.log(`CommittersFactory: Iniciando carga dos committers dos ultimos commits...`);
        return CommittersFactory.getEmailsDosCommittersDosUltimosCommits().then((committersDosUltimosCommits) => {
            let promisesDeCommittersInseridos = [];
            console.info(`\tInserindo, se necessario, ultimos ${committersDosUltimosCommits.length} committers...`);
            committersDosUltimosCommits.forEach((committerEmail) => {
                promisesDeCommittersInseridos.push(GitLabService_1.GitLabService.getUserByEmail(committerEmail).then((gitlabUser) => {
                    return Sesol2Repository_1.sesol2Repository.insertIfNotExists(new Committer_1.Committer(gitlabUser));
                }));
            });
            return Promise.all(promisesDeCommittersInseridos).then(resultadosDasPromises => {
                let jahExistiam = 0;
                resultadosDasPromises.forEach(resultadoDePromise => {
                    if (!resultadoDePromise) {
                        jahExistiam++;
                    }
                    else {
                        console.info('\t\t' + resultadoDePromise);
                    }
                });
                console.info(`\tJah existiam: ${jahExistiam}`);
                console.log("CommittersFactory: committers dos ultimos commits processados por completo!");
            });
        });
    }
    static getEmailsDosCommittersDosUltimosCommits() {
        return GitLabService_1.GitLabService.getCommits(100).then((commits) => {
            console.log(`\tCarregrando committers de ${commits.length} commits...`);
            let committersHash = {};
            commits.forEach(commit => {
                const emailCorrigido = Email_1.Email.corrigirEmail(commit.author_email);
                committersHash[emailCorrigido] = true;
            });
            const committers = Object.keys(committersHash).map(c => new Email_1.Email(c));
            return Promise.resolve(committers);
        });
    }
}
exports.CommittersFactory = CommittersFactory;
