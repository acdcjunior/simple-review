import {Sesol2} from "./Sesol2";

const Committer = require('./Committer');
const sesol2Repository = require('./Sesol2Repository');

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
        this.author_email = Committer.corrigirEmail(author_email);
        this.created_at = created_at;
        this.revisado = false;
        this.revisores = [];
        this.revisoes = [];
        this.historico = [];
    }

    public static findAll(): Promise<Commit[]> {
        return sesol2Repository.findAll(COMMIT_TYPE)
    }

}