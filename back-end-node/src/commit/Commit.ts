import {Sesol2} from "../domain/Sesol2";
import {Email} from "../geral/Email";
import {GitLabService} from "../gitlab/GitLabService";
import {sesol2Repository} from "../domain/Sesol2Repository";
import {Committer} from "../committers/Committer";

const COMMIT_TYPE = 'commit';

export class Commit extends Sesol2 {

    public sha: string;
    public title: string;
    public message: string;
    public author_email: string;
    public created_at: string;
    public revisado: boolean;
    public revisores: any[];
    public revisoes: any[];
    public historico: any[];

    constructor(sha, title, message, author_email, created_at) {
        super(sha, COMMIT_TYPE, title);

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

    public static findAll(): Promise<Commit[]> {
        return sesol2Repository.findAll(COMMIT_TYPE)
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

    private incluirHistorico(s: string) {
        this.historico.push(s);
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

