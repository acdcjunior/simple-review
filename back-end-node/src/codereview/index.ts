import {CommitFactory} from "../commit/CommitFactory";
import {CommittersFactory} from "../committers/CommittersFactory";


export function carregarCommitsAndCommitters() {
    console.log('\t*** Iniciando carga de committers e commits...');

    return CommittersFactory.carregarCommittersDoArquivo().then(() => {
        return CommittersFactory.carregarCommittersDosUltimosCommits()
    }).then(() => {
        return CommitFactory.carregarCommits();
    });

}