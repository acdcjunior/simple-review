const PouchDB = require('pouchdb');

const couchdbHost = process.env.CODE_REVIEW_COUCHDB_HOST || '192.168.1.195';
const db = new PouchDB(`http://${couchdbHost}:5984/sesol2`);

module.exports = db;