"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.couchDbConfig = {
    couchdbHost: process.env.COUCHDB_HOST || '192.168.1.195',
    couchdbUser: process.env.COUCHDB_USER || 'root',
    couchdbPassword: process.env.COUCHDB_PASSWORD || 'pass',
    couchdbPort: '5984',
    couchdbDatabase: 'sesol2'
};
console.log(`
    BACKEND --> COUCHDB
    ----------------------------------------------------
    couchdbHost: ${exports.couchDbConfig.couchdbHost}
    couchdbPort: ${exports.couchDbConfig.couchdbPort}
    couchdbDatabase: ${exports.couchDbConfig.couchdbDatabase}
    
    couchdbUser: ${exports.couchDbConfig.couchdbUser}
    couchdbPassword: ${exports.couchDbConfig.couchdbPassword}
    ----------------------------------------------------
`);
