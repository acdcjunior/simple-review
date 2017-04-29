"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CodeReviewConfig {
}
exports.CodeReviewConfig = CodeReviewConfig;
class CodeReviewConfigCouchDB {
}
exports.CodeReviewConfigCouchDB = CodeReviewConfigCouchDB;
class CodeReviewConfigUsuarioComentador {
}
exports.CodeReviewConfigUsuarioComentador = CodeReviewConfigUsuarioComentador;
class CodeReviewConfigCommitter {
}
exports.CodeReviewConfigCommitter = CodeReviewConfigCommitter;
exports.codeReviewConfig = require('./../../../config/codereview.config');
console.log(`
    BACKEND --> CODEREVIEW CONFIG (codereview.config.js)
    ----------------------------------------------------
    GITLAB
            host: ${exports.codeReviewConfig.host}
            projectId: ${exports.codeReviewConfig.projectId}
            usuarioComentador.token: ${exports.codeReviewConfig.usuarioComentador.token}
            tokenAdmin: ${exports.codeReviewConfig.tokenAdmin}
    
    COUCHDB
            couchdb.host: ${exports.codeReviewConfig.couchdb.host}
            couchdb.port: ${exports.codeReviewConfig.couchdb.port}
            couchdb.database: ${exports.codeReviewConfig.couchdb.database}
            couchdb.user: ${exports.codeReviewConfig.couchdb.user}
            couchdb.password: ${exports.codeReviewConfig.couchdb.password}
    ----------------------------------------------------
`);
if (!exports.codeReviewConfig.host || !exports.codeReviewConfig.projectId || !exports.codeReviewConfig.usuarioComentador.token || !exports.codeReviewConfig.tokenAdmin) {
    throw new Error(`Variáveis do codereview.config.js nao configuradas!`);
}
