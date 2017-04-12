const Committer = require("./domain/Committer");
const Commit = require("./domain/Commit");
const sesol2Repository = require('./domain/Sesol2Repository');

const aliases = {
    'alex@tcu.gov.br': 'alexandrevr@tcu.gov.br',
    'alexandre@tcu.gov.br': 'alexandrevr@tcu.gov.br',

    'antonio@tcu.gov.br': 'antonio.junior@tcu.gov.br',
    'carvalhoj@tcu.gov.br': 'antonio.junior@tcu.gov.br',

    'marcos@tcu.gov.br': 'marcosps@tcu.gov.br',
    'marcao@tcu.gov.br': 'marcosps@tcu.gov.br',

    'regis@tcu.gov.br': 'regiano@tcu.gov.br',

    'fernandes@tcu.gov.br': 'fernandesm@tcu.gov.br',
    'mauricio@tcu.gov.br': 'fernandesm@tcu.gov.br',
    'josemauricio@tcu.gov.br': 'fernandesm@tcu.gov.br',

    'lelia@tcu.gov.br': 'leliakn@tcu.gov.br',
    'leliakarina@tcu.gov.br': 'leliakn@tcu.gov.br',

    'carla@tcu.gov.br': 'carlanm@tcu.gov.br',

    'gabriel@tcu.gov.br': 'x04912831131@tcu.gov.br',
    'mesquita@tcu.gov.br': 'x04912831131@tcu.gov.br',

    'rebeca@tcu.gov.br': 'x05068385107@tcu.gov.br',
    'rebecca@tcu.gov.br': 'x05068385107@tcu.gov.br',

    'afonso@tcu.gov.br': 'x05491194182@tcu.gov.br',

    'bruno@tcu.gov.br': 'x05929991146@tcu.gov.br',
};

function isEstagiario(authorEmail) {
    return /[xX]\d{11}@tcu.gov.br$/.test(authorEmail);
}

function isServidor(authorEmail) {
    return !isEstagiario(authorEmail);
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

function historicoRevisorIndicado(commitSemRevisor, revisorIndicado) {
    commitSemRevisor.historico.push(`Revisor ${revisorIndicado} atribuído por indicação via mensagem de commit.`);
}
function historicoRevisorCalculado(commitSemRevisor, revisorCalculado) {
    commitSemRevisor.historico.push(`Revisor ${revisorCalculado} atribuído automaticamente pelo sistema.`);
}

function calcularRevisor(commitSemRevisor, percentuaisDeRevisoes, revisores) {
    let revisoresAtribuidos = [];

    const revisorIndicado = commitFoiIndicadoParaAlgumRevisor(percentuaisDeRevisoes, commitSemRevisor);
    let revisorOrientadoEhEstagiario = revisorIndicado && isEstagiario(revisorIndicado);
    let revisorOrientadoEhServidor = revisorIndicado && isServidor(revisorIndicado);

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
        const emailRevisorOuAlias = nomeRevisor[1] + '@tcu.gov.br';

        const emailCanonicoRevisor = aliases[emailRevisorOuAlias] || emailRevisorOuAlias;

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

    let emailsMisturados = shuffleArray(emails);

    let emailComMenorPercentualOcupado = emailsMisturados[0];

    let percentuaisOcupados = {};
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
        let percentuaisDeRevisoes = {};
        committers.forEach(committer => {
            percentuaisDeRevisoes[committer.email] = committer.percentualDeRevisoes;
        });

        Commit.findAll().then(commits => {
            let revisores = {};
            commits.forEach(commit => {
                commit.revisores.forEach(revisor => {
                    revisores[revisor] = (revisores[revisor] || 0) + 1;
                })
            });

            let commitsSemRevisores = commits.filter(commit => commit.revisores.length === 0);

            commitsSemRevisores.forEach(commitSemRevisor => {
                commitSemRevisor.revisores = calcularRevisor(commitSemRevisor, percentuaisDeRevisoes, revisores);
                sesol2Repository.insert(commitSemRevisor);
            });

            console.log('Revisores atribuídos!');
        })
    });
}

module.exports = atribuirRevisores;