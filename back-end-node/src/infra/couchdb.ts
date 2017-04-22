import * as PouchDB from 'pouchdb';
import {couchDbConfig} from './couchDbConfig';

const ajaxOpts = {
    ajax: {
        headers: {
            Authorization: 'Basic ' + Buffer.from(`${couchDbConfig.couchdbUser}:${couchDbConfig.couchdbPassword}`).toString('base64')
        },
        body: {
            name: couchDbConfig.couchdbUser,
            password: couchDbConfig.couchdbPassword
        }
    }
};

export const PouchDBService = new PouchDB(`http://${couchDbConfig.couchdbHost}:${couchDbConfig.couchdbPort}/${couchDbConfig.couchdbDatabase}`, ajaxOpts);