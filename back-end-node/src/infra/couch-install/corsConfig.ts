import * as addCorsToCouch from 'add-cors-to-couchdb';
import {codeReviewConfig} from "../../geral/CodeReviewConfig";

export function corsConfig() {

    return new Promise((resolve, reject) => {
        console.log(
            `[CORS] Tentando configurar CouchDB...`
        );

        addCorsToCouch(`http://${codeReviewConfig.couchdb.host}:${codeReviewConfig.couchdb.port}`, `${codeReviewConfig.couchdb.user}:${codeReviewConfig.couchdb.password}`).then(function () {
            console.log('[CORS] Configuracao realizada com sucesso.');
            resolve();
        }).catch(function (err) {
            console.log('[CORS] Erro ao configurar! ->', err);
            reject();
        });
    })

}