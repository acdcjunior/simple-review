const comentar = require('./comentar');
const Revisores = require('./carregarCommitsAndCommitters/Revisores').Revisores;

export class Revisor {

    static revisorCalculado(sha, revisorCalculado): Promise<string> {
        return Revisores.userNameComNome(revisorCalculado).then((userNameComNome: string) => {
            const msg = `Revisor ${userNameComNome} atribuído automaticamente.`;
            // comentar(sha, this.comentario(msg));
            return Promise.resolve(msg);
        });
    }

    static revisorIndicado(sha, revisorIndicado): Promise<string> {
        return Revisores.userNameComNome(revisorIndicado).then((userNameComNome: string) => {
            const msg = `Revisor ${userNameComNome} atribuído por indicação via mensagem de commit.`;
            // comentar(sha, this.comentario(msg));
            return Promise.resolve(msg);
        });
    }

    static comentario(msg) {
        return ':loud_sound: ' + msg;
    }

}