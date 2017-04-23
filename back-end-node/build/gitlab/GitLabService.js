"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const GitLabConfig_1 = require("./GitLabConfig");
const rest_1 = require("../infra/rest");
class GitLabService {
    static getCommits(perPage = 10) {
        return rest_1.rest("GET", GitLabConfig_1.GitLabConfig.projectsUrl(perPage), GitLabConfig_1.GitLabConfig.privateToken);
    }
    static getUserByEmail(committerEmail) {
        return rest_1.rest("GET", GitLabConfig_1.GitLabConfig.usersUrlByEmail(committerEmail), GitLabConfig_1.GitLabConfig.privateToken).then(users => {
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
        return rest_1.rest("GET", GitLabConfig_1.GitLabConfig.usersUsernameUrl(username), GitLabConfig_1.GitLabConfig.tokenReadUsers).then(users => {
            return Promise.resolve(users[0]);
        });
    }
    static comentar(commitSha, comentario) {
        if (this.desabilitarComentariosNoGitLab) {
            return Promise.resolve();
        }
        return rest_1.rest("POST", GitLabConfig_1.GitLabConfig.commentsUrl(commitSha), GitLabConfig_1.GitLabConfig.privateToken, {
            note: comentario
        });
    }
}
GitLabService.desabilitarComentariosNoGitLab = false;
exports.GitLabService = GitLabService;
