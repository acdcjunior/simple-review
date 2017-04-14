const GitLabConfig = require('./GitLabConfig');
const rest = require("../infra/rest");

class GitLab {

    static getCommits() {
        return rest("GET", GitLabConfig.projectsUrl(), GitLabConfig.privateToken);
    }
    static getUser(committerEmail) {
        return rest("GET", GitLabConfig.usersUrl(committerEmail), GitLabConfig.privateToken);
    }

}

module.exports = GitLab;