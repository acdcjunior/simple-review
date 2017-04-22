import {Sesol2} from "./Sesol2";
import {sesol2Repository} from "./Sesol2Repository";
import {Email} from "../geral/Email";
import {RevisoresConfig} from "../codereview/RevisoresConfig";

const COMMITTER_TYPE = 'committer';

export class Committer extends Sesol2 {

    public email: string;
    public name: string;
    public avatar_url: string;
    public username: string;

    public quota: number;
    public sexo: string;

    constructor(email: Email, name, avatar_url, username) {
        super(email.email, COMMITTER_TYPE, email.email);

        this.email = email.email;
        this.name = name;
        this.avatar_url = avatar_url;
        this.username = username;

        const revisoresViaConfig = RevisoresConfig.getDadosRevisorConfig(username);
        this.quota = revisoresViaConfig.quota;
        this.sexo = revisoresViaConfig.sexo;
    }

    static findAll(): Promise<Committer[]> {
        return sesol2Repository.findAll(COMMITTER_TYPE)
    }

}