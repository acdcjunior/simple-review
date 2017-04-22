"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Sesol2_1 = require("./Sesol2");
const Sesol2Repository_1 = require("./Sesol2Repository");
const Email_1 = require("../geral/Email");
const RevisoresConfig_1 = require("../codereview/RevisoresConfig");
const COMMITTER_TYPE = 'committer';
class Committer extends Sesol2_1.Sesol2 {
    constructor(email, name, avatar_url, username) {
        super(Email_1.Email.corrigirEmail(email), COMMITTER_TYPE, Email_1.Email.corrigirEmail(email));
        this.email = Email_1.Email.corrigirEmail(email);
        this.name = name;
        this.avatar_url = avatar_url;
        this.username = username;
        const revisoresViaConfig = RevisoresConfig_1.RevisoresConfig.getDadosRevisorConfig(username);
        this.quota = revisoresViaConfig.quota;
        this.sexo = revisoresViaConfig.sexo;
    }
    static findAll() {
        return Sesol2Repository_1.sesol2Repository.findAll(COMMITTER_TYPE);
    }
}
exports.Committer = Committer;
