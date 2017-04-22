"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const PouchDB = require("pouchdb");
const couchDbConfig_1 = require("./couchDbConfig");
const ajaxOpts = {
    ajax: {
        headers: {
            Authorization: 'Basic ' + Buffer.from(`${couchDbConfig_1.couchDbConfig.couchdbUser}:${couchDbConfig_1.couchDbConfig.couchdbPassword}`).toString('base64')
        },
        body: {
            name: couchDbConfig_1.couchDbConfig.couchdbUser,
            password: couchDbConfig_1.couchDbConfig.couchdbPassword
        }
    }
};
exports.PouchDBService = new PouchDB(`http://${couchDbConfig_1.couchDbConfig.couchdbHost}:${couchDbConfig_1.couchDbConfig.couchdbPort}/${couchDbConfig_1.couchDbConfig.couchdbDatabase}`, ajaxOpts);
