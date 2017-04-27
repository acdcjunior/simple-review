"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Email_1 = require("../geral/Email");
const arquivoProjeto_1 = require("../geral/arquivoProjeto");
let host = process.env.GITLAB_HOST;
let projectId = process.env.GITLAB_HOST_PROJECT_ID;
let projectBranch = process.env.GITLAB_HOST_PROJECT_BRANCH;
let tokenUsuarioComentador = process.env.GITLAB_HOST_PRIVATE_TOKEN_USUARIO_COMENTADOR;
let tokenAdmin = process.env.GITLAB_HOST_PRIVATE_TOKEN_ADMIN;
if (require("os").hostname() === "delljr") {
    host = '127.0.0.1:8090';
    projectId = 3;
    projectBranch = 'desenvolvimento';
    tokenUsuarioComentador = 'iU_63HEeqBJG6gQXuQha';
    tokenAdmin = 'iU_63HEeqBJG6gQXuQha';
}
if (require("os").hostname() === "E-098571") {
    host = 'git';
    projectId = 123;
    projectBranch = 'desenvolvimento';
    tokenUsuarioComentador = 'x';
    tokenAdmin = 'yj2--5cKKCSqaDRoND7N';
}
class GitLabConfig {
    static projectsUrl(perPage = 10, projectBranch, since) {
        return `http://${host}/api/v4/projects/${projectId}/repository/commits/?ref_name=${projectBranch}&per_page=${perPage}&since=${since}`;
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
    static impersonationTokenUrl(user_id) {
        return `http://${host}/api/v4/users/${user_id}/impersonation_tokens`;
    }
    static get tokenUsuarioComentador() {
        return tokenUsuarioComentador;
    }
    static get tokenAdmin() {
        return tokenAdmin;
    }
}
exports.GitLabConfig = GitLabConfig;
console.log(`
    BACKEND --> GITLAB
    ----------------------------------------------------
    host: ${host}
    projectId: ${projectId}
    projectBranch: ${projectBranch}
    
    privateToken: ${tokenUsuarioComentador}
    tokenAdmin: ${tokenAdmin}
    
    projectsUrl: ${GitLabConfig.projectsUrl(100, arquivoProjeto_1.arquivoProjeto.branches[0], arquivoProjeto_1.arquivoProjeto.dataCortePrimeiroCommit)}
    usersUrl: ${GitLabConfig.usersUrlByEmail(new Email_1.Email('meu@email.com'))}
    commentsUrl: ${GitLabConfig.commentsUrl('sha1234')}
    ----------------------------------------------------
`);
if (!host || !projectId || !projectBranch || !tokenUsuarioComentador || !tokenAdmin) {
    throw new Error(`Variáveis de ambiente do GitLabConfig nao configuradas!`);
}
