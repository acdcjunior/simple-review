import {GitLabConfig} from '../domain/GitLabConfig';
import { rest } from "../infra/rest";
import {GitLabUser} from "./GitLabUser";
import {GitLabCommit} from "./GitLabCommit";

export class GitLabService {

    static getCommits(perPage: number = 10): Promise<GitLabCommit> {
        return rest("GET", GitLabConfig.projectsUrl(perPage), GitLabConfig.privateToken);
    }

    static getUser(committerEmail: string): Promise<GitLabUser> {
        return rest("GET", GitLabConfig.usersUrl(committerEmail), GitLabConfig.privateToken);
    }

}