import * as GitLabConfig from './GitLabConfig';
import { rest } from "../infra/rest";

export class GitLab {

    static getCommits(): Promise<any> {
        return rest("GET", GitLabConfig.projectsUrl(), GitLabConfig.privateToken);
    }

    static getUser(committerEmail): Promise<any> {
        return rest("GET", GitLabConfig.usersUrl(committerEmail), GitLabConfig.privateToken);
    }

}