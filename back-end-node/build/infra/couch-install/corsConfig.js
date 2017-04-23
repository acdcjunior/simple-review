"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const addCorsToCouch = require("add-cors-to-couchdb");
const couchDbConfig_1 = require("../couchDbConfig");
function corsConfig() {
    return new Promise((resolve, reject) => {
        console.log(`[CORS] Tentando configurar CouchDB...`);
        addCorsToCouch(`http://${couchDbConfig_1.couchDbConfig.couchdbHost}:${couchDbConfig_1.couchDbConfig.couchdbPort}`, `${couchDbConfig_1.couchDbConfig.couchdbUser}:${couchDbConfig_1.couchDbConfig.couchdbPassword}`).then(function () {
            console.log('[CORS] Configuracao realizada com sucesso.');
            resolve();
        }).catch(function (err) {
            console.log('[CORS] Erro ao configurar! ->', err);
            reject();
        });
    });
}
exports.corsConfig = corsConfig;
