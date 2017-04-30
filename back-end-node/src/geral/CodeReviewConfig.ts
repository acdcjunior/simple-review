export class CodeReviewConfig {

    public readonly couchdb: CodeReviewConfigCouchDB;

    public readonly gitlabHost: string; // "git",

    public readonly usuarioComentador: CodeReviewConfigUsuarioComentador;

    public readonly tokenAdmin: string; // Token Admin tem que ter acesso [api, read_user]

    public readonly projeto: CodeReviewConfigProjeto;

    public readonly committers: CodeReviewConfigCommitter[];

    public readonly mensagemTokenCriadoPorCodeReview: string;
}


export class CodeReviewConfigCouchDB {

    public readonly user: string;
    public readonly password: string;
    public readonly host: string;
    public readonly port: number;
    public readonly database: string;

}
export class CodeReviewConfigProjeto {

    public readonly projectId: number; // 123
    public readonly dataCortePrimeiroCommit: string; // 2017-04-20T18:01:38.000-03:00
    public readonly branchesIgnorados: string[];

}
export class CodeReviewConfigUsuarioComentador {

    public readonly gitlab_userid: number; // 1
    public readonly token: string; // Token usuario comentador basta ter acesso [api]

}
export class CodeReviewConfigCommitter {

    public readonly username: string; // "alexandrevr",
    public readonly sexo: string; // "m",
    public readonly aliases: string[]; // ["alex", "alexandre"],
    public readonly quota: number; // 25

}

export const codeReviewConfig: CodeReviewConfig = require('./../../../config/codereview.config');

console.log(`
    BACKEND --> CODEREVIEW CONFIG (codereview.config.js)
    ----------------------------------------------------
    GITLAB
            gitlabHost: ${codeReviewConfig.gitlabHost}
            
            usuarioComentador.token: ${codeReviewConfig.usuarioComentador.token}
            tokenAdmin: ${codeReviewConfig.tokenAdmin}
            
            projeto.projectId: ${codeReviewConfig.projeto.projectId}
            projeto.branchesIgnorados: ${codeReviewConfig.projeto.branchesIgnorados}
    
    COUCHDB
            couchdb.host: ${codeReviewConfig.couchdb.host}
            couchdb.port: ${codeReviewConfig.couchdb.port}
            couchdb.database: ${codeReviewConfig.couchdb.database}
            couchdb.user: ${codeReviewConfig.couchdb.user}
            couchdb.password: ${codeReviewConfig.couchdb.password}
    ----------------------------------------------------
`);
if (!codeReviewConfig.gitlabHost || !codeReviewConfig.projeto.projectId || !codeReviewConfig.usuarioComentador.token || !codeReviewConfig.tokenAdmin) {
    throw new Error(`Variáveis do codereview.config.js nao configuradas!`);
}
