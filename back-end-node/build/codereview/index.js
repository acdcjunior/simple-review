"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CommitFactory_1 = require("../commit/CommitFactory");
const CommittersFactory_1 = require("../committers/CommittersFactory");
function carregarCommitsAndCommitters() {
    console.log('*** Iniciando carga de committers e commits...\n\n');
    return CommittersFactory_1.CommittersFactory.carregarCommittersDoArquivo().then(() => {
        return CommittersFactory_1.CommittersFactory.carregarCommittersDosUltimosCommits();
    }).then(() => {
        return CommitFactory_1.CommitFactory.carregarCommits();
    });
}
exports.carregarCommitsAndCommitters = carregarCommitsAndCommitters;
