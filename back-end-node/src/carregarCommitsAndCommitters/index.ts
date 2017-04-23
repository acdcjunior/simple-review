import {Utils} from "../util/Utils";
import {carregarCommits} from "./carregarCommits";
import {CommittersFactory} from "../committers/CommittersFactory";


export function carregarCommitsAndCommitters() {
    console.log('Iniciando carga de committers e commits...');
    Utils.printBar();

    return CommittersFactory.carregarCommittersDoArquivo().then(() => {
        return CommittersFactory.carregarCommittersDosUltimosCommits()
    }).then(() => {
        return carregarCommits();
    });

}