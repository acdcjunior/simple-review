import {GitLabConfig} from '../domain/GitLabConfig';
import { rest } from "../infra/rest";
import {GitLabUser} from "./GitLabUser";
import {GitLabCommit} from "./GitLabCommit";
import * as ts from "typescript/lib/tsserverlibrary";
import Err = ts.server.Msg.Err;

export class GitLabService {

    static getCommits(perPage: number = 10): Promise<GitLabCommit[]> {
        return rest("GET", GitLabConfig.projectsUrl(perPage), GitLabConfig.privateToken);
    }

    static getUser(committerEmail: string): Promise<GitLabUser> {
        return rest("GET", GitLabConfig.usersUrl(committerEmail), GitLabConfig.privateToken).then(users => {
            if (users.length === 0) {
                throw new Error(`Usuario GitLab com email <${committerEmail}> não encontrado!`);
            }
            if (users.length > 1) {
                throw new Error(`Encontrado MAIS DE UM (${users.length}) usuario GitLab com email <${committerEmail}>:\n${JSON.stringify(users)}`);
            }
            return Promise.resolve(users[0]);
        });
    }

    static getUserByUsername(username: string): Promise<GitLabUser> {
        return rest("GET", GitLabConfig.usersUsernameUrl(username), GitLabConfig.tokenReadUsers).then(users => {
            return Promise.resolve(users[0]);
        });
    }

}