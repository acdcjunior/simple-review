const comentar = require('./comentar');
const listaRevisores = require('./carregarCommitsAndCommitters/revisores');

class Revisor {

    static revisorIndicado(sha, revisorIndicado) {
        const msg = `Revisor ${listaRevisores.userNameComNome(revisorIndicado)} atribuído por indicação via mensagem de commit.`;
        // comentar(sha, this.comentario(msg));
        return msg;
    }

    static revisorCalculado(sha, revisorCalculado) {
        const msg = `Revisor ${listaRevisores.userNameComNome(revisorCalculado)} atribuído automaticamente.`;
        // comentar(sha, this.comentario(msg));
        return msg;
    }

    static comentario(msg) {
        return ':loud_sound: ' + this.removerDomainDoEmail(msg);
    }

    static removerDomainDoEmail(msg) {
        return msg.replace(/(\S+)@tcu.gov.br/, '@$1');
    }

}

module.exports = Revisor;