
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
                return this.db.put(sesol2).then(_ => {
                    return new Promise(resolve => {
                        resolve(`${sesol2.type} (novo): ${sesol2.toString()}`);
                    })
                })
            }
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

}

module.exports = new Sesol2Repository();