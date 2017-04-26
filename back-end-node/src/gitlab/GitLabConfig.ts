import {Email} from "../geral/Email";
import {arquivoProjeto} from "../geral/arquivoProjeto";

declare let process: any;

let host = process.env.GITLAB_HOST;
let projectId = process.env.GITLAB_HOST_PROJECT_ID;
let projectBranch = process.env.GITLAB_HOST_PROJECT_BRANCH;
let tokenUsuarioComentador = process.env.GITLAB_HOST_PRIVATE_TOKEN_USUARIO_COMENTADOR;
let tokenAdmin = process.env.GITLAB_HOST_PRIVATE_TOKEN_ADMIN;

if (require("os").hostname() === "delljr") {
    host = '127.0.0.1:8090';
    projectId = 3;
    projectBranch = 'desenvolvimento';
    tokenUsuarioComentador = 'iU_63HEeqBJG6gQXuQha';
    tokenAdmin = 'iU_63HEeqBJG6gQXuQha';
}

export class GitLabConfig {

    static projectsUrl (perPage:number = 10, projectBranch: string, since: string) {
        return `http://${host}/api/v4/projects/${projectId}/repository/commits/?ref_name=${projectBranch}&per_page=${perPage}&since=${since}`;
    }
    static usersUrlByEmail(committerEmail: Email): string {
        return `http://${host}/api/v4/users/?search=${committerEmail.email}`;
    }
    static usersUsernameUrl (username: string): string {
        return `http://${host}/api/v4/users/?username=${username}`;
    }
    static commentsUrl (sha: string): string {
        return `http://${host}/api/v4/projects/${projectId}/repository/commits/${sha}/comments`;
    }
    static impersonationTokenUrl(user_id: number): string {
        return `http://${host}/api/v4/users/${user_id}/impersonation_tokens`;
    }
    static get tokenUsuarioComentador () {
        return tokenUsuarioComentador;
    }
    static get tokenAdmin () {
        return tokenAdmin;
    }

}

console.log(`
    BACKEND --> GITLAB
    ----------------------------------------------------
    host: ${host}
    projectId: ${projectId}
    projectBranch: ${projectBranch}
    
    privateToken: ${tokenUsuarioComentador}
    tokenAdmin: ${tokenAdmin}
    
    projectsUrl: ${GitLabConfig.projectsUrl(100, arquivoProjeto.branches[0], arquivoProjeto.dataCortePrimeiroCommit)}
    usersUrl: ${GitLabConfig.usersUrlByEmail(new Email('meu@email.com'))}
    commentsUrl: ${GitLabConfig.commentsUrl('sha1234')}
    ----------------------------------------------------
`);
if (!host || !projectId || !projectBranch || !tokenUsuarioComentador || !tokenAdmin) {
    throw new Error(`Variáveis de ambiente do GitLabConfig nao configuradas!`);
}
