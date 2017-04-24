import {GitLabConfig} from './GitLabConfig';
import { rest } from "../infra/rest";
import {GitLabUser} from "./GitLabUser";
import {GitLabCommit} from "./GitLabCommit";
import {Email} from "../geral/Email";
import {GitLabImpersonationToken} from "./GitLabImpersonationToken";

const TEXTO_TOKEN_CRIADO_POR_CODEREVIEW = "Criado via CodeReview/GitLabService.criarImpersonationToken()";

export class GitLabService {

    public static desabilitarComentariosNoGitLab = false;

    static getCommits(perPage: number = 10): Promise<GitLabCommit[]> {
        return rest("GET", GitLabConfig.projectsUrl(perPage), GitLabConfig.privateToken);
    }

    static getUserByEmail(committerEmail: Email): Promise<GitLabUser> {
        return rest("GET", GitLabConfig.usersUrlByEmail(committerEmail), GitLabConfig.privateToken).then(users => {
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
        return rest("GET", GitLabConfig.usersUsernameUrl(username), GitLabConfig.tokenReadUsers).then(users => {
            return Promise.resolve(users[0]);
        });
    }

    static comentar(commitSha: string, comentario: string): Promise<any> {
        if (this.desabilitarComentariosNoGitLab) {
            return Promise.resolve();
        }
        return rest("POST", GitLabConfig.commentsUrl(commitSha), GitLabConfig.privateToken, {
            note: comentario
        });
    }

    static criarImpersonationToken(user_id: number): Promise<GitLabImpersonationToken> {
        return rest("GET", GitLabConfig.impersonationTokenUrl(user_id) + "?state=active", GitLabConfig.tokenReadUsers).then((tokens: GitLabImpersonationToken[]) => {
            const tokenJahCriadoPorNos = tokens.find(token => token.name === TEXTO_TOKEN_CRIADO_POR_CODEREVIEW);
            if (tokenJahCriadoPorNos) {
                return Promise.resolve(tokenJahCriadoPorNos);
            } else {
                // criamos um token novo
                let r = rest("POST", GitLabConfig.impersonationTokenUrl(user_id), GitLabConfig.tokenReadUsers) as any;
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