"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Sesol2_1 = require("../geral/Sesol2");
const Email_1 = require("../geral/Email");
const GitLabService_1 = require("../gitlab/GitLabService");
class Commit extends Sesol2_1.Sesol2 {
    constructor(sha, title, message, author_email, created_at) {
        super(sha, Commit.COMMIT_TYPE, title);
        this.sha = sha;
        this.title = title;
        this.message = message;
        this.author_email = Email_1.Email.corrigirEmail(author_email);
        this.created_at = created_at;
        this.revisado = false;
        this.revisores = [];
        this.revisoes = [];
        this.historico = [];
    }
    indicarRevisoresViaMencao(revisores) {
        if (revisores.length === 0) {
            return Promise.resolve();
        }
        const revisor = revisores[0];
        const revisoresRestantes = revisores.slice(1);
        return this.indicarRevisorViaMencao(revisor).then(() => {
            return this.indicarRevisoresViaMencao(revisoresRestantes);
        });
    }
    indicarRevisorViaMencao(revisor) {
        if (revisor.isInvalido()) {
            this.incluirHistorico(`Revisor(a) @${revisor.username} mencionado(a), mas não reconhecido(a) na base de usuários. Menção ignorada.`);
            return Promise.resolve();
        }
        if (revisor.email == this.author_email) {
            this.incluirHistorico(`Revisor${revisor.vazioOuA()} ${revisor.mencao()} mencionad${revisor.oOuA()} é autor${revisor.vazioOuA()} do commit. Menção ignorada.`);
            return Promise.resolve();
        }
        return this.incluirRevisor(revisor, `Revisor${revisor.vazioOuA()} ${revisor.mencao()} atribuíd${revisor.oOuA()} via menção em mensagem de commit.`);
    }
    indicarRevisorViaSistema(revisor) {
        return this.incluirRevisor(revisor, `Revisor${revisor.vazioOuA()} ${revisor.mencao()} atribuíd${revisor.oOuA()} automaticamente.`);
    }
    incluirRevisor(revisor, msg) {
        this.revisores.push(revisor.email);
        this.comentarNoGitLab(msg);
        this.incluirHistorico(msg);
        return Promise.resolve();
    }
    incluirHistorico(msgHistorico) {
        this.historico.push(msgHistorico);
    }
    comentarNoGitLab(msg) {
        //noinspection JSIgnoredPromiseFromCall
        GitLabService_1.GitLabService.comentar(this.sha, ':loud_sound: ' + msg);
    }
    isCommitDeEstagiario() {
        return Commit.isEmailDeEstagiario(this.author_email);
    }
    static isEmailDeEstagiario(email) {
        return new Email_1.Email(email).isEmailDeEstagiario();
    }
    naoTemNenhumRevisorEstagiario() {
        const temRevisorEstagiario = this.revisores.filter(Commit.isEmailDeEstagiario).length > 0;
        return !temRevisorEstagiario;
    }
    todosOsRevisoresSaoEstagiarios() {
        return this.revisores.filter(Commit.isEmailDeEstagiario).length === this.revisores.length;
    }
}
Commit.COMMIT_TYPE = 'commit';
exports.Commit = Commit;
