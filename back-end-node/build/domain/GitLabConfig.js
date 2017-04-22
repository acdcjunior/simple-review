"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Committer_1 = require("./Committer");
let host = process.env.GITLAB_HOST || 'git6';
let projectId = process.env.GITLAB_HOST_PROJECT_ID || 123;
let projectBranch = process.env.GITLAB_HOST_PROJECT_BRANCH || 'desenvolvimento';
let privateToken = process.env.GITLAB_HOST_PRIVATE_TOKEN || 'X_zfYU5k2VwDx2KegmdQ';
let tokenReadUsers = process.env.GITLAB_HOST_PRIVATE_TOKEN_READ_USERS || 'Esj8Vxs__raBTUkX1Zns';
if (true) {
    host = '127.0.0.1:8090';
    projectId = 3;
    projectBranch = 'desenvolvimento';
    privateToken = 'iU_63HEeqBJG6gQXuQha';
    tokenReadUsers = 'iU_63HEeqBJG6gQXuQha';
}
class GitLabConfig {
    static projectsUrl(perPage = 10) {
        return `http://${host}/api/v4/projects/${projectId}/repository/commits/?ref_name=${projectBranch}&per_page=${perPage}`;
    }
    static usersUrl(committerEmail) {
        const emailCorrigido = Committer_1.Committer.corrigirEmail(committerEmail);
        return `http://${host}/api/v4/users/?search=${emailCorrigido}`;
    }
    static usersUsernameUrl(username) {
        return `http://${host}/api/v4/users/?username=${username}`;
    }
    static commentsUrl(sha) {
        return `http://${host}/api/v4/projects/${projectId}/repository/commits/${sha}/comments`;
    }
    static get privateToken() {
        return privateToken;
    }
    static get tokenReadUsers() {
        return tokenReadUsers;
    }
}
exports.GitLabConfig = GitLabConfig;
console.log(`
    DADOS USADOS PARA CONEXAO DO BACKEND NODE COM GITLAB
    ----------------------------------------------------
    host: ${host}
    projectId: ${projectId}
    projectBranch: ${projectBranch}
    privateToken: ${privateToken}
    projectsUrl: ${GitLabConfig.projectsUrl()}
    usersUrl: ${GitLabConfig.usersUrl('meu@email.com')}
    commentsUrl: ${GitLabConfig.commentsUrl('sha1234')}
    ----------------------------------------------------
`);