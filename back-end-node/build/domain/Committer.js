"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Sesol2_1 = require("./Sesol2");
const Sesol2Repository_1 = require("./Sesol2Repository");
const COMMITTER_TYPE = 'committer';
class Committer extends Sesol2_1.Sesol2 {
    constructor(email, name, avatar_url, username) {
        super(Committer.corrigirEmail(email), COMMITTER_TYPE, Committer.corrigirEmail(email));
        this.email = Committer.corrigirEmail(email);
        this.name = name;
        this.avatar_url = avatar_url;
        this.username = username;
        this.percentualDeRevisoes = this.calcularPercentualDeRevisoes();
    }
    static corrigirEmail(email) {
        return email.replace(/@E-\d{6}\.(?=tcu\.gov\.br$)/g, '@').toLowerCase();
    }
    static findAll() {
        return Sesol2Repository_1.sesol2Repository.findAll(COMMITTER_TYPE);
    }
    calcularPercentualDeRevisoes() {
        switch (this.email) {
            // note que nunca vai chegar a 100% porque muitos commits vao pra estagiarios
            case 'alexandrevr@tcu.gov.br': return 25;
            case 'antonio.junior@tcu.gov.br': return 40;
            case 'marcosps@tcu.gov.br': return 25;
            case 'regiano@tcu.gov.br': return 10;
            case 'fernandesm@tcu.gov.br': return 0;
            case 'leliakn@tcu.gov.br': return 0;
            case 'carlanm@tcu.gov.br': return 0;
            // dentre os estagiarios, eh 25%
            default: return 25;
        }
    }
}
exports.Committer = Committer;
