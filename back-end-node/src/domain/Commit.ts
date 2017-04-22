import {Sesol2} from "./Sesol2";
import {Email} from "../geral/Email";
import {Revisores} from "../carregarCommitsAndCommitters/Revisores";
import {GitLabService} from "../gitlab/GitLabService";
import {sesol2Repository} from "./Sesol2Repository";
import {RevisoresConfig} from "../codereview/RevisoresConfig";


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

    public indicarRevisoresViaMencao(revisores: Email[]): Promise<void> {
        if (revisores.length === 0) {
            return Promise.resolve();
        }
        const revisor = revisores[0];
        const revisoresRestantes = revisores.slice(1);
        return this.indicarRevisorViaMencao(revisor).then(() => {
            return this.indicarRevisoresViaMencao(revisoresRestantes);
        });
    }

    private indicarRevisorViaMencao(revisor: Email): Promise<void> {
        if (revisor.invalido) {
            this.incluirHistorico(`Revisor(a) ${revisor.email} mencionado(a), mas não reconhecido(a) na base de usuários. Menção ignorada.`);
            return Promise.resolve();
        }
        return RevisoresConfig.verificados.then(() => {
            const revisorConfig = RevisoresConfig.revisores[revisor.email];
            if (revisor.email == this.author_email) {
                this.incluirHistorico(`Revisor${revisorConfig.vazioOuA()} ${revisor.email} mencionad${revisorConfig.oOuA()} é autor${revisorConfig.vazioOuA()} do commit. Menção ignorada.`);
                return Promise.resolve();
            }
            return this.incluirRevisor(revisor, userNameComNome => `Revisor${revisorConfig.vazioOuA()} ${userNameComNome} atribuíd${revisorConfig.oOuA()} via menção em mensagem de commit.`);
        });
    }

    indicarRevisorViaSistema(revisor: Email): Promise<void> {
        return RevisoresConfig.verificados.then(() => {
            const revisorConfig = RevisoresConfig.revisores[revisor.email];
            return this.incluirRevisor(revisor, userNameComNome => `Revisor${revisorConfig.vazioOuA()} ${userNameComNome} atribuíd${revisorConfig.oOuA()} automaticamente.`);
        });
    }

    incluirRevisor(revisor: Email, funcaoMensagem: (userNameComNome: string) => string): Promise<void> {
        this.revisores.push(revisor.email);
        return Revisores.userNameComNome(revisor).then((userNameComNome: string) => {
            const msg = funcaoMensagem(userNameComNome);
            this.comentarNoGitLab(msg);
            this.incluirHistorico(msg);
            return Promise.resolve();
        });
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

