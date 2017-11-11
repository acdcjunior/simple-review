"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.codeReviewConfig = require('/opt/simplereview-backend/config/codereview.config');
console.log(`
    BACKEND --> CODEREVIEW CONFIG (codereview.config.js)
    ----------------------------------------------------
    GITLAB
            gitlabHost: ${exports.codeReviewConfig.gitlabHost}
            tokenAdmin: ${exports.codeReviewConfig.tokenAdmin}
            
            botComentador.username: ${exports.codeReviewConfig.botComentador.username}
            
            projeto.projectId: ${exports.codeReviewConfig.projeto.projectId}
            projeto.branchesIgnorados: ${exports.codeReviewConfig.projeto.branchesIgnorados}
    
    COUCHDB
            couchdb.host: ${exports.codeReviewConfig.couchdb.host}
            couchdb.port: ${exports.codeReviewConfig.couchdb.port}
            couchdb.database: ${exports.codeReviewConfig.couchdb.database}
            couchdb.user: ${exports.codeReviewConfig.couchdb.user}
            couchdb.password: ${exports.codeReviewConfig.couchdb.password}
    ----------------------------------------------------
`);
if (!exports.codeReviewConfig.gitlabHost || !exports.codeReviewConfig.projeto.projectId || !exports.codeReviewConfig.botComentador.username || !exports.codeReviewConfig.tokenAdmin) {
    throw new Error(`Variáveis do codereview.config.js nao configuradas!`);
}
