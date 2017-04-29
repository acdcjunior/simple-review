"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const couchdb_1 = require("../couchdb");
function criarView(nomeIndice, mapFunction) {
    const index = {
        _id: '_design/' + nomeIndice,
        views: {}
    };
    index.views[nomeIndice] = {
        map: mapFunction.toString()
    };
    return couchdb_1.PouchDBService.put(index).then(function () {
        // kick off an initial build, return immediately
        couchdb_1.PouchDBService.query(nomeIndice, { stale: 'update_after' });
        return true;
    }).catch(function (err) {
        if (err.status === 409) {
            return false;
        }
        console.log('Erro: ', err);
    }).then(function (viewFoiCriada) {
        if (viewFoiCriada) {
            console.log('\t\tCRIAR-VIEW::[' + nomeIndice + '] *** View foi criada.');
        }
        else {
            console.log('\t\tCRIAR-VIEW::[' + nomeIndice + '] *** View jah existia.');
        }
        // query the index (much faster now!)
        return couchdb_1.PouchDBService.query(nomeIndice, { include_docs: true });
    }).then(function (result) {
        console.log('\t\tCRIAR-VIEW::[' + nomeIndice + '] Resultado consulta index: ', result.rows.length);
    });
}
exports.criarView = criarView;
