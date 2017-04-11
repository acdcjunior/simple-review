'use strict';
const addCorsToCouch = require('add-cors-to-couchdb');

const couchdbHost = process.env.CODE_REVIEW_COUCHDB_HOST || '192.168.1.195';
const couchdbUser = process.env.COUCHDB_USER || 'root';
const couchdbPassword = process.env.COUCHDB_PASSWORD || 'pass';

console.log(`Attempting to configure server at http://${couchdbHost}:5984, with user=${couchdbUser} and password=${couchdbPassword}...`);

addCorsToCouch(`http://${couchdbHost}:5984`, `${couchdbUser}:${couchdbPassword}`).then(function () {
    console.log('CORS configuration successful.');
}).catch(function (err) {
    console.log('CORS configuration error:', err);
});