import * as fs from "fs";

export const arquivoProjeto: ArquivoProjeto = JSON.parse(fs.readFileSync('../config/projeto.json', 'utf8'));

export class ArquivoProjeto {

    public readonly dataCortePrimeiroCommit: string; // 2017-04-20T18:01:38.000-03:00
    public readonly branches: string[];
    public readonly committers: CommitterConfigStruct[];

}

export class CommitterConfigStruct {

    public username: string; // "alexandrevr",
    public sexo: string; // "m",
    public aliases: string[]; // ["alex", "alexandre"],
    public quota: number; // 25

}
