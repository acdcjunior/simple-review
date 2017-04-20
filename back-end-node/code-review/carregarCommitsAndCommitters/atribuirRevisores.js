"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Committer = require("../domain/Committer");
const Commit = require("../domain/Commit");
const sesol2Repository = require("../domain/Sesol2Repository");
const ArrayShuffle = require("../util/arrayShuffle");
const Revisor_1 = require("../Revisor");
const revisores_1 = require("./revisores");
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
function calcularRevisoresDoCommit(commitSemRevisor, percentuaisDeRevisoes, revisores) {
    const revisoresAtribuidos = [];
    const revisorIndicado = commitFoiIndicadoParaAlgumRevisor(percentuaisDeRevisoes, commitSemRevisor);
    const revisorOrientadoEhEstagiario = revisorIndicado && isEstagiario(revisorIndicado);
    const revisorOrientadoEhServidor = revisorIndicado && isServidor(revisorIndicado);
    const promises = [];
    if (isEstagiario(commitSemRevisor.author_email)) {
        if (revisorOrientadoEhEstagiario) {
            revisoresAtribuidos.push(revisorIndicado);
            promises.push(historicoRevisorIndicado(commitSemRevisor, revisorIndicado));
        }
        else {
            const revisorCalculado = calcularRevisorComBaseNaOcupacao(commitSemRevisor, percentuaisDeRevisoes, revisores, isEstagiario);
            revisoresAtribuidos.push(revisorCalculado);
            promises.push(historicoRevisorCalculado(commitSemRevisor, revisorCalculado));
        }
    }
    else {
        // autor eh servidor, mas ele indicou um estagiario, mesmo assim
        if (revisorOrientadoEhEstagiario) {
            revisoresAtribuidos.push(revisorIndicado);
            promises.push(historicoRevisorIndicado(commitSemRevisor, revisorIndicado));
        }
    }
    if (revisorOrientadoEhServidor) {
        revisoresAtribuidos.push(revisorIndicado);
        promises.push(historicoRevisorIndicado(commitSemRevisor, revisorIndicado));
    }
    else {
        const revisorCalculado = calcularRevisorComBaseNaOcupacao(commitSemRevisor, percentuaisDeRevisoes, revisores, isServidor);
        revisoresAtribuidos.push(revisorCalculado);
        promises.push(historicoRevisorCalculado(commitSemRevisor, revisorCalculado));
    }
    revisoresAtribuidos.forEach(revisorAtribuido => {
        revisores[revisorAtribuido] = (revisores[revisorAtribuido] || 0) + 1;
    });
    return Promise.all(promises).then(() => {
        return Promise.resolve(revisoresAtribuidos);
    });
}
function commitFoiIndicadoParaAlgumRevisor(revisores, commitSemRevisor) {
    const message = commitSemRevisor.message;
    const mencoes = message.match(/@[a-zA-Z.0-9]+/g);
    if (mencoes !== null) {
        const emailCanonicoRevisor = revisores_1.Revisores.emailCanonicoRevisor(mencoes[1]);
        if (revisores[emailCanonicoRevisor] !== undefined) {
            if (commitSemRevisor.author_email === emailCanonicoRevisor) {
                commitSemRevisor.historico.push(`Revisão indicada não executada, pois o revisor indicado é o autor do commit.`);
            }
            else {
                return emailCanonicoRevisor;
            }
        }
        else {
            commitSemRevisor.historico.push(`Revisão atribuída a revisor desconhecido: ${emailCanonicoRevisor}. Ignorada.`);
        }
    }
    return false;
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
function hashPercentuaisDeRevisoes(committers) {
    const percentuaisDeRevisoes = {};
    committers.forEach(committer => {
        percentuaisDeRevisoes[committer.email] = committer.percentualDeRevisoes;
    });
    return percentuaisDeRevisoes;
}
function hashContagemRevisoes(commits) {
    const revisores = {};
    commits.forEach(commit => {
        commit.revisores.forEach(revisor => {
            revisores[revisor] = (revisores[revisor] || 0) + 1;
        });
    });
    return revisores;
}
function calcularParaCommits(commitsSemRevisores, percentuaisDeRevisoes, revisores) {
    if (commitsSemRevisores.length === 0) {
        return Promise.resolve();
    }
    const commitSemRevisor = commitsSemRevisores.pop();
    return calcularRevisoresDoCommit(commitSemRevisor, percentuaisDeRevisoes, revisores).then(revisoresAtribuidos => {
        commitSemRevisor.revisores = revisoresAtribuidos;
        sesol2Repository.insert(commitSemRevisor);
        return calcularParaCommits(commitsSemRevisores, percentuaisDeRevisoes, revisores);
    });
}
function atribuirRevisores() {
    return Committer.findAll().then(committers => {
        console.log(`Atribuindo Revisores...`);
        const percentuaisDeRevisoes = hashPercentuaisDeRevisoes(committers);
        return Commit.findAll().then(commits => {
            const revisores = hashContagemRevisoes(commits);
            const commitsSemRevisores = commits.filter(commit => commit.revisores.length === 0);
            return calcularParaCommits(commitsSemRevisores, percentuaisDeRevisoes, revisores).then(() => {
                console.log('Revisores atribuídos!');
            });
        });
    });
}
module.exports = atribuirRevisores;
