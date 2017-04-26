"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const GitLabConfig_1 = require("./GitLabConfig");
const rest_1 = require("../infra/rest");
const arquivoProjeto_1 = require("../geral/arquivoProjeto");
const TEXTO_TOKEN_CRIADO_POR_CODEREVIEW = "Criado via CodeReview/GitLabService.criarImpersonationToken()";
class GitLabService {
    static getCommits(perPage = 100) {
        // TODO permitir mais de dois branches
        return rest_1.rest("GET", GitLabConfig_1.GitLabConfig.projectsUrl(perPage, arquivoProjeto_1.arquivoProjeto.branches[0], arquivoProjeto_1.arquivoProjeto.dataCortePrimeiroCommit), GitLabConfig_1.GitLabConfig.tokenAdmin).then((commitsZero) => {
            return rest_1.rest("GET", GitLabConfig_1.GitLabConfig.projectsUrl(perPage, arquivoProjeto_1.arquivoProjeto.branches[1], arquivoProjeto_1.arquivoProjeto.dataCortePrimeiroCommit), GitLabConfig_1.GitLabConfig.tokenAdmin).then((commitsUm) => {
                return Promise.resolve(commitsZero.concat(commitsUm));
            });
        });
    }
    static getUserByEmail(committerEmail) {
        return rest_1.rest("GET", GitLabConfig_1.GitLabConfig.usersUrlByEmail(committerEmail), GitLabConfig_1.GitLabConfig.tokenAdmin).then(users => {
            if (users.length === 0) {
                throw new Error(`Usuario GitLab com email <${committerEmail.email}> não encontrado!`);
            }
            if (users.length > 1) {
                throw new Error(`Encontrado MAIS DE UM (${users.length}) usuario GitLab com email <${committerEmail.email}>:\n${JSON.stringify(users)}`);
            }
            return Promise.resolve(users[0]);
        });
    }
    static getUserByUsername(username) {
        return rest_1.rest("GET", GitLabConfig_1.GitLabConfig.usersUsernameUrl(username), GitLabConfig_1.GitLabConfig.tokenAdmin).then(users => {
            return Promise.resolve(users[0]);
        });
    }
    static comentar(commitSha, comentario) {
        if (this.desabilitarComentariosNoGitLab) {
            return Promise.resolve();
        }
        return rest_1.rest("POST", GitLabConfig_1.GitLabConfig.commentsUrl(commitSha), GitLabConfig_1.GitLabConfig.tokenUsuarioComentador, {
            note: comentario
        }).then(naoSeiQualOTipo => {
            console.log(`
            
            Resuldado da promise COMENTAR:
            ${naoSeiQualOTipo}
            
            `);
            return Promise.resolve();
        });
    }
    static criarImpersonationToken(user_id) {
        return rest_1.rest("GET", GitLabConfig_1.GitLabConfig.impersonationTokenUrl(user_id) + "?state=active", GitLabConfig_1.GitLabConfig.tokenAdmin).then((tokens) => {
            const tokenJahCriadoPorNos = tokens.find(token => token.name === TEXTO_TOKEN_CRIADO_POR_CODEREVIEW);
            if (tokenJahCriadoPorNos) {
                return Promise.resolve(tokenJahCriadoPorNos);
            }
            else {
                // criamos um token novo
                let r = rest_1.rest("POST", GitLabConfig_1.GitLabConfig.impersonationTokenUrl(user_id), GitLabConfig_1.GitLabConfig.tokenAdmin);
                let form = r.form();
                form.append('user_id', 'user_id');
                form.append('name', TEXTO_TOKEN_CRIADO_POR_CODEREVIEW);
                form.append('scopes[]', 'api');
                form.append('scopes[]', 'read_user');
                return r;
            }
        });
    }
}
GitLabService.desabilitarComentariosNoGitLab = false;
exports.GitLabService = GitLabService;
