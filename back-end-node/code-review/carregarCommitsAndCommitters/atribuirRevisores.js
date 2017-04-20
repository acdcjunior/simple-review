"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Committer = require("../domain/Committer");
const sesol2Repository = require("../domain/Sesol2Repository");
const ArrayShuffle = require("../util/arrayShuffle");
const Revisor_1 = require("../Revisor");
const revisores_1 = require("./revisores");
const Commit_1 = require("../domain/Commit");
function isEstagiario(authorEmail) {
    return /[xX]\d{11}@tcu.gov.br$/.test(authorEmail);
}
function isServidor(authorEmail) {
    return !isEstagiario(authorEmail);
}
function historicoRevisorIndicado(commitSemRevisor, revisorIndicado) {
    return Revisor_1.Revisor.revisorIndicado(commitSemRevisor.sha, revisorIndicado).then(msg => {
        commitSemRevisor.historico.push(msg);
    });
}
function historicoRevisorCalculado(commitSemRevisor, revisorCalculado) {
    return Revisor_1.Revisor.revisorCalculado(commitSemRevisor.sha, revisorCalculado).then(msg => {
        commitSemRevisor.historico.push(msg);
    });
}
function extrairEmailsDeMencoes(mencoes, emails) {
    if (mencoes.length === 0) {
        return Promise.resolve(emails);
    }
    const mencao = mencoes.pop();
    return revisores_1.Revisores.mencaoToEmail(mencao).then((emailRevisor) => {
        emails.push(emailRevisor);
        return Promise.resolve(extrairEmailsDeMencoes(mencoes, emails));
    });
}
function extrairEmailsDosRevisoresMencionadosNoCommit(hashPercentuaisDeRevisoes, commitSemRevisor) {
    const message = commitSemRevisor.message;
    const mencoes = message.match(/@[a-zA-Z.0-9]+/g);
    if (mencoes) {
        return extrairEmailsDeMencoes(mencoes, []);
    }
    return Promise.resolve([]);
}
function incluirRevisoresMencionadosNaMensagem(commitSemRevisor, tabelaProporcoesDeCadaRevisor, tabelaContagemRevisoesAtribuidas) {
    return extrairEmailsDosRevisoresMencionadosNoCommit(tabelaProporcoesDeCadaRevisor, commitSemRevisor).then((revisoresIndicados) => {
        console.log('revisores indicados', revisoresIndicados);
    });
}
function calcularRevisoresDoCommit(commitSemRevisor, tabelaProporcoesDeCadaRevisor, tabelaContagemRevisoesAtribuidas) {
    console.log('calcularRevisoresDoCommit', commitSemRevisor);
    return incluirRevisoresMencionadosNaMensagem(commitSemRevisor, tabelaProporcoesDeCadaRevisor, tabelaContagemRevisoesAtribuidas).then(() => {
        // se for commit de estagiario
        // --> verificar se tem pelo menos um revisor estagiario, se nao, add
        // qualquer caso
        // --> verificar se tem pelo menos um revisor servidor
    });
    // return incluirRevisores(commitSemRevisor, tabelaProporcoesDeCadaRevisor, revisoresIndicados).then(() => {
    //
    //     let revisorIndicado = revisorIndicadoEmail.asString;
    //     const revisoresAtribuidos = [];
    //
    //     const revisorIndicadoEhEstagiario = revisorIndicado && isEstagiario(revisorIndicado);
    //     const revisorIndicadoEhServidor = revisorIndicado && isServidor(revisorIndicado);
    //
    //     const promises = [];
    //     const ehCommitDeEstagiario = isEstagiario(commitSemRevisor.author_email);
    //     if (ehCommitDeEstagiario) {
    //         if (revisorIndicadoEhEstagiario) {
    //             revisoresAtribuidos.push(revisorIndicado);
    //             promises.push(historicoRevisorIndicado(commitSemRevisor, revisorIndicado));
    //         } else {
    //             const revisorCalculado = calcularRevisorComBaseNaOcupacao(commitSemRevisor, tabelaProporcoesDeCadaRevisor, tabelaContagemRevisoesAtribuidas, isEstagiario);
    //             revisoresAtribuidos.push(revisorCalculado);
    //             promises.push(historicoRevisorCalculado(commitSemRevisor, revisorCalculado));
    //         }
    //     } else {
    //         // autor eh servidor, mas ele indicou um estagiario, mesmo assim
    //         if (revisorIndicadoEhEstagiario) {
    //             revisoresAtribuidos.push(revisorIndicado);
    //             promises.push(historicoRevisorIndicado(commitSemRevisor, revisorIndicado));
    //         }
    //     }
    //
    //     if (revisorIndicadoEhServidor) {
    //         revisoresAtribuidos.push(revisorIndicado);
    //         promises.push(historicoRevisorIndicado(commitSemRevisor, revisorIndicado));
    //     } else {
    //         const revisorCalculado = calcularRevisorComBaseNaOcupacao(commitSemRevisor, tabelaProporcoesDeCadaRevisor, tabelaContagemRevisoesAtribuidas, isServidor);
    //         revisoresAtribuidos.push(revisorCalculado);
    //         promises.push(historicoRevisorCalculado(commitSemRevisor, revisorCalculado));
    //     }
    //
    //     revisoresAtribuidos.forEach(revisorAtribuido => {
    //         tabelaContagemRevisoesAtribuidas[revisorAtribuido] = (tabelaContagemRevisoesAtribuidas[revisorAtribuido] || 0) + 1;
    //     });
    //     return Promise.all(promises).then(() => {
    //         commitSemRevisor.revisores = revisoresAtribuidos;
    //         return Promise.resolve();
    //     });
    //
    // });
}
function calcularRevisorComBaseNaOcupacao(commitSemRevisor, percentuaisDeRevisoes, revisores, funcaoTipoRevisor) {
    const emails = Object.keys(percentuaisDeRevisoes).filter(funcaoTipoRevisor)
        .filter(email => percentuaisDeRevisoes[email] > 0)
        .filter(email => email !== commitSemRevisor.author_email);
    const emailsMisturados = ArrayShuffle.arrayShuffle(emails);
    let emailComMenorPercentualOcupado = emailsMisturados[0];
    const percentuaisOcupados = {};
    percentuaisOcupados[emailComMenorPercentualOcupado] = -1;
    emailsMisturados.forEach(email => {
        if (!revisores[email]) {
            percentuaisOcupados[email] = 0;
        }
        else {
            percentuaisOcupados[email] = revisores[email] / percentuaisDeRevisoes[email];
        }
        if (percentuaisOcupados[email] <= percentuaisOcupados[emailComMenorPercentualOcupado]) {
            emailComMenorPercentualOcupado = email;
        }
    });
    return emailComMenorPercentualOcupado;
}
class TabelaProporcoesDeCadaRevisor {
    constructor(committers) {
        committers.forEach(committer => {
            this[committer.email] = committer.percentualDeRevisoes;
        });
    }
}
class TabelaContagemRevisoesAtribuidas {
    constructor(commits) {
        commits.forEach(commit => {
            commit.revisores.forEach(revisor => {
                this[revisor] = (this[revisor] || 0) + 1;
            });
        });
    }
}
function calcularParaCommits(commitsSemRevisores, tabelaProporcoesDeCadaRevisor, tabelaContagemRevisoesAtribuidas) {
    if (commitsSemRevisores.length === 0) {
        return Promise.resolve();
    }
    const commitSemRevisor = commitsSemRevisores.pop();
    return calcularRevisoresDoCommit(commitSemRevisor, tabelaProporcoesDeCadaRevisor, tabelaContagemRevisoesAtribuidas).then(() => {
        sesol2Repository.insert(commitSemRevisor);
        return calcularParaCommits(commitsSemRevisores, tabelaProporcoesDeCadaRevisor, tabelaContagemRevisoesAtribuidas);
    });
}
function atribuirRevisores() {
    return Committer.findAll().then(committers => {
        console.log(`#1 -- Atribuindo Revisores...`);
        const tabelaProporcoesDeCadaRevisor = new TabelaProporcoesDeCadaRevisor(committers);
        return Commit_1.Commit.findAll().then((commits) => {
            const tabelaContagemRevisoesAtribuidas = new TabelaContagemRevisoesAtribuidas(commits);
            const commitsSemRevisores = commits.filter(commit => commit.revisores.length === 0);
            console.log(`#2 -- Commits sem revisores encontrados...`);
            return calcularParaCommits(commitsSemRevisores, tabelaProporcoesDeCadaRevisor, tabelaContagemRevisoesAtribuidas).then(() => {
                console.log('Revisores atribuídos!');
            });
        });
    });
}
module.exports = atribuirRevisores;
