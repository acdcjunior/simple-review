const GitLabConfig = require('./GitLabConfig');
const rest = require("../infra/rest");

class GitLab {

    getCommits() {
        return rest("GET", GitLabConfig.projectsUrl(), GitLabConfig.privateToken);
    }
    getUser(committerEmail) {
        return rest("GET", GitLabConfig.usersUrl(committerEmail), GitLabConfig.privateToken);
    }

}

module.exports = GitLab;