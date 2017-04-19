"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Utils = require("../util/Utils");
const carregarCommitters_1 = require("./carregarCommitters");
const carregarCommits_1 = require("./carregarCommits");
function carregarCommitsAndCommitters() {
    console.log('Iniciando carga de committers e commits...');
    Utils.printBar();
    return carregarCommitters_1.carregarCommitters().then(() => {
        carregarCommits_1.carregarCommits();
    });
}
module.exports = carregarCommitsAndCommitters;
