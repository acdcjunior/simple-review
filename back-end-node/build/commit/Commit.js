"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Sesol2_1 = require("../geral/Sesol2");
const Email_1 = require("../geral/Email");
const GitLabService_1 = require("../gitlab/GitLabService");
class RevisaoCommit {
}
class Commit extends Sesol2_1.Sesol2 {
    constructor(sha, title, message, author_email, created_at) {
        super(sha, Commit.COMMIT_TYPE, title);
        this.sha = sha;
        this.title = title;
        this.message = message;
        this.author_email = Email_1.Email.corrigirEmail(author_email);
        this.created_at = created_at;
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
            this.incluirHistorico(`:interrobang: Revisor(a) @${revisor.username} mencionado(a), mas não reconhecido(a) na base de usuários. Menção ignorada.`);
            return Promise.resolve();
        }
        if (revisor.email == this.author_email) {
            this.incluirHistorico(`:interrobang: Revisor${revisor.vazioOuA()} ${revisor.mencao()} mencionad${revisor.oOuA()} é autor${revisor.vazioOuA()} do commit. Menção ignorada.`);
            return Promise.resolve();
        }
        return this.incluirRevisor(revisor, `:heavy_plus_sign: :point_right: Revisor${revisor.vazioOuA()} ${revisor.mencao()} atribuíd${revisor.oOuA()} via menção em mensagem de commit.`);
    }
    indicarRevisorViaSistema(revisor) {
        return this.incluirRevisor(revisor, `:heavy_plus_sign: :gear: Revisor${revisor.vazioOuA()} ${revisor.mencao()} atribuíd${revisor.oOuA()} automaticamente.`);
    }
    indicarCommitNaoTerahRevisor(razao) {
        this.revisoes.push({
            revisor: Commit.EMAIL_NAO_TERAH_REVISOR,
            sexoRevisor: undefined,
            data: new Date().toISOString(),
            tipoRevisao: "sem revisão"
        });
        return this.incluirRevisor({ email: Commit.EMAIL_NAO_TERAH_REVISOR }, `:ok: Commit não terá revisor: ${razao}.`);
    }
    incluirRevisor(revisor, msg) {
        if (!revisor) {
            throw new Error("Revisor undefined: " + JSON.stringify(revisor, null, '\t'));
        }
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
        GitLabService_1.GitLabService.comentar(this.sha, msg);
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
    isCommitDeMergeSemConflito() {
        return Commit.regexMensagemMerge.test(this.message) && this.message.indexOf('Conflicts:') === -1;
    }
}
Commit.COMMIT_TYPE = 'commit';
// este email estah hardcoded na committers do front-end
Commit.EMAIL_NAO_TERAH_REVISOR = 'nao-terah-revisor@srv-codereview.tcu.gov.br';
Commit.regexMensagemMerge = /^Merge( remote-tracking)? branch '[\w\/]+'( of http.*?\.git)? into [\w\/]+[\s\S]*$/;
exports.Commit = Commit;
