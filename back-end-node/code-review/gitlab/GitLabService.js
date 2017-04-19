"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const GitLabConfig_1 = require("../domain/GitLabConfig");
const rest_1 = require("../infra/rest");
class GitLabService {
    static getCommits(perPage = 10) {
        return rest_1.rest("GET", GitLabConfig_1.GitLabConfig.projectsUrl(perPage), GitLabConfig_1.GitLabConfig.privateToken);
    }
    static getUser(committerEmail) {
        return rest_1.rest("GET", GitLabConfig_1.GitLabConfig.usersUrl(committerEmail), GitLabConfig_1.GitLabConfig.privateToken).then(users => {
            if (users.length !== 1) {
                throw new Error('USUARIO NAO ENCONTRADO DE MANEIRA UNICA');
            }
            return Promise.resolve(users[0]);
        });
    }
}
exports.GitLabService = GitLabService;
