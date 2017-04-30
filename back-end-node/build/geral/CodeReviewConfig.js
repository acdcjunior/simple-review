"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CodeReviewConfig {
}
exports.CodeReviewConfig = CodeReviewConfig;
class CodeReviewConfigCouchDB {
}
exports.CodeReviewConfigCouchDB = CodeReviewConfigCouchDB;
class CodeReviewConfigProjeto {
}
exports.CodeReviewConfigProjeto = CodeReviewConfigProjeto;
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
            gitlabHost: ${exports.codeReviewConfig.gitlabHost}
            
            usuarioComentador.token: ${exports.codeReviewConfig.usuarioComentador.token}
            tokenAdmin: ${exports.codeReviewConfig.tokenAdmin}
            
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
if (!exports.codeReviewConfig.gitlabHost || !exports.codeReviewConfig.projeto.projectId || !exports.codeReviewConfig.usuarioComentador.token || !exports.codeReviewConfig.tokenAdmin) {
    throw new Error(`Variáveis do codereview.config.js nao configuradas!`);
}
