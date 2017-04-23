import * as addCorsToCouch from 'add-cors-to-couchdb';
import {couchDbConfig} from '../couchDbConfig';

export function corsConfig() {

    return new Promise((resolve, reject) => {
        console.log(
            `[CORS] Tentando configurar CouchDB...`
        );

        addCorsToCouch(`http://${couchDbConfig.couchdbHost}:${couchDbConfig.couchdbPort}`, `${couchDbConfig.couchdbUser}:${couchDbConfig.couchdbPassword}`).then(function () {
            console.log('[CORS] Configuracao realizada com sucesso.');
            resolve();
        }).catch(function (err) {
            console.log('[CORS] Erro ao configurar! ->', err);
            reject();
        });
    })

}