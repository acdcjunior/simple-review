const Committer = require("../domain/Committer");
const Commit = require("../domain/Commit");
const sesol2Repository = require('../domain/Sesol2Repository');
const ArrayShuffle = require('../util/arrayShuffle');
const Revisor = require('../Revisor');

const listaRevisores = require('./revisores');

function isEstagiario(authorEmail) {
    return /[xX]\d{11}@tcu.gov.br$/.test(authorEmail);
}

function isServidor(authorEmail) {
    return !isEstagiario(authorEmail);
}

function historicoRevisorIndicado(commitSemRevisor, revisorIndicado) {
    commitSemRevisor.historico.push(Revisor.revisorIndicado(commitSemRevisor.sha, revisorIndicado));
}

function historicoRevisorCalculado(commitSemRevisor, revisorCalculado) {
    commitSemRevisor.historico.push(Revisor.revisorCalculado(commitSemRevisor.sha, revisorCalculado));
}

function calcularRevisor(commitSemRevisor, percentuaisDeRevisoes, revisores) {
    const revisoresAtribuidos = [];

    const revisorIndicado = commitFoiIndicadoParaAlgumRevisor(percentuaisDeRevisoes, commitSemRevisor);
    const revisorOrientadoEhEstagiario = revisorIndicado && isEstagiario(revisorIndicado);
    const revisorOrientadoEhServidor = revisorIndicado && isServidor(revisorIndicado);

    if (isEstagiario(commitSemRevisor.author_email)) {
        if (revisorOrientadoEhEstagiario) {
            revisoresAtribuidos.push(revisorIndicado);
            historicoRevisorIndicado(commitSemRevisor, revisorIndicado);
        } else {
            const revisorCalculado = calcularRevisorComBaseNaOcupacao(commitSemRevisor, percentuaisDeRevisoes, revisores, isEstagiario);
            revisoresAtribuidos.push(revisorCalculado);
            historicoRevisorCalculado(commitSemRevisor, revisorCalculado);
        }
    } else {
        // autor eh servidor, mas ele indicou um estagiario, mesmo assim
        if (revisorOrientadoEhEstagiario) {
            revisoresAtribuidos.push(revisorIndicado);
            historicoRevisorIndicado(commitSemRevisor, revisorIndicado);
        }
    }

    if (revisorOrientadoEhServidor) {
        revisoresAtribuidos.push(revisorIndicado);
        historicoRevisorIndicado(commitSemRevisor, revisorIndicado);
    } else {
        const revisorCalculado = calcularRevisorComBaseNaOcupacao(commitSemRevisor, percentuaisDeRevisoes, revisores, isServidor);
        revisoresAtribuidos.push(revisorCalculado);
        historicoRevisorCalculado(commitSemRevisor, revisorCalculado);
    }

    revisoresAtribuidos.forEach(revisorAtribuido => {
        revisores[revisorAtribuido] = (revisores[revisorAtribuido] || 0) + 1;
    });
    return revisoresAtribuidos;
}

function commitFoiIndicadoParaAlgumRevisor(revisores, commitSemRevisor) {
    const message = commitSemRevisor.message;
    const nomeRevisor = message.replace(/(\s+|:)/g, ' ').match(/revisor ([\w.]+)/);
    if (nomeRevisor !== null) {
        const emailCanonicoRevisor = listaRevisores.emailCanonicoRevisor(nomeRevisor[1]);

        if (revisores[emailCanonicoRevisor] !== undefined) {
            if (commitSemRevisor.author_email === emailCanonicoRevisor) {
                commitSemRevisor.historico.push(`Revisão indicada não executada, pois o revisor indicado é o autor do commit.`);
            } else {
                return emailCanonicoRevisor;
            }
        } else {
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
        if (!revisores[email]) { // usuario nao eh revisor de nada
            percentuaisOcupados[email] = 0;
        } else {
            percentuaisOcupados[email] = revisores[email] / percentuaisDeRevisoes[email];
        }
        if (percentuaisOcupados[email] <= percentuaisOcupados[emailComMenorPercentualOcupado]) {
            emailComMenorPercentualOcupado = email;
        }
    });

    return emailComMenorPercentualOcupado;
}

function atribuirRevisores() {
    return Committer.findAll().then(committers => {
        console.log(`Atribuindo Revisores...`);
        const percentuaisDeRevisoes = {};
        committers.forEach(committer => {
            percentuaisDeRevisoes[committer.email] = committer.percentualDeRevisoes;
        });

        Commit.findAll().then(commits => {
            const revisores = {};
            commits.forEach(commit => {
                commit.revisores.forEach(revisor => {
                    revisores[revisor] = (revisores[revisor] || 0) + 1;
                })
            });

            const commitsSemRevisores = commits.filter(commit => commit.revisores.length === 0);

            commitsSemRevisores.forEach(commitSemRevisor => {
                commitSemRevisor.revisores = calcularRevisor(commitSemRevisor, percentuaisDeRevisoes, revisores);
                sesol2Repository.insert(commitSemRevisor);
            });

            console.log('Revisores atribuídos!');
        })
    });
}

module.exports = atribuirRevisores;