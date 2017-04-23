"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Utils_1 = require("../util/Utils");
const carregarCommits_1 = require("./carregarCommits");
const CommittersFactory_1 = require("../committers/CommittersFactory");
function carregarCommitsAndCommitters() {
    console.log('Iniciando carga de committers e commits...');
    Utils_1.Utils.printBar();
    return CommittersFactory_1.CommittersFactory.carregarCommittersDoArquivo().then(() => {
        return CommittersFactory_1.CommittersFactory.carregarCommittersDosUltimosCommits();
    }).then(() => {
        return carregarCommits_1.carregarCommits();
    });
}
exports.carregarCommitsAndCommitters = carregarCommitsAndCommitters;
