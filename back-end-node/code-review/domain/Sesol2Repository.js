
class Sesol2Repository {

    constructor() {
        this.db = require('../infra/couchdb');
    }

    /**
     * Retorna uma promise!
     */
    insertIfNotExists (sesol2) {
        return this.exists(sesol2).then(exists => {
            if (exists) {
                return Promise.resolve(false);
            } else {
                return this.insert(sesol2);
            }
        });
    }

    insert(sesol2) {
        return this.db.put(sesol2).then(ignored => {
            return Promise.resolve(`${sesol2.type} (inserido): ${sesol2.toString()}`);
        });
    }

    exists (sesol2) {
        return this.db.get(sesol2._id).then((doc) => {
            return new Promise((resolve) => {
                resolve(true, doc);
            });
        }).catch((error) => {
            return new Promise((resolve) => {
                resolve(false, error);
            });
        });
    }

    findAll(type) {
        return this.db.query('type_index', {key: type, include_docs: true}).then(result => {
            return new Promise(resolve => {
                resolve(result.rows.map(row => row.doc));
            })
        });
    }

}

module.exports = new Sesol2Repository();