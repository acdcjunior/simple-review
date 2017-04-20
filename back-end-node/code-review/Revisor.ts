const comentar = require('./comentar');
const Revisores = require('./carregarCommitsAndCommitters/revisores').Revisores;

class Revisor {

    static revisorIndicado(sha, revisorIndicado) {
        return Revisores.userNameComNome(revisorIndicado).then(userNameComNome => {
            const msg = `Revisor ${userNameComNome} atribuído por indicação via mensagem de commit.`;
            // comentar(sha, this.comentario(msg));
            return Promise.resolve(msg);
        })
    }

    static revisorCalculado(sha, revisorCalculado) {
        const msg = `Revisor ${Revisores.userNameComNome(revisorCalculado)} atribuído automaticamente.`;
        // comentar(sha, this.comentario(msg));
        return msg;
    }

    static comentario(msg) {
        return ':loud_sound: ' + this.removerDomainDoEmail(msg);
    }

    static removerDomainDoEmail(msg) {
        return msg.replace(/(\S+)@tcu.gov.br/, '$1');
    }

}

module.exports = Revisor;