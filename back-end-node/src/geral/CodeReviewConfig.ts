export class CodeReviewConfig {

    public readonly couchdb: CodeReviewConfigCouchDB;

    public readonly host: string; // "git",
    public readonly projectId: number; // 123,

    public readonly usuarioComentador: CodeReviewConfigUsuarioComentador;

    public readonly tokenAdmin: string; // "yj2--5cKKC4qaDRoND7N", // Token Admin tem que ter acesso [api, read_user]

    public readonly dataCortePrimeiroCommit: string; // 2017-04-20T18:01:38.000-03:00
    public readonly branchesIgnorados: string[];

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
export class CodeReviewConfigUsuarioComentador {

    public readonly gitlab_userid: number; // 1
    public readonly token: string; // "X_zfYU5k3VwDx2KegmdQ", // Token usuario comentador basta ter acesso [api]

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
            host: ${codeReviewConfig.host}
            projectId: ${codeReviewConfig.projectId}
            usuarioComentador.token: ${codeReviewConfig.usuarioComentador.token}
            tokenAdmin: ${codeReviewConfig.tokenAdmin}
    
    COUCHDB
            couchdb.host: ${codeReviewConfig.couchdb.host}
            couchdb.port: ${codeReviewConfig.couchdb.port}
            couchdb.database: ${codeReviewConfig.couchdb.database}
            couchdb.user: ${codeReviewConfig.couchdb.user}
            couchdb.password: ${codeReviewConfig.couchdb.password}
    ----------------------------------------------------
`);
if (!codeReviewConfig.host || !codeReviewConfig.projectId || !codeReviewConfig.usuarioComentador.token || !codeReviewConfig.tokenAdmin) {
    throw new Error(`Variáveis do codereview.config.js nao configuradas!`);
}
