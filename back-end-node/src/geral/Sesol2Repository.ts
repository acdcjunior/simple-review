import {Sesol2} from "./Sesol2";

class Sesol2Repository {

    private db: any;

    constructor() {
        this.db = require('../infra/couchdb').PouchDBService;
    }

    insertIfNotExists(sesol2: Sesol2): Promise<string> {
        return this.exists(sesol2).then(exists => {
            if (exists) {
                return Promise.resolve(undefined as string);
            } else {
                return this.insert(sesol2);
            }
        });
    }

    insert(sesol2: Sesol2): Promise<string> {
        return this.db.put(sesol2).then(ignored => {
            return Promise.resolve(`${sesol2.type} (inserido): ${sesol2.toString()}`);
        });
    }

    exists(sesol2: Sesol2): Promise<boolean> {
        return this.db.get(sesol2._id).then(() => {
            return Promise.resolve(true);
        }).catch(() => {
            return Promise.resolve(false);
        });
    }

    findAll<T>(type: string, prototype: object): Promise<T[]> {
        return this.queryView('type_index', prototype, type);
    }

    queryView<T>(viewName: string, prototype: object, viewKey?: string): Promise<T[]> {
        return this.db.query(viewName, {key: viewKey, include_docs: true}).then(result => {
            return Promise.resolve(result.rows.map(row => Object.assign(Object.create(prototype), row.doc)));
        });
    }

}

export let sesol2Repository = new Sesol2Repository();