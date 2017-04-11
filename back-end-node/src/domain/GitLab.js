const rest = require("../infra/rest");
const Committer = require('./Committer');

const defaultHost = '192.168.56.1:8090';
const defaultProjectId = 3;
const defaultPrivateToken = 'M3_6_x-z3HQEPc4Z4TYg';

// "https://gitlab.com/api/v4/projects/2982376/repository/commits/?since=2017-03-26T22:14:54.000-03:00", "zZKohysiaQwizBySUF2N");

class GitLab {

    constructor() {
        this.host = process.env.CODE_REVIEW_HOST || defaultHost;
        this.projectId = process.env.CODE_REVIEW_PROJECT_ID || defaultProjectId;
        this.privateToken = process.env.CODE_REVIEW_PRIVATE_TOKEN || defaultPrivateToken;
    }

    get projectsUrl () {
        return `http://${this.host}/api/v4/projects/${this.projectId}/repository/commits/?ref_name=desenvolvimento&per_page=100`;
    }
    usersUrl (search) {
        return `http://${this.host}/api/v4/users/?search=${search}`;
    }
    getCommits() {
        return rest("GET", this.projectsUrl, this.privateToken);
    }
    getUser(committerEmail) {
        return rest("GET", this.usersUrl(Committer.corrigirEmail(committerEmail)), this.privateToken);
    }

}

module.exports = GitLab;