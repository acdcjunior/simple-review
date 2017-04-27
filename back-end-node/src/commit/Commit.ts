import {Sesol2} from "../geral/Sesol2";
import {Email} from "../geral/Email";
import {GitLabService} from "../gitlab/GitLabService";
import {Committer} from "../committers/Committer";

class RevisaoCommit {
    public readonly revisor: string; // "antonio.junior@tcu.gov.br"
    public readonly sexoRevisor: string; // "m"
    public readonly data: string; // "2017-04-25T23:06:31.702Z"
    public readonly tipoRevisao: string; // "par"
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
        return this.incluirRevisor(revisor, `Revisor${revisor.vazioOuA()} ${revisor.mencao()} atribuíd${revisor.oOuA()} via menção em mensagem de commit.`);
    }

    indicarRevisorViaSistema(revisor: Committer): Promise<void> {
        return this.incluirRevisor(revisor, `Revisor${revisor.vazioOuA()} ${revisor.mencao()} atribuíd${revisor.oOuA()} automaticamente.`);
    }

    // este email estah hardcoded na committers do front-end
    private static readonly EMAIL_NAO_TERAH_REVISOR: string = 'nao-terah-revisor@srv-codereview.tcu.gov.br';
    indicarCommitNaoTerahRevisor(razao: string): Promise<void> {
        this.revisoes.push({
            revisor: Commit.EMAIL_NAO_TERAH_REVISOR,
            sexoRevisor: undefined,
            data: new Date().toISOString(),
            tipoRevisao: "sem revisão"
        });
        return this.incluirRevisor({email: Commit.EMAIL_NAO_TERAH_REVISOR}, `Commit não terá revisor: ${razao}.`);
    }

    incluirRevisor(revisor: {email}, msg: string): Promise<void> {
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

    private static regexMensagemMerge: RegExp = /^Merge( remote-tracking)? branch '[\w\/]+'( of http.*?\.git)? into [\w\/]+[\s\S]*$/;
    isCommitDeMergeSemConflito() {
        return Commit.regexMensagemMerge.test(this.message) && this.message.indexOf('Conflicts:') === -1;
    }

}

