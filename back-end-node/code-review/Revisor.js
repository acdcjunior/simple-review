const comentar = require('./comentar');

class Revisor {

    static revisorIndicado(sha, revisorIndicado) {
        const msg = `Revisor ${revisorIndicado} atribuído por indicação via mensagem de commit.`;
        comentar(sha, this.comentario(msg));
        return msg;
    }

    static revisorCalculado(sha, revisorCalculado) {
        const msg = `Revisor ${revisorCalculado} atribuído automaticamente.`;
        comentar(sha, this.comentario(msg));
        return msg;
    }

    static comentario(msg) {
        return ':checkered_flag: ' + this.removerDomainDoEmail(msg);
    }

    static removerDomainDoEmail(msg) {
        return msg.replace(/(\S+)@tcu.gov.br/, '@$1');
    }

}

module.exports = Revisor;