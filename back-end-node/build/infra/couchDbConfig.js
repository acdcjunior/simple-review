"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.couchDbConfig = {
    couchdbHost: process.env.COUCHDB_HOST || '192.168.1.195',
    couchdbUser: process.env.COUCHDB_USER || 'root',
    couchdbPassword: process.env.COUCHDB_PASSWORD || 'pass',
    couchdbPort: '5984',
    couchdbDatabase: 'sesol2'
};
