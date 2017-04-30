"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Sesol2_1 = require("../geral/Sesol2");
const CodeReviewConfig_1 = require("../geral/CodeReviewConfig");
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
        this.isBotComentador = user.username === CodeReviewConfig_1.codeReviewConfig.botComentador.username;
        this.invalido = user.invalido;
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
        const gitLabUser = {
            username: username,
            email: username,
            name: username,
            avatar_url: undefined,
            id: undefined,
            state: undefined,
            web_url: undefined,
            invalido: true,
        };
        return new Committer(gitLabUser, null);
    }
    isInvalido() {
        return this.invalido;
    }
}
Committer.COMMITTER_TYPE = 'committer';
exports.Committer = Committer;
