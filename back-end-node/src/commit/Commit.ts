import {Sesol2} from "../geral/Sesol2";
import {Email} from "../geral/Email";
import {GitLabService} from "../gitlab/GitLabService";
import {Committer} from "../committers/Committer";

export class Commit extends Sesol2 {

    public static readonly COMMIT_TYPE = 'commit';

    public readonly sha: string;
    public readonly title: string;
    public readonly message: string;
    public readonly author_email: string;
    public readonly created_at: string;
    public revisado: boolean;
    public readonly revisores: any[];
    public readonly revisoes: any[];
    public readonly historico: any[];

    constructor(sha, title, message, author_email, created_at) {
        super(sha, Commit.COMMIT_TYPE, title);

        this.sha = sha;
        this.title = title;
        this.message = message;
        this.author_email = Email.corrigirEmail(author_email);
        this.created_at = created_at;
        this.revisado = false;
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
        return this.incluirRevisor(revisor, `Revisor${revisor.vazioOuA()} ${revisor.mencao()} atribuíd${revisor.oOuA()} via menção em mensagem de commit.`);
    }

    indicarRevisorViaSistema(revisor: Committer): Promise<void> {
        return this.incluirRevisor(revisor, `Revisor${revisor.vazioOuA()} ${revisor.mencao()} atribuíd${revisor.oOuA()} automaticamente.`);
    }

    incluirRevisor(revisor: Committer, msg: string): Promise<void> {
        this.revisores.push(revisor.email);
        this.comentarNoGitLab(msg);
        this.incluirHistorico(msg);
        return Promise.resolve();
    }

    private incluirHistorico(msgHistorico: string) {
        this.historico.push(msgHistorico.replace(/`/g, ''));
    }

    private comentarNoGitLab(msg) {
        //noinspection JSIgnoredPromiseFromCall
        GitLabService.comentar(this.sha, ':loud_sound: ' + msg);
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

}

