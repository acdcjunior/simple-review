import {Sesol2} from "../geral/Sesol2";
import {GitLabUser} from "../gitlab/GitLabUser";
import {GitLabImpersonationToken} from "../gitlab/GitLabImpersonationToken";
import {codeReviewConfig} from "../geral/CodeReviewConfig";

export class Committer extends Sesol2 {

    public static readonly COMMITTER_TYPE = 'committer';

    public readonly user_id: number;
    public readonly email: string;
    public readonly name: string;
    public readonly avatar_url: string;
    public readonly username: string;

    public readonly impersonationToken: string;

    public readonly aliases: string[];
    public readonly quota: number;
    public readonly sexo: string;

    public readonly isBotComentador: boolean;
    public readonly invalido: boolean;

    constructor(user: GitLabUser, impersonationToken: GitLabImpersonationToken, aliases: string[] = [], quota: number = 0, sexo?: string) {
        super(user.email, Committer.COMMITTER_TYPE, user.email);

        this.email = user.email;
        this.name = user.name;
        this.avatar_url = user.avatar_url;
        this.username = user.username;
        this.user_id = user.id;

        this.impersonationToken = impersonationToken ? impersonationToken.token : undefined;

        if (aliases.indexOf(user.username) === -1) {
            aliases.push(user.username);
        }
        if (aliases.indexOf(user.username.toLowerCase()) === -1) {
            aliases.push(user.username.toLowerCase());
        }
        this.aliases = aliases;
        this.quota = quota;
        this.sexo = sexo;

        this.isBotComentador = user.username === codeReviewConfig.botComentador.username;
        this.invalido = user.invalido;
    }

    vazioOuA() {
        return !this.sexo ? "(a)" : this.sexo === "m" ? "" : "a";
    }
    oOuA() {
        return !this.sexo ? "o(a)" : this.sexo === "m" ? "o" : "a";
    }
    mencao() {
        return `\`${this.name}\``;
    }

    public static committerInvalido(username): Committer {
        const gitLabUser:GitLabUser = {
            username: username,
            email: username,
            name: username,
            avatar_url: undefined,
            id: undefined,
            state: undefined,
            web_url: undefined,
            invalido: true,
        };
        return new Committer(gitLabUser, null);
    }
    isInvalido() {
        return this.invalido;
    }

}