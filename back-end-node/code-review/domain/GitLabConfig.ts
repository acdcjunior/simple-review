import * as Committer from './Committer';

declare let process: any;

const host = process.env.GITLAB_HOST || 'git';
const projectId = process.env.GITLAB_HOST_PROJECT_ID || 3;
const projectBranch = process.env.GITLAB_HOST_PROJECT_BRANCH || 'desenvolvimento';
const privateToken = process.env.GITLAB_HOST_PRIVATE_TOKEN || 'X_zfYU5k2VwDx2KegmdQ';
const tokenReadUsers = process.env.GITLAB_HOST_PRIVATE_TOKEN_READ_USERS || 'Esj8Vxs__raBTUkX1Zns';

export class GitLabConfig {

    static projectsUrl (perPage:number = 10) {
        return `http://${host}/api/v4/projects/${projectId}/repository/commits/?ref_name=${projectBranch}&per_page=${perPage}`;
    }
    static usersUrl (committerEmail: string): string {
        const emailCorrigido = Committer.corrigirEmail(committerEmail);
        return `http://${host}/api/v4/users/?search=${emailCorrigido}`;
    }
    static usersUsernameUrl (username: string): string {
        return `http://${host}/api/v4/users/?username=${username}`;
    }
    static commentsUrl (sha: string): string {
        return `http://${host}/api/v4/projects/${projectId}/repository/commits/${sha}/comments`;
    }
    static get privateToken () {
        return privateToken;
    }
    static get tokenReadUsers () {
        return tokenReadUsers;
    }

}

console.log(`
    DADOS USADOS PARA CONEXAO DO BACKEND NODE COM GITLAB
    ----------------------------------------------------
    host: ${host}
    projectId: ${projectId}
    projectBranch: ${projectBranch}
    privateToken: ${privateToken}
    projectsUrl: ${GitLabConfig.projectsUrl()}
    usersUrl: ${GitLabConfig.usersUrl('meu@email.com')}
    commentsUrl: ${GitLabConfig.commentsUrl('sha1234')}
    ----------------------------------------------------
`);