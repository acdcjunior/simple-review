export const couchDbConfig = {
    couchdbHost: process.env.COUCHDB_HOST || '192.168.1.195',
    couchdbUser: process.env.COUCHDB_USER || 'root',
    couchdbPassword: process.env.COUCHDB_PASSWORD || 'pass',
    couchdbPort: '5984',
    couchdbDatabase: 'sesol2'
};

console.log(`
    BACKEND --> COUCHDB
    ----------------------------------------------------
    couchdbHost: ${couchDbConfig.couchdbHost}
    couchdbPort: ${couchDbConfig.couchdbPort}
    couchdbDatabase: ${couchDbConfig.couchdbDatabase}
    
    couchdbUser: ${couchDbConfig.couchdbUser}
    couchdbPassword: ${couchDbConfig.couchdbPassword}
    ----------------------------------------------------
`);