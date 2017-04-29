"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const addCorsToCouch = require("add-cors-to-couchdb");
const CodeReviewConfig_1 = require("../../geral/CodeReviewConfig");
function corsConfig() {
    return new Promise((resolve, reject) => {
        console.log(`[CORS] Tentando configurar CouchDB...`);
        addCorsToCouch(`http://${CodeReviewConfig_1.codeReviewConfig.couchdb.host}:${CodeReviewConfig_1.codeReviewConfig.couchdb.port}`, `${CodeReviewConfig_1.codeReviewConfig.couchdb.user}:${CodeReviewConfig_1.codeReviewConfig.couchdb.password}`).then(function () {
            console.log('[CORS] Configuracao realizada com sucesso.');
            resolve();
        }).catch(function (err) {
            console.log('[CORS] Erro ao configurar! ->', err);
            reject();
        });
    });
}
exports.corsConfig = corsConfig;
