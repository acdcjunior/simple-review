"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Sesol2_1 = require("./Sesol2");
class Committer extends Sesol2_1.Sesol2 {
    constructor(user, aliases = [], quota = 0, sexo) {
        super(user.email, Committer.COMMITTER_TYPE, user.email);
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
}
Committer.COMMITTER_TYPE = 'committer';
exports.Committer = Committer;
