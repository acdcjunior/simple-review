const PouchDB = require('pouchdb');

const couchDbConfig = require('./couchDbConfig');

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

const db = new PouchDB(`http://${couchDbConfig.couchdbHost}:${couchDbConfig.couchdbPort}/${couchDbConfig.couchdbDatabase}`, ajaxOpts);

module.exports = db;