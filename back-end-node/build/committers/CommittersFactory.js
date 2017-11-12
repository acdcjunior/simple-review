"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const GitLabService_1 = require("../gitlab/GitLabService");
const Sesol2Repository_1 = require("../geral/Sesol2Repository");
const Committer_1 = require("./Committer");
const Email_1 = require("../geral/Email");
const CodeReviewConfig_1 = require("../geral/CodeReviewConfig");
class CommittersFactory {
    static carregarCommittersDoArquivo() {
        console.log(`\n\n\tCommittersFactory: Iniciando carga dos committers do projeto.json...`);
        const botMaisCommitters = CodeReviewConfig_1.codeReviewConfig.committers.concat(CodeReviewConfig_1.codeReviewConfig.botComentador);
        console.log(`\t\tCommittersFactory: Inserindo (se nao existirem) bot + ${CodeReviewConfig_1.codeReviewConfig.committers.length} committers...`);
        return Promise.all(botMaisCommitters.map((committer) => {
            return GitLabService_1.GitLabService.getUserByUsername(committer.username).then((gitlabUser) => {
                if (!gitlabUser) {
                    throw new Error(`CommittersFactory: Commiter de username ${committer.username} não foi encontrado no GitLab!`);
                }
                return GitLabService_1.GitLabService.criarImpersonationToken(gitlabUser.id).then((gitlabImpersonationToken) => {
                    return Sesol2Repository_1.sesol2Repository.insertIfNotExists(new Committer_1.Committer(gitlabUser, gitlabImpersonationToken, committer.aliases, committer.quota, committer.sexo));
                });
            });
        })).then((resultadosDasPromises) => {
            CommittersFactory.exibirQuantidadeQueJahExistia(resultadosDasPromises);
            console.log(`\tCommittersFactory: projeto.json processado por completo!\n`);
        }).catch((reason) => {
            console.log(`\tCommittersFactory: error while inserting users!\n`, reason);
        });
    }
    static carregarCommittersDosUltimosCommits() {
        console.log(`\n\n\tCommittersFactory: Iniciando carga dos committers dos ultimos commits...`);
        return CommittersFactory.getEmailsDosCommittersDosUltimosCommits().then((committersDosUltimosCommits) => {
            let promisesDeCommittersInseridos = [];
            console.info(`\t\tCommittersFactory: Inserindo (se nao existirem) ultimos ${committersDosUltimosCommits.length} committers...`);
            committersDosUltimosCommits.forEach((committerEmail) => {
                console.info(`\t\t\tCommittersFactory: Inserindo commiter de email ${committerEmail.email}...`);
                promisesDeCommittersInseridos.push(GitLabService_1.GitLabService.getUserByEmail(committerEmail).then((gitlabUser) => {
                    if (!gitlabUser) {
                        throw new Error(`CommittersFactory: Commiter de email ${committerEmail.email} não foi encontrado no GitLab!`);
                    }
                    console.info(`\t\t\t\tCommittersFactory: commiter de email ${committerEmail.email} encontrado com o username ${gitlabUser.username} e email ${gitlabUser.email}...`);
                    return GitLabService_1.GitLabService.criarImpersonationToken(gitlabUser.id).then((gitlabImpersonationToken) => {
                        return Sesol2Repository_1.sesol2Repository.insertIfNotExists(new Committer_1.Committer(gitlabUser, gitlabImpersonationToken));
                    });
                }).catch((e) => {
                    console.error('####################################################################################################');
                    console.error(e.message);
                    console.error('####################################################################################################');
                    return Promise.resolve();
                }));
            });
            return Promise.all(promisesDeCommittersInseridos).then((resultadosDasPromises) => {
                CommittersFactory.exibirQuantidadeQueJahExistia(resultadosDasPromises);
                console.log("\tCommittersFactory: committers dos ultimos commits processados por completo!\n\n");
            });
        });
    }
    static exibirQuantidadeQueJahExistia(resultadosDasPromises) {
        let jahExistiam = 0;
        resultadosDasPromises.forEach(resultadoDePromise => {
            if (!resultadoDePromise) {
                jahExistiam++;
            }
            else {
                console.info('\t\t\tCommittersFactory: ' + resultadoDePromise);
            }
        });
        console.info(`\t\tCommittersFactory: Jah existiam: ${jahExistiam}`);
    }
    static getEmailsDosCommittersDosUltimosCommits() {
        return GitLabService_1.GitLabService.getCommits(100).then((commits) => {
            console.log(`\t\tCommittersFactory: Carregando committers de ${commits.length} commits...`);
            let committersHash = {};
            commits.forEach(commit => {
                const emailCorrigido = Email_1.Email.corrigirEmail(commit.author_email);
                committersHash[emailCorrigido] = true;
            });
            return Object.keys(committersHash).map(c => new Email_1.Email(c));
        });
    }
}
exports.CommittersFactory = CommittersFactory;
