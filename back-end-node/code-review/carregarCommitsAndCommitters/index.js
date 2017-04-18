const Utils = require('../util/Utils');

const carregarCommitters = require('./carregarCommitters');
const carregarCommits = require('./carregarCommits');

function carregarCommitsAndCommitters() {
    console.log('Iniciando carga de committers e commits...');
    Utils.printBar();

    return carregarCommitters().then(() => {
        // carregarCommits();
    });
}

module.exports = carregarCommitsAndCommitters;