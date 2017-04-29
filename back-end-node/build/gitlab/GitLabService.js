"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rest_1 = require("../infra/rest");
const Email_1 = require("../geral/Email");
const ArrayUtils_1 = require("../geral/ArrayUtils");
const CodeReviewConfig_1 = require("../geral/CodeReviewConfig");
class GitLabConfig {
    static branchesUrl() {
        return `http://${CodeReviewConfig_1.codeReviewConfig.host}/api/v4/projects/${CodeReviewConfig_1.codeReviewConfig.projectId}/repository/branches`;
    }
    static projectsUrl(perPage = 10, projectBranch, since) {
        return `http://${CodeReviewConfig_1.codeReviewConfig.host}/api/v4/projects/${CodeReviewConfig_1.codeReviewConfig.projectId}/repository/commits/?ref_name=${projectBranch}&per_page=${perPage}&since=${since}`;
    }
    static usersUrlByEmail(committerEmail) {
        return `http://${CodeReviewConfig_1.codeReviewConfig.host}/api/v4/users/?search=${committerEmail.email}`;
    }
    static usersUsernameUrl(username) {
        return `http://${CodeReviewConfig_1.codeReviewConfig.host}/api/v4/users/?username=${username}`;
    }
    static commentsUrl(sha) {
        return `http://${CodeReviewConfig_1.codeReviewConfig.host}/api/v4/projects/${CodeReviewConfig_1.codeReviewConfig.projectId}/repository/commits/${sha}/comments`;
    }
    static impersonationTokenUrl(user_id) {
        return `http://${CodeReviewConfig_1.codeReviewConfig.host}/api/v4/users/${user_id}/impersonation_tokens`;
    }
}
GitLabConfig.tokenUsuarioComentador = CodeReviewConfig_1.codeReviewConfig.tokenUsuarioComentador;
GitLabConfig.tokenAdmin = CodeReviewConfig_1.codeReviewConfig.tokenAdmin;
exports.GitLabConfig = GitLabConfig;
console.log(`
    BACKEND --> GITLAB urls exemplo
    ----------------------------------------------------
    usersUrl: ${GitLabConfig.usersUrlByEmail(new Email_1.Email('meu@email.com'))}
    commentsUrl: ${GitLabConfig.commentsUrl('sha1234')}
    ----------------------------------------------------
`);
class GitLabService {
    static getBranches() {
        return rest_1.Rest.get(GitLabConfig.branchesUrl(), GitLabConfig.tokenAdmin).then((branches) => {
            return Promise.resolve(branches.filter((branch) => CodeReviewConfig_1.codeReviewConfig.branchesIgnorados.indexOf(branch.name) === -1));
        });
    }
    static getCommits(perPage = 100) {
        return GitLabService.getBranches().then((branches) => {
            const branchNames = branches.map((gitLabBranch) => gitLabBranch.name);
            return Promise.all(branchNames.map((branch) => {
                return rest_1.Rest.get(GitLabConfig.projectsUrl(perPage, branch, CodeReviewConfig_1.codeReviewConfig.dataCortePrimeiroCommit), GitLabConfig.tokenAdmin);
            })).then((commitsDeCadaBranch) => {
                return Promise.resolve(ArrayUtils_1.ArrayUtils.flatten(commitsDeCadaBranch));
            });
        });
    }
    static getUserByEmail(committerEmail) {
        return rest_1.rest("GET", GitLabConfig.usersUrlByEmail(committerEmail), GitLabConfig.tokenAdmin).then(users => {
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
        return rest_1.rest("GET", GitLabConfig.usersUsernameUrl(username), GitLabConfig.tokenAdmin).then(users => {
            return Promise.resolve(users[0]);
        });
    }
    static comentar(commitSha, comentario) {
        if (this.desabilitarComentariosNoGitLab) {
            return Promise.resolve();
        }
        return rest_1.Rest.post(GitLabConfig.commentsUrl(commitSha), GitLabConfig.tokenUsuarioComentador, {
            note: comentario
        }).then(naoSeiQualOTipo => {
            console.log(`
            
            Resuldado da promise COMENTAR:
            ${JSON.stringify(naoSeiQualOTipo, null, '\t')}
            
            `);
            return Promise.resolve();
        });
    }
    static criarImpersonationToken(user_id) {
        return rest_1.rest("GET", GitLabConfig.impersonationTokenUrl(user_id) + "?state=active", GitLabConfig.tokenAdmin).then((tokens) => {
            const tokenJahCriadoPorNos = tokens.find(token => token.name === CodeReviewConfig_1.codeReviewConfig.mensagemTokenCriadoPorCodeReview);
            if (tokenJahCriadoPorNos) {
                return Promise.resolve(tokenJahCriadoPorNos);
            }
            else {
                // criamos um token novo
                let r = rest_1.Rest.post(GitLabConfig.impersonationTokenUrl(user_id), GitLabConfig.tokenAdmin);
                let form = r.form();
                form.append('user_id', 'user_id');
                form.append('name', CodeReviewConfig_1.codeReviewConfig.mensagemTokenCriadoPorCodeReview);
                form.append('scopes[]', 'api');
                form.append('scopes[]', 'read_user');
                return r;
            }
        });
    }
}
GitLabService.desabilitarComentariosNoGitLab = false;
exports.GitLabService = GitLabService;
