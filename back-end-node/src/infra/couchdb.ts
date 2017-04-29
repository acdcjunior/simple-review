import * as PouchDB from 'pouchdb';
import {codeReviewConfig} from "../geral/CodeReviewConfig";

const ajaxOpts = {
    ajax: {
        headers: {
            Authorization: 'Basic ' + Buffer.from(`${codeReviewConfig.couchdb.user}:${codeReviewConfig.couchdb.password}`).toString('base64')
        },
        body: {
            name: codeReviewConfig.couchdb.user,
            password: codeReviewConfig.couchdb.password
        }
    }
};

export const PouchDBService = new PouchDB(`http://${codeReviewConfig.couchdb.host}:${codeReviewConfig.couchdb.port}/${codeReviewConfig.couchdb.database}`, ajaxOpts);