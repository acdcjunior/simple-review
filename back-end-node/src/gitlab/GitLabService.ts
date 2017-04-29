import {rest, Rest} from "../infra/rest";
import {GitLabUser} from "./GitLabUser";
import {GitLabCommit} from "./GitLabCommit";
import {Email} from "../geral/Email";
import {GitLabImpersonationToken} from "./GitLabImpersonationToken";
import {ArrayUtils} from "../geral/ArrayUtils";
import {GitLabBranch} from "./GitLabBranch";
import {codeReviewConfig} from "../geral/CodeReviewConfig";

export class GitLabConfig {

    static branchesUrl(): string {
        return `http://${codeReviewConfig.host}/api/v4/projects/${codeReviewConfig.projectId}/repository/branches`;
    }
    static projectsUrl(perPage:number = 10, projectBranch: string, since: string): string {
        return `http://${codeReviewConfig.host}/api/v4/projects/${codeReviewConfig.projectId}/repository/commits/?ref_name=${projectBranch}&per_page=${perPage}&since=${since}`;
    }
    static usersUrlByEmail(committerEmail: Email): string {
        return `http://${codeReviewConfig.host}/api/v4/users/?search=${committerEmail.email}`;
    }
    static usersUsernameUrl (username: string): string {
        return `http://${codeReviewConfig.host}/api/v4/users/?username=${username}`;
    }
    static commentsUrl (sha: string): string {
        return `http://${codeReviewConfig.host}/api/v4/projects/${codeReviewConfig.projectId}/repository/commits/${sha}/comments`;
    }
    static impersonationTokenUrl(user_id: number): string {
        return `http://${codeReviewConfig.host}/api/v4/users/${user_id}/impersonation_tokens`;
    }
    public static readonly tokenUsuarioComentador = codeReviewConfig.tokenUsuarioComentador;
    public static readonly tokenAdmin = codeReviewConfig.tokenAdmin;

}
console.log(`
    BACKEND --> GITLAB urls exemplo
    ----------------------------------------------------
    usersUrl: ${GitLabConfig.usersUrlByEmail(new Email('meu@email.com'))}
    commentsUrl: ${GitLabConfig.commentsUrl('sha1234')}
    ----------------------------------------------------
`);


export class GitLabService {

    public static desabilitarComentariosNoGitLab = false;

    static getBranches(): Promise<GitLabBranch[]> {
        return Rest.get(GitLabConfig.branchesUrl(), GitLabConfig.tokenAdmin).then((branches: GitLabBranch[]) => {
            return Promise.resolve(branches.filter((branch: GitLabBranch) => codeReviewConfig.branchesIgnorados.indexOf(branch.name) === -1));
        });
    }

    static getCommits(perPage: number = 100): Promise<GitLabCommit[]> {
        return GitLabService.getBranches().then((branches: GitLabBranch[]) => {
            const branchNames: string[] = branches.map((gitLabBranch: GitLabBranch) => gitLabBranch.name);

            return Promise.all(branchNames.map((branch: string) => {
                return Rest.get<GitLabCommit[]>(GitLabConfig.projectsUrl(perPage, branch, codeReviewConfig.dataCortePrimeiroCommit), GitLabConfig.tokenAdmin);
            })).then((commitsDeCadaBranch: GitLabCommit[][]) => {
                return Promise.resolve(ArrayUtils.flatten(commitsDeCadaBranch));
            });
        });
    }

    static getUserByEmail(committerEmail: Email): Promise<GitLabUser> {
        return rest("GET", GitLabConfig.usersUrlByEmail(committerEmail), GitLabConfig.tokenAdmin).then(users => {
            if (users.length === 0) {
                throw new Error(`Usuario GitLab com email <${committerEmail.email}> não encontrado!`);
            }
            if (users.length > 1) {
                throw new Error(`Encontrado MAIS DE UM (${users.length}) usuario GitLab com email <${committerEmail.email}>:\n${JSON.stringify(users)}`);
            }
            return Promise.resolve(users[0]);
        });
    }

    static getUserByUsername(username: string): Promise<GitLabUser> {
        return rest("GET", GitLabConfig.usersUsernameUrl(username), GitLabConfig.tokenAdmin).then(users => {
            return Promise.resolve(users[0]);
        });
    }

    static comentar(commitSha: string, comentario: string): Promise<any> {
        if (this.desabilitarComentariosNoGitLab) {
            return Promise.resolve();
        }
        return Rest.post(GitLabConfig.commentsUrl(commitSha), GitLabConfig.tokenUsuarioComentador, {
            note: comentario
        }).then(naoSeiQualOTipo => {
            console.log(`
            
            Resuldado da promise COMENTAR:
            ${JSON.stringify(naoSeiQualOTipo, null, '\t')}
            
            `);
            return Promise.resolve();
        });
    }

    static criarImpersonationToken(user_id: number): Promise<GitLabImpersonationToken> {
        return rest("GET", GitLabConfig.impersonationTokenUrl(user_id) + "?state=active", GitLabConfig.tokenAdmin).then((tokens: GitLabImpersonationToken[]) => {
            const tokenJahCriadoPorNos = tokens.find(token => token.name === codeReviewConfig.mensagemTokenCriadoPorCodeReview);
            if (tokenJahCriadoPorNos) {
                return Promise.resolve(tokenJahCriadoPorNos);
            } else {
                // criamos um token novo
                let r = Rest.post(GitLabConfig.impersonationTokenUrl(user_id), GitLabConfig.tokenAdmin);
                let form = (r as any).form();
                form.append('user_id', 'user_id');
                form.append('name', codeReviewConfig.mensagemTokenCriadoPorCodeReview);
                form.append('scopes[]', 'api');
                form.append('scopes[]', 'read_user');
                return r;
            }
        });
    }

}