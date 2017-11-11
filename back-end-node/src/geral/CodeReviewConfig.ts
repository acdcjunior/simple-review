export interface CodeReviewConfig {

    readonly couchdb: CodeReviewConfigCouchDB;

    readonly gitlabHost: string; // "git",
    readonly tokenAdmin: string; // Token Admin tem que ter acesso [api, read_user]

    readonly projeto: CodeReviewConfigProjeto;

    readonly botComentador: CodeReviewConfigCommitter;
    readonly committers: CodeReviewConfigCommitter[];

    readonly mensagemTokenCriadoPorCodeReview: string;

    readonly trello: CodeReviewTrello;

}

export interface CodeReviewConfigCouchDB {
    readonly user: string;
    readonly password: string;
    readonly host: string;
    readonly port: number;
    readonly database: string;
}

export interface CodeReviewConfigProjeto {
    readonly projectId: number; // 123
    readonly dataCortePrimeiroCommit: string; // 2017-04-20T18:01:38.000-03:00
    readonly branchesIgnorados: string[];
}

export interface CodeReviewConfigCommitter {
    readonly username: string; // "alexandrevr",
    readonly sexo: string; // "m",
    readonly aliases: string[]; // ["alex", "alexandre"],
    readonly quota: number; // 25
}

export interface CodeReviewTrello {
    readonly key: string;
    readonly token: string;
    readonly board_id: string;
    readonly idListEmAndamento: string;
    readonly idListEmTestes: string;
}

export const codeReviewConfig: CodeReviewConfig = require('/opt/simplereview-backend/config/codereview.config');

console.log(`
    BACKEND --> CODEREVIEW CONFIG (codereview.config.js)
    ----------------------------------------------------
    GITLAB
            gitlabHost: ${codeReviewConfig.gitlabHost}
            tokenAdmin: ${codeReviewConfig.tokenAdmin}
            
            botComentador.username: ${codeReviewConfig.botComentador.username}
            
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
if (!codeReviewConfig.gitlabHost || !codeReviewConfig.projeto.projectId || !codeReviewConfig.botComentador.username || !codeReviewConfig.tokenAdmin) {
    throw new Error(`Variáveis do codereview.config.js nao configuradas!`);
}
