import {Rest} from "../infra/rest";
import {GitLabUser} from "./GitLabUser";
import {GitLabCommit} from "./GitLabCommit";
import {Email} from "../geral/Email";
import {GitLabImpersonationToken} from "./GitLabImpersonationToken";
import {ArrayUtils} from "../geral/ArrayUtils";
import {GitLabBranch} from "./GitLabBranch";
import {codeReviewConfig} from "../geral/CodeReviewConfig";
import {GitLabTodo} from "./GitLabTodo";
import {MencoesExtractor} from "../geral/MencoesExtractor";
import {Committer} from "../committers/Committer";

export class GitLabURLs {

    static branchesUrl(): string {
        return `http://${codeReviewConfig.gitlabHost}/api/v4/projects/${codeReviewConfig.projeto.projectId}/repository/branches`;
    }
    static projectsUrl(perPage:number = 10, projectBranch: string, since: string): string {
        return `http://${codeReviewConfig.gitlabHost}/api/v4/projects/${codeReviewConfig.projeto.projectId}/repository/commits/?ref_name=${projectBranch}&per_page=${perPage}&since=${since}`;
    }
    static usersUrlByEmail(committerEmail: Email): string {
        return `http://${codeReviewConfig.gitlabHost}/api/v4/users/?search=${committerEmail.email}`;
    }
    static usersUsernameUrl (username: string): string {
        return `http://${codeReviewConfig.gitlabHost}/api/v4/users/?username=${username}`;
    }
    static commentsUrl (sha: string): string {
        return `http://${codeReviewConfig.gitlabHost}/api/v4/projects/${codeReviewConfig.projeto.projectId}/repository/commits/${sha}/comments`;
    }
    static impersonationTokenUrl(user_id: number): string {
        return `http://${codeReviewConfig.gitlabHost}/api/v4/users/${user_id}/impersonation_tokens`;
    }
    static todosPendentesGeradosPeloUsuarioComentadorUrl(): string {
        return `http://${codeReviewConfig.gitlabHost}/api/v4/todos?state=pending&author_id=${codeReviewConfig.usuarioComentador.gitlab_userid}&project_id=${codeReviewConfig.projeto.projectId}`;
    }
    static todoMarkAsDoneUrl(todo: GitLabTodo): string {
        return `http://${codeReviewConfig.gitlabHost}/api/v4/todos/${todo.id}/mark_as_done`;
    }

}
console.log(`
    BACKEND --> GITLAB :: GitLabURLs
    ----------------------------------------------------
    usersUrl: ${GitLabURLs.usersUrlByEmail(new Email('meu@email.com'))}
    commentsUrl: ${GitLabURLs.commentsUrl('sha1234')}
    ----------------------------------------------------
`);


export class GitLabService {

    public static desabilitarComentariosNoGitLab = false;

    static getBranches(): Promise<GitLabBranch[]> {
        return Rest.get(GitLabURLs.branchesUrl(), codeReviewConfig.tokenAdmin).then((branches: GitLabBranch[]) => {
            return branches.filter((branch: GitLabBranch) => codeReviewConfig.projeto.branchesIgnorados.indexOf(branch.name) === -1);
        });
    }

    static getCommits(perPage: number = 100): Promise<GitLabCommit[]> {
        return GitLabService.getBranches().then((branches: GitLabBranch[]) => {
            const branchNames: string[] = branches.map((gitLabBranch: GitLabBranch) => gitLabBranch.name);

            return Promise.all(branchNames.map((branch: string) => {
                return Rest.get<GitLabCommit[]>(GitLabURLs.projectsUrl(perPage, branch, codeReviewConfig.projeto.dataCortePrimeiroCommit), codeReviewConfig.tokenAdmin);
            })).then((commitsDeCadaBranch: GitLabCommit[][]) => {
                return ArrayUtils.flatten(commitsDeCadaBranch);
            });
        });
    }

    static getUserByEmail(committerEmail: Email): Promise<GitLabUser> {
        return Rest.get<GitLabUser[]>(GitLabURLs.usersUrlByEmail(committerEmail), codeReviewConfig.tokenAdmin).then((users: GitLabUser[]) => {
            if (users.length === 0) {
                throw new Error(`Usuario GitLab com email <${committerEmail.email}> não encontrado!`);
            }
            if (users.length > 1) {
                throw new Error(`Encontrado MAIS DE UM (${users.length}) usuario GitLab com email <${committerEmail.email}>:\n${JSON.stringify(users)}`);
            }
            return users[0];
        });
    }

    static getUserByUsername(username: string): Promise<GitLabUser> {
        return Rest.get(GitLabURLs.usersUsernameUrl(username), codeReviewConfig.tokenAdmin).then(users => {
            return users[0];
        });
    }

    private static readonly PREFIXO_COMMITS_CODEREVIEW = ':loud_sound: ';
    static comentar(commitSha: string, comentario: string): Promise<void> {
        if (this.desabilitarComentariosNoGitLab) {
            return;
        }
        return Rest.post(GitLabURLs.commentsUrl(commitSha), codeReviewConfig.usuarioComentador.token, {
            note: GitLabService.PREFIXO_COMMITS_CODEREVIEW + comentario
        }).then(() => {
            MencoesExtractor.extrairCommittersMencionadosNoTexto(comentario).then((mencionados: Committer[]) => {
                mencionados.map((mencionado: Committer) => GitLabService.limparTodosRelativosACodeReviewGeradosPeloUsuarioComentador(mencionado));
            });
        });
    }

    static criarImpersonationToken(user_id: number): Promise<GitLabImpersonationToken> {
        return Rest.get(GitLabURLs.impersonationTokenUrl(user_id) + "?state=active", codeReviewConfig.tokenAdmin).then((tokens: GitLabImpersonationToken[]) => {
            const tokenJahCriadoPorNos = tokens.find(token => token.name === codeReviewConfig.mensagemTokenCriadoPorCodeReview);
            if (tokenJahCriadoPorNos) {
                return tokenJahCriadoPorNos;
            } else {
                // criamos um token novo
                let r = Rest.post(GitLabURLs.impersonationTokenUrl(user_id), codeReviewConfig.tokenAdmin);
                let form = (r as any).form();
                form.append('user_id', 'user_id');
                form.append('name', codeReviewConfig.mensagemTokenCriadoPorCodeReview);
                form.append('scopes[]', 'api');
                form.append('scopes[]', 'read_user');
                return r;
            }
        });
    }

    static getTodosCodeReviewPendentes(impersonationToken: string): Promise<GitLabTodo[]> {
        return Rest.get(GitLabURLs.todosPendentesGeradosPeloUsuarioComentadorUrl(), impersonationToken).then((todosPendentes: GitLabTodo[]) => {
            return todosPendentes.filter((todo: GitLabTodo) => todo.body.startsWith(GitLabService.PREFIXO_COMMITS_CODEREVIEW));
        });
    }

    static limparTodosRelativosACodeReviewGeradosPeloUsuarioComentador({impersonationToken: impTokenDoUserCujosTodosDevemSerApagados}): Promise<any> {
        return GitLabService.getTodosCodeReviewPendentes(impTokenDoUserCujosTodosDevemSerApagados).then((todosCodeReviewPendentes: GitLabTodo[]) => {
            return Promise.all(todosCodeReviewPendentes.map(
                (todoCodeReviewPendente: GitLabTodo) => Rest.post(GitLabURLs.todoMarkAsDoneUrl(todoCodeReviewPendente), impTokenDoUserCujosTodosDevemSerApagados)
            ));
        });
    }

}