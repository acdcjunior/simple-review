import {GitLabConfig} from './GitLabConfig';
import { rest } from "../infra/rest";
import {GitLabUser} from "./GitLabUser";
import {GitLabCommit} from "./GitLabCommit";
import {Email} from "../geral/Email";
import {GitLabImpersonationToken} from "./GitLabImpersonationToken";
import {arquivoProjeto} from "../geral/arquivoProjeto";

const TEXTO_TOKEN_CRIADO_POR_CODEREVIEW = "Criado via CodeReview/GitLabService.criarImpersonationToken()";


export class GitLabService {

    public static desabilitarComentariosNoGitLab = false;

    static getCommits(perPage: number = 100): Promise<GitLabCommit[]> {
        // TODO permitir mais de dois branches
        return rest("GET", GitLabConfig.projectsUrl(perPage, arquivoProjeto.branches[0], arquivoProjeto.dataCortePrimeiroCommit), GitLabConfig.tokenAdmin).then((commitsZero: GitLabCommit[]) => {
            return rest("GET", GitLabConfig.projectsUrl(perPage, arquivoProjeto.branches[1], arquivoProjeto.dataCortePrimeiroCommit), GitLabConfig.tokenAdmin).then((commitsUm: GitLabCommit[]) => {
                return Promise.resolve(commitsZero.concat(commitsUm))
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
        return rest("POST", GitLabConfig.commentsUrl(commitSha), GitLabConfig.tokenUsuarioComentador, {
            note: comentario
        }).then(naoSeiQualOTipo => {
            console.log(`
            
            Resuldado da promise COMENTAR:
            ${naoSeiQualOTipo}
            
            `);
            return Promise.resolve();
        });
    }

    static criarImpersonationToken(user_id: number): Promise<GitLabImpersonationToken> {
        return rest("GET", GitLabConfig.impersonationTokenUrl(user_id) + "?state=active", GitLabConfig.tokenAdmin).then((tokens: GitLabImpersonationToken[]) => {
            const tokenJahCriadoPorNos = tokens.find(token => token.name === TEXTO_TOKEN_CRIADO_POR_CODEREVIEW);
            if (tokenJahCriadoPorNos) {
                return Promise.resolve(tokenJahCriadoPorNos);
            } else {
                // criamos um token novo
                let r = rest("POST", GitLabConfig.impersonationTokenUrl(user_id), GitLabConfig.tokenAdmin) as any;
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