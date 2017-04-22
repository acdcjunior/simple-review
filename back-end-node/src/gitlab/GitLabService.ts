import {GitLabConfig} from '../domain/GitLabConfig';
import { rest } from "../infra/rest";
import {GitLabUser} from "./GitLabUser";
import {GitLabCommit} from "./GitLabCommit";
import {Email} from "../geral/Email";

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

}