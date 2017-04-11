'use strict';
const Sesol2 = require('./Sesol2');
const Committer = require('./Committer');

const EMAILS_SERVIDORES = ['a@s', 'b@s', 'c@s'];
const EMAILS_ESTAGIARIOS = ['a@e', 'b@e', 'c@e'];

class Commit extends Sesol2 {

    constructor(sha, title, message, author_email, created_at) {
        super(sha, 'commit', title);

        this.sha = sha;
        this.title = title;
        this.message = message;
        this.author_email = Committer.corrigirEmail(author_email);
        this.created_at = created_at;

        this.revisor_email = this.calcularRevisor();
        this.revisado = false;
        this.historico = [`Revisor ${this.revisor_email} atribuído automaticamente pelo sistema.`];
    }

    calcularRevisor() {
        if (Commit.isServidor(this.author_email)) {
            return this.sortearExceto(EMAILS_SERVIDORES, this.author_email);
        }
        if (Commit.isEstagiario(this.author_email)) {
            return this.sortearExceto(EMAILS_ESTAGIARIOS, this.author_email);
        }
        let todosEmails = EMAILS_SERVIDORES.concat(EMAILS_ESTAGIARIOS);
        return this.sortearExceto(todosEmails, this.author_email);
    }

    static isServidor(authorEmail) {
        return EMAILS_SERVIDORES.indexOf(authorEmail) !== -1;
    }

    static isEstagiario(authorEmail) {
        return EMAILS_ESTAGIARIOS.indexOf(authorEmail) !== -1;
    }

    sortearExceto(lista, autorQueDeveSerExcluido) {
        let listaFiltrada = lista.filter(item => {
            return item !== autorQueDeveSerExcluido;
        });

        let indiceAleatorio = Math.floor(Math.random() * listaFiltrada.length);
        return listaFiltrada[indiceAleatorio];
    }

}

module.exports = Commit;