"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Sesol2Repository {
    constructor() {
        this.db = require('../infra/couchdb');
    }
    insertIfNotExists(sesol2) {
        return this.exists(sesol2).then(exists => {
            if (exists) {
                return Promise.resolve(undefined);
            }
            else {
                return this.insert(sesol2);
            }
        });
    }
    insert(sesol2) {
        return this.db.put(sesol2).then(ignored => {
            return Promise.resolve(`${sesol2.type} (inserido): ${sesol2.toString()}`);
        });
    }
    exists(sesol2) {
        return this.db.get(sesol2._id).then(() => {
            return Promise.resolve(true);
        }).catch(() => {
            return Promise.resolve(false);
        });
    }
    findAll(type) {
        return this.queryView('type_index', type);
    }
    queryView(viewName, viewKey) {
        return this.db.query(viewName, { key: viewKey, include_docs: true }).then(result => {
            return Promise.resolve(result.rows.map(row => row.doc));
        });
    }
}
exports.sesol2Repository = new Sesol2Repository();
