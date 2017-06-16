import {Sesol2} from "../geral/Sesol2";
import {Email} from "../geral/Email";
import {GitLabService} from "../gitlab/GitLabService";
import {Committer} from "../committers/Committer";
import {CommitterRepository} from "../committers/CommitterRepository";

export class TipoRevisaoCommit {

    //noinspection JSUnusedGlobalSymbols
    public static readonly SEM_FOLLOW_UP: string = "sem follow-up";
    public static readonly COM_FOLLOW_UP: string = "com follow-up";
    public static readonly SEM_REVISAO: string = "sem revisão";
    public static readonly PAR: string = "par";

    static comentar(usernameRevisor, sha, tipoRevisao): Promise<void> {
        return CommitterRepository.findCommitterByUsernameOrAlias(usernameRevisor).then((committer: Committer) => {
            switch (tipoRevisao) {
                case TipoRevisaoCommit.PAR:
                    return GitLabService.comentar(sha, `:white_check_mark: Commit marcado como **feito em par** por ${committer.mencao()}.`);
                case TipoRevisaoCommit.COM_FOLLOW_UP:
                    return GitLabService.comentar(sha, `:ballot_box_with_check: Commit marcado como **revisado com** ***follow-up*** por ${committer.mencao()}.`);
                case TipoRevisaoCommit.SEM_REVISAO:
                    return GitLabService.comentar(sha, `:ok: Commit marcado como **não terá revisor** por ${committer.mencao()}.`);
                default:
                    return GitLabService.comentar(sha, `:ballot_box_with_check: Commit marcado como **revisado sem** ***follow-up*** por ${committer.mencao()}.`);
            }
        });
    }

}

interface RevisaoCommit {
    readonly revisor: string; // "antonio.junior@example.com.br"
    readonly sexoRevisor: string; // "m"
    readonly data: string; // "2017-04-25T23:06:31.702Z"
    readonly tipoRevisao: string; // "par"
}

export class Commit extends Sesol2 {

    public static readonly COMMIT_TYPE = 'commit';

    public readonly sha: string;
    public readonly title: string;
    public readonly message: string;
    public readonly author_email: string;
    public readonly created_at: string;
    public readonly revisores: any[];
    public readonly revisoes: RevisaoCommit[];
    public readonly historico: any[];

    constructor(sha, title, message, author_email, created_at) {
        super(sha, Commit.COMMIT_TYPE, title);

        this.sha = sha;
        this.title = title;
        this.message = message;
        this.author_email = Email.corrigirEmail(author_email);
        this.created_at = created_at;
        this.revisores = [];
        this.revisoes = [];
        this.historico = [];
    }

    public indicarRevisoresViaMencao(revisores: Committer[]): Promise<void> {
        if (revisores.length === 0) {
            return Promise.resolve();
        }
        const revisor = revisores[0];
        const revisoresRestantes = revisores.slice(1);
        return this.indicarRevisorViaMencao(revisor).then(() => {
            return this.indicarRevisoresViaMencao(revisoresRestantes);
        });
    }

    private indicarRevisorViaMencao(revisor: Committer): Promise<void> {
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

    indicarRevisorViaSistema(revisor: Committer): Promise<void> {
        return this.incluirRevisor(revisor, `:heavy_plus_sign: :gear: Revisor${revisor.vazioOuA()} ${revisor.mencao()} atribuíd${revisor.oOuA()} automaticamente.`);
    }

    indicarCommitNaoTerahRevisor(razao: string): Promise<void> {
        return CommitterRepository.findBotComentador().then((botComentador: Committer) => {
            this.revisoes.push({
                revisor: botComentador.email,
                sexoRevisor: botComentador.sexo,
                data: new Date().toISOString(),
                tipoRevisao: TipoRevisaoCommit.SEM_REVISAO
            });
            return this.incluirRevisor(botComentador, `:ok: Commit não terá revisão: ${razao}.`);
        });
    }

    private incluirRevisor(revisor: Committer, msg: string): Promise<void> {
        if (!revisor) {
            throw new Error("Revisor undefined: "+JSON.stringify(revisor, null, '\t'));
        }
        this.revisores.push(revisor.email);
        this.comentarNoGitLab(msg);
        this.incluirHistorico(msg);
        return Promise.resolve();
    }

    private incluirHistorico(msgHistorico: string) {
        this.historico.push(msgHistorico);
    }

    private comentarNoGitLab(msg) {
        //noinspection JSIgnoredPromiseFromCall
        GitLabService.comentar(this.sha, msg);
    }

    isCommitDeEstagiario() {
        return Commit.isEmailDeEstagiario(this.author_email);
    }

    private static isEmailDeEstagiario(email: string) {
        return new Email(email).isEmailDeEstagiario();
    }

    naoTemNenhumRevisorEstagiario() {
        const temRevisorEstagiario = this.revisores.filter(Commit.isEmailDeEstagiario).length > 0;
        return !temRevisorEstagiario;
    }

    todosOsRevisoresSaoEstagiarios() {
        return this.revisores.filter(Commit.isEmailDeEstagiario).length === this.revisores.length;
    }

    private static readonly REGEX_MENSAGEM_MERGE: RegExp = /^Merge( remote-tracking)? branch '[\w\/-]+'( of http.*?\.git)? into [\w\/]+[\s\S]*$/;
    isCommitDeMergeSemConflito() {
        return Commit.REGEX_MENSAGEM_MERGE.test(this.message) && this.message.indexOf('Conflicts:') === -1;
    }

    private static readonly REGEX_MENSAGEM_SEM_REVISOR: RegExp = /\[sem[- ]revis(or|ao)]/;
    isCommitNaoDeveSerRevisado() {
        return Commit.REGEX_MENSAGEM_SEM_REVISOR.test(this.message);
    }

}

