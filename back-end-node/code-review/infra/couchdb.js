const PouchDB = require('pouchdb');

const couchdbHost = process.env.CODE_REVIEW_COUCHDB_HOST || '192.168.1.195';
const couchdbUser = process.env.COUCHDB_USER || 'root';
const couchdbPassword = process.env.COUCHDB_PASSWORD || 'pass';

const ajaxOpts = {
    ajax: {
        headers: {
            Authorization: 'Basic ' + Buffer.from(`${couchdbUser}:${couchdbPassword}`).toString('base64')
        },
        body: {
            name: couchdbUser,
            password: couchdbPassword
        }
    }
};

const db = new PouchDB(`http://${couchdbHost}:5984/sesol2`, ajaxOpts);

module.exports = db;