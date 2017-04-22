"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const comentar = require('./comentar');
const Revisores = require('./carregarCommitsAndCommitters/Revisores').Revisores;
class Revisor {
    static revisorCalculado(sha, revisorCalculado) {
        return Revisores.userNameComNome(revisorCalculado).then((userNameComNome) => {
            const msg = `Revisor ${userNameComNome} atribuído automaticamente.`;
            // comentar(sha, this.comentario(msg));
            return Promise.resolve(msg);
        });
    }
    static revisorIndicado(sha, revisorIndicado) {
        return Revisores.userNameComNome(revisorIndicado).then((userNameComNome) => {
            const msg = `Revisor ${userNameComNome} atribuído por indicação via mensagem de commit.`;
            // comentar(sha, this.comentario(msg));
            return Promise.resolve(msg);
        });
    }
    static comentario(msg) {
        return ':loud_sound: ' + msg;
    }
}
exports.Revisor = Revisor;
