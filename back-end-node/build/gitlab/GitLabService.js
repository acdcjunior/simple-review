"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rest_1 = require("../infra/rest");
const Email_1 = require("../geral/Email");
const ArrayUtils_1 = require("../geral/ArrayUtils");
const CodeReviewConfig_1 = require("../geral/CodeReviewConfig");
const MencoesExtractor_1 = require("../geral/MencoesExtractor");
class GitLabURLs {
    static branchesUrl() {
        return `http://${CodeReviewConfig_1.codeReviewConfig.gitlabHost}/api/v4/projects/${CodeReviewConfig_1.codeReviewConfig.projeto.projectId}/repository/branches`;
    }
    static projectsUrl(perPage = 10, projectBranch, since) {
        return `http://${CodeReviewConfig_1.codeReviewConfig.gitlabHost}/api/v4/projects/${CodeReviewConfig_1.codeReviewConfig.projeto.projectId}/repository/commits/?ref_name=${projectBranch}&per_page=${perPage}&since=${since}`;
    }
    static usersUrlByEmail(committerEmail) {
        return `http://${CodeReviewConfig_1.codeReviewConfig.gitlabHost}/api/v4/users/?search=${committerEmail.email}`;
    }
    static usersUsernameUrl(username) {
        return `http://${CodeReviewConfig_1.codeReviewConfig.gitlabHost}/api/v4/users/?username=${username}`;
    }
    static commentsUrl(sha) {
        return `http://${CodeReviewConfig_1.codeReviewConfig.gitlabHost}/api/v4/projects/${CodeReviewConfig_1.codeReviewConfig.projeto.projectId}/repository/commits/${sha}/comments`;
    }
    static impersonationTokenUrl(user_id) {
        return `http://${CodeReviewConfig_1.codeReviewConfig.gitlabHost}/api/v4/users/${user_id}/impersonation_tokens`;
    }
    static todosPendentesGeradosPeloUsuarioComentadorUrl() {
        return `http://${CodeReviewConfig_1.codeReviewConfig.gitlabHost}/api/v4/todos?state=pending&author_id=${CodeReviewConfig_1.codeReviewConfig.usuarioComentador.gitlab_userid}&project_id=${CodeReviewConfig_1.codeReviewConfig.projeto.projectId}`;
    }
    static todoMarkAsDoneUrl(todo) {
        return `http://${CodeReviewConfig_1.codeReviewConfig.gitlabHost}/api/v4/todos/${todo.id}/mark_as_done`;
    }
}
exports.GitLabURLs = GitLabURLs;
console.log(`
    BACKEND --> GITLAB :: GitLabURLs
    ----------------------------------------------------
    usersUrl: ${GitLabURLs.usersUrlByEmail(new Email_1.Email('meu@email.com'))}
    commentsUrl: ${GitLabURLs.commentsUrl('sha1234')}
    ----------------------------------------------------
`);
class GitLabService {
    static getBranches() {
        return rest_1.Rest.get(GitLabURLs.branchesUrl(), CodeReviewConfig_1.codeReviewConfig.tokenAdmin).then((branches) => {
            return branches.filter((branch) => CodeReviewConfig_1.codeReviewConfig.projeto.branchesIgnorados.indexOf(branch.name) === -1);
        });
    }
    static getCommits(perPage = 100) {
        return GitLabService.getBranches().then((branches) => {
            const branchNames = branches.map((gitLabBranch) => gitLabBranch.name);
            return Promise.all(branchNames.map((branch) => {
                return rest_1.Rest.get(GitLabURLs.projectsUrl(perPage, branch, CodeReviewConfig_1.codeReviewConfig.projeto.dataCortePrimeiroCommit), CodeReviewConfig_1.codeReviewConfig.tokenAdmin);
            })).then((commitsDeCadaBranch) => {
                return ArrayUtils_1.ArrayUtils.flatten(commitsDeCadaBranch);
            });
        });
    }
    static getUserByEmail(committerEmail) {
        return rest_1.Rest.get(GitLabURLs.usersUrlByEmail(committerEmail), CodeReviewConfig_1.codeReviewConfig.tokenAdmin).then((users) => {
            if (users.length === 0) {
                throw new Error(`Usuario GitLab com email <${committerEmail.email}> não encontrado!`);
            }
            if (users.length > 1) {
                throw new Error(`Encontrado MAIS DE UM (${users.length}) usuario GitLab com email <${committerEmail.email}>:\n${JSON.stringify(users)}`);
            }
            return users[0];
        });
    }
    static getUserByUsername(username) {
        return rest_1.Rest.get(GitLabURLs.usersUsernameUrl(username), CodeReviewConfig_1.codeReviewConfig.tokenAdmin).then(users => {
            return users[0];
        });
    }
    static comentar(commitSha, comentario) {
        if (this.desabilitarComentariosNoGitLab) {
            return;
        }
        return rest_1.Rest.post(GitLabURLs.commentsUrl(commitSha), CodeReviewConfig_1.codeReviewConfig.usuarioComentador.token, {
            note: GitLabService.PREFIXO_COMMITS_CODEREVIEW + comentario
        }).then(() => {
            MencoesExtractor_1.MencoesExtractor.extrairCommittersMencionadosNoTexto(comentario).then((mencionados) => {
                mencionados.map((mencionado) => GitLabService.limparTodosRelativosACodeReviewGeradosPeloUsuarioComentador(mencionado));
            });
        });
    }
    static criarImpersonationToken(user_id) {
        return rest_1.Rest.get(GitLabURLs.impersonationTokenUrl(user_id) + "?state=active", CodeReviewConfig_1.codeReviewConfig.tokenAdmin).then((tokens) => {
            const tokenJahCriadoPorNos = tokens.find(token => token.name === CodeReviewConfig_1.codeReviewConfig.mensagemTokenCriadoPorCodeReview);
            if (tokenJahCriadoPorNos) {
                return tokenJahCriadoPorNos;
            }
            else {
                // criamos um token novo
                let r = rest_1.Rest.post(GitLabURLs.impersonationTokenUrl(user_id), CodeReviewConfig_1.codeReviewConfig.tokenAdmin);
                let form = r.form();
                form.append('user_id', 'user_id');
                form.append('name', CodeReviewConfig_1.codeReviewConfig.mensagemTokenCriadoPorCodeReview);
                form.append('scopes[]', 'api');
                form.append('scopes[]', 'read_user');
                return r;
            }
        });
    }
    static getTodosCodeReviewPendentes(impersonationToken) {
        return rest_1.Rest.get(GitLabURLs.todosPendentesGeradosPeloUsuarioComentadorUrl(), impersonationToken).then((todosPendentes) => {
            return todosPendentes.filter((todo) => todo.body.startsWith(GitLabService.PREFIXO_COMMITS_CODEREVIEW));
        });
    }
    static limparTodosRelativosACodeReviewGeradosPeloUsuarioComentador({ impersonationToken: impTokenDoUserCujosTodosDevemSerApagados }) {
        return GitLabService.getTodosCodeReviewPendentes(impTokenDoUserCujosTodosDevemSerApagados).then((todosCodeReviewPendentes) => {
            return Promise.all(todosCodeReviewPendentes.map((todoCodeReviewPendente) => rest_1.Rest.post(GitLabURLs.todoMarkAsDoneUrl(todoCodeReviewPendente), impTokenDoUserCujosTodosDevemSerApagados)));
        });
    }
}
GitLabService.desabilitarComentariosNoGitLab = false;
GitLabService.PREFIXO_COMMITS_CODEREVIEW = ':loud_sound: ';
exports.GitLabService = GitLabService;
