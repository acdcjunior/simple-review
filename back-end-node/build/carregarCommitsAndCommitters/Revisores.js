"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const GitLabService_1 = require("../gitlab/GitLabService");
const Email_1 = require("../geral/Email");
class Revisores {
    static mencaoToEmail(mencao) {
        if (mencao[0] !== '@') {
            throw new Error(`Mencoes devem comecar com arroba: ${mencao}`);
        }
        let mencaoSemArroba = mencao.substring(1).toLowerCase();
        let username = Revisores.usernamesAliases[mencaoSemArroba] || mencaoSemArroba;
        return GitLabService_1.GitLabService.getUserByUsername(username).then((user) => {
            if (!user) {
                return Promise.resolve(new Email_1.Email(mencao, true));
            }
            return Promise.resolve(new Email_1.Email(user.email));
        });
    }
    static userNameComNome(email) {
        return GitLabService_1.GitLabService.getUserByEmail(email).then((usuario) => {
            return Promise.resolve(`@${usuario.username} [${usuario.name}]`);
        });
    }
}
Revisores.usernamesAliases = {
    'alex': 'alexandrevr',
    'alexandre': 'alexandrevr',
    'antonio': 'carvalhoj',
    'antonio.junior': 'carvalhoj',
    'marcos': 'marcosps',
    'marcao': 'marcosps',
    'regis': 'regiano',
    'fernandes': 'fernandesm',
    'mauricio': 'fernandesm',
    'josemauricio': 'fernandesm',
    'lelia': 'LELIAKN',
    'leliakarina': 'LELIAKN',
    'leliakn': 'LELIAKN',
    'carla': 'CarlaNM',
    'carlanm': 'CarlaNM',
    'gabriel': 'x04912831131',
    'mesquita': 'x04912831131',
    'rebeca': 'x05068385107',
    'rebecca': 'x05068385107',
    'afonso': 'x05491194182',
    'bruno': 'x05929991146',
};
exports.Revisores = Revisores;
