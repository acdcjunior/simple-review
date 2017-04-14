'use strict';
const addCorsToCouch = require('add-cors-to-couchdb');

const couchDbConfig = require('../couchDbConfig');

console.log(
    `[CORS] Attempting to configure server at http://${couchDbConfig.couchdbHost}:${couchDbConfig.couchdbPort}, with user=${couchDbConfig.couchdbUser} and password=${couchDbConfig.couchdbPassword}...`
);

addCorsToCouch(`http://${couchDbConfig.couchdbHost}:${couchDbConfig.couchdbPort}`, `${couchDbConfig.couchdbUser}:${couchDbConfig.couchdbPassword}`).then(function () {
    console.log('[CORS] Configuration successful.');
}).catch(function (err) {
    console.log('[CORS] Configuration error:', err);
});