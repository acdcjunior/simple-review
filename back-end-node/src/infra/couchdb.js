const PouchDB = require('pouchdb');

// 192.168.1.195
const db = new PouchDB('http://127.0.0.1:5984/sesol2');

module.exports = db;