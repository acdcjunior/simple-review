"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Email_1 = require("../geral/Email");
let host = process.env.GITLAB_HOST || 'git6';
let projectId = process.env.GITLAB_HOST_PROJECT_ID || 123;
let projectBranch = process.env.GITLAB_HOST_PROJECT_BRANCH || 'desenvolvimento';
let privateToken = process.env.GITLAB_HOST_PRIVATE_TOKEN || 'X_zfYU5k2VwDx2KegmdQ';
let tokenReadUsers = process.env.GITLAB_HOST_PRIVATE_TOKEN_READ_USERS || 'Esj8Vxs__raBTUkX1Zns';
if (require("os").hostname() === "delljr") {
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
    static usersUrlByEmail(committerEmail) {
        return `http://${host}/api/v4/users/?search=${committerEmail.email}`;
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
    BACKEND --> GITLAB
    ----------------------------------------------------
    host: ${host}
    projectId: ${projectId}
    projectBranch: ${projectBranch}
    
    privateToken: ${privateToken}
    tokenReadUsers: ${tokenReadUsers}
    
    projectsUrl: ${GitLabConfig.projectsUrl()}
    usersUrl: ${GitLabConfig.usersUrlByEmail(new Email_1.Email('meu@email.com'))}
    commentsUrl: ${GitLabConfig.commentsUrl('sha1234')}
    ----------------------------------------------------
`);
