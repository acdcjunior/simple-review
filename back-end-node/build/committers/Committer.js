"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Sesol2_1 = require("../geral/Sesol2");
const GitLabUser_1 = require("../gitlab/GitLabUser");
class Committer extends Sesol2_1.Sesol2 {
    constructor(user, impersonationToken, aliases = [], quota = 0, sexo) {
        super(user.email, Committer.COMMITTER_TYPE, user.email);
        this.email = user.email;
        this.name = user.name;
        this.avatar_url = user.avatar_url;
        this.username = user.username;
        this.user_id = user.id;
        this.impersonationToken = impersonationToken ? impersonationToken.token : undefined;
        if (aliases.indexOf(user.username) === -1) {
            aliases.push(user.username);
        }
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
    mencao() {
        return `@${this.username} [\`${this.name}\`]`;
    }
    static committerInvalido(username) {
        const gitLabUser = new GitLabUser_1.GitLabUser();
        gitLabUser.username = username;
        return new Committer(gitLabUser, null, [], 0, Committer.COMMITTER_INVALIDO);
    }
    isInvalido() {
        return this.sexo === Committer.COMMITTER_INVALIDO;
    }
}
Committer.COMMITTER_TYPE = 'committer';
Committer.COMMITTER_INVALIDO = 'committer-invalido';
exports.Committer = Committer;
