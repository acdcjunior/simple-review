'use strict';
const Sesol2 = require('./Sesol2');
const Committer = require('./Committer');
const sesol2Repository = require('./Sesol2Repository');

const COMMIT_TYPE = 'commit';

class Commit extends Sesol2 {

    constructor(sha, title, message, author_email, created_at) {
        super(sha, COMMIT_TYPE, title);

        this.sha = sha;
        this.title = title;
        this.message = message;
        this.author_email = Committer.corrigirEmail(author_email);
        this.created_at = created_at;
        this.revisado = false;
        this.revisores = [];
        this.historico = [];
    }

    static findAll() {
        return sesol2Repository.findAll(COMMIT_TYPE)
    }

}

module.exports = Commit;