const Committer = require('./Committer');

const host = process.env.CODE_REVIEW_HOST || '192.168.56.1:8090';
const projectId = process.env.CODE_REVIEW_PROJECT_ID || 3;
const projectBranch = process.env.CODE_REVIEW_PROJECT_BRANCH || 'desenvolvimento';
const privateToken = process.env.CODE_REVIEW_PRIVATE_TOKEN || 'M3_6_x-z3HQEPc4Z4TYg';

class GitLabConfig {

    static projectsUrl () {
        return `http://${host}/api/v4/projects/${projectId}/repository/commits/?ref_name=${projectBranch}&per_page=100`;
    }
    static usersUrl (committerEmail) {
        const emailCorrigido = Committer.corrigirEmail(committerEmail);
        return `http://${host}/api/v4/users/?search=${emailCorrigido}`;
    }
    static commentsUrl (sha) {
        return `http://${host}/api/v4/projects/${projectId}/repository/commits/${sha}/comments`;
    }
    static get privateToken () {
        return privateToken;
    }

}

module.exports = GitLabConfig;