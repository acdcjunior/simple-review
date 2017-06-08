"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Sesol2_1 = require("../geral/Sesol2");
const Email_1 = require("../geral/Email");
const GitLabService_1 = require("../gitlab/GitLabService");
const CommitterRepository_1 = require("../committers/CommitterRepository");
class TipoRevisaoCommit {
    static comentar(usernameRevisor, sha, tipoRevisao) {
        return CommitterRepository_1.CommitterRepository.findCommitterByUsernameOrAlias(usernameRevisor).then((committer) => {
            switch (tipoRevisao) {
                case TipoRevisaoCommit.PAR:
                    return GitLabService_1.GitLabService.comentar(sha, `:white_check_mark: Commit marcado como **feito em par** por ${committer.mencao()}.`);
                case TipoRevisaoCommit.COM_FOLLOW_UP:
                    return GitLabService_1.GitLabService.comentar(sha, `:ballot_box_with_check: Commit marcado como **revisado com** ***follow-up*** por ${committer.mencao()}.`);
                case TipoRevisaoCommit.SEM_REVISAO:
                    return GitLabService_1.GitLabService.comentar(sha, `:ok: Commit marcado como **não terá revisor** por ${committer.mencao()}.`);
                default:
                    return GitLabService_1.GitLabService.comentar(sha, `:ballot_box_with_check: Commit marcado como **revisado sem** ***follow-up*** por ${committer.mencao()}.`);
            }
        });
    }
}
//noinspection JSUnusedGlobalSymbols
TipoRevisaoCommit.SEM_FOLLOW_UP = "sem follow-up";
TipoRevisaoCommit.COM_FOLLOW_UP = "com follow-up";
TipoRevisaoCommit.SEM_REVISAO = "sem revisão";
TipoRevisaoCommit.PAR = "par";
exports.TipoRevisaoCommit = TipoRevisaoCommit;
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
            this.incluirHistorico(`Revisor(a) @${revisor.username} mencionado(a), mas não reconhecido(a) na base de usuários. Menção ignorada.`);
            return Promise.resolve();
        }
        if (revisor.email == this.author_email) {
            this.incluirHistorico(`Revisor${revisor.vazioOuA()} ${revisor.mencao()} mencionad${revisor.oOuA()} é autor${revisor.vazioOuA()} do commit. Menção ignorada.`);
            return Promise.resolve();
        }
        return this.incluirRevisor(revisor, `:heavy_plus_sign: :point_right: Revisor${revisor.vazioOuA()} ${revisor.mencao()} atribuíd${revisor.oOuA()} via menção em mensagem de commit.`);
    }
    indicarRevisorViaSistema(revisor) {
        return this.incluirRevisor(revisor, `:heavy_plus_sign: :gear: Revisor${revisor.vazioOuA()} ${revisor.mencao()} atribuíd${revisor.oOuA()} automaticamente.`);
    }
    indicarCommitNaoTerahRevisor(razao) {
        return CommitterRepository_1.CommitterRepository.findBotComentador().then((botComentador) => {
            this.revisoes.push({
                revisor: botComentador.email,
                sexoRevisor: botComentador.sexo,
                data: new Date().toISOString(),
                tipoRevisao: TipoRevisaoCommit.SEM_REVISAO
            });
            return this.incluirRevisor(botComentador, `:ok: Commit não terá revisão: ${razao}.`);
        });
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
        return Commit.REGEX_MENSAGEM_MERGE.test(this.message) && this.message.indexOf('Conflicts:') === -1;
    }
    isCommitNaoDeveSerRevisado() {
        return Commit.REGEX_MENSAGEM_SEM_REVISOR.test(this.message);
    }
}
Commit.COMMIT_TYPE = 'commit';
Commit.REGEX_MENSAGEM_MERGE = /^Merge( remote-tracking)? branch '[\w\/-]+'( of http.*?\.git)? into [\w\/]+[\s\S]*$/;
Commit.REGEX_MENSAGEM_SEM_REVISOR = /\[sem[- ]revis(or|ao)]/;
exports.Commit = Commit;
