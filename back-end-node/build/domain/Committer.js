"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Sesol2_1 = require("./Sesol2");
const Sesol2Repository_1 = require("./Sesol2Repository");
const COMMITTER_TYPE = 'committer';
class Committer extends Sesol2_1.Sesol2 {
    constructor(user, aliases = [], quota = 0, sexo) {
        super(user.email, COMMITTER_TYPE, user.email);
        this.email = user.email;
        this.name = user.name;
        this.avatar_url = user.avatar_url;
        this.username = user.username;
        if (aliases.indexOf(user.username.toLowerCase()) === -1) {
            aliases.push(user.username.toLowerCase());
        }
        this.aliases = aliases;
        this.quota = quota;
        this.sexo = sexo;
    }
    vazioOuA() {
        return !this.sexo ? "(a)" : this.sexo === "m" ? "" : "a";
    }
    oOuA() {
        return !this.sexo ? "o(a)" : this.sexo === "m" ? "o" : "a";
    }
    static findAll() {
        return Sesol2Repository_1.sesol2Repository.findAll(COMMITTER_TYPE);
    }
}
exports.Committer = Committer;
