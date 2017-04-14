'use strict';
const addCorsToCouch = require('add-cors-to-couchdb');

const couchDbConfig = require('../couchDbConfig');

console.log(
    `Attempting to configure server at http://${couchDbConfig.couchdbHost}:${couchDbConfig.couchdbPort}, with user=${couchDbConfig.couchdbUser} and password=${couchDbConfig.couchdbPassword}...`
);

addCorsToCouch(`http://${couchDbConfig.couchdbHost}:${couchDbConfig.couchdbPort}`, `${couchDbConfig.couchdbUser}:${couchDbConfig.couchdbPassword}`).then(function () {
    console.log('CORS configuration successful.');
}).catch(function (err) {
    console.log('CORS configuration error:', err);
});