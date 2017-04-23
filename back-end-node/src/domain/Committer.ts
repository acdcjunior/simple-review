import {Sesol2} from "./Sesol2";
import {sesol2Repository} from "./Sesol2Repository";
import {GitLabUser} from "../gitlab/GitLabUser";

export class Committer extends Sesol2 {

    public static readonly COMMITTER_TYPE = 'committer';

    public readonly email: string;
    public readonly name: string;
    public readonly avatar_url: string;
    public readonly username: string;

    public readonly aliases: string[];
    public readonly quota: number;
    public readonly sexo: string;

    constructor(user: GitLabUser, aliases: string[] = [], quota: number = 0, sexo?: string) {
        super(user.email, Committer.COMMITTER_TYPE, user.email);

        this.email = user.email;
        this.name = user.name;
        this.avatar_url = user.avatar_url;
        this.username = user.username;

        if (aliases.indexOf(user.username.toLowerCase()) === -1) {
            aliases.push(user.username.toLowerCase());
        }
        this.aliases = aliases;
        this.quota = quota;
        this.sexo = sexo;
    }

    vazioOuA() {
        return !this.sexo ? "(a)" : this.sexo === "m" ? "" : "a";
    }
    oOuA() {
        return !this.sexo ? "o(a)" : this.sexo === "m" ? "o" : "a";
    }

}