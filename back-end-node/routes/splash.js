const express = require('express');
const router = express.Router();

const addCors = require('./addCors');
//noinspection JSUnresolvedVariable
const TipoRevisaoCommit = require('../build/commit/Commit').TipoRevisaoCommit;
//noinspection JSUnresolvedVariable
const CommitRepository = require('../build/commit/CommitRepository').CommitRepository;
//noinspection JSUnresolvedVariable
const TrelloService = require('../build/trello/TrelloService').TrelloService;

let commitsPorDataLabels = '[]';
let commitsPorDataPendentes = '[]';
let commitsPorDataPar = '[]';
let commitsPorDataComFollowUp = '[]';
let commitsPorDataSemFollowUp = '[]';
let commitsPorDataSemRevisao = '[]';

let dataUltimoCommitComRevisaoPendente = undefined;

let trello = {
    maxWipEmAndamento: undefined,
    wipEmAndamento: -1,
    wipEmAndamentoIncidentes: -1,
    maxWipEmTestes: undefined,
    wipEmTestes: -1,
    wipEmTestesIncidentes: -1
};

function cardIncidente(card) {
    return card.name.toUpperCase().indexOf('INCIDENTE') !== -1;
}
function maxWip(list) {
    const wipEntreColchetes = list.name.match(/[\d+]/);
    if (wipEntreColchetes) {
        return +wipEntreColchetes[0]
    }
    return undefined;
}

function contarIncidentes(listEmAndamento) {
    const qtdIncidentes = listEmAndamento.cards.filter(cardIncidente).length;
    if (qtdIncidentes > 0) {
        return `(${qtdIncidentes} são incidentes)`
    }
    return '';
}

// funcao duplicada em front/srv/servicos/CommitterService.js
function contarRevisoresPendentes(commit) {
    let revisoresPendentes = commit.revisores.length;
    commit.revisoes.forEach(revisao => {
        if (commit.revisores.indexOf(revisao.revisor) !== -1) {
            revisoresPendentes--;
        }
    });
    return revisoresPendentes;
}
function contarTipoRevisao(commit, tipoRevisao) {
    return commit.revisoes.filter(revisao => revisao.tipoRevisao === tipoRevisao).length;
}

const RETICENCIAS = '●●●';
const VALOR_ZERO = {meta: ``, value: 0};

function load() {
    CommitRepository.findAllCommits().then(commits => {
        let commitsPedentesPorData = {};
        dataUltimoCommitComRevisaoPendente = undefined;
        commits.forEach(commit => {
            const dataCommit = commit.created_at.slice(0, 10);
            commitsPedentesPorData[dataCommit] = commitsPedentesPorData[dataCommit] || {pendente:0, par:0, comfollowup:0, semfollowup:0, semrevisao:0};
            commitsPedentesPorData[dataCommit].pendente += contarRevisoresPendentes(commit);
            commitsPedentesPorData[dataCommit].par += contarTipoRevisao(commit, TipoRevisaoCommit.PAR);
            commitsPedentesPorData[dataCommit].comfollowup += contarTipoRevisao(commit, TipoRevisaoCommit.COM_FOLLOW_UP);
            commitsPedentesPorData[dataCommit].semfollowup += contarTipoRevisao(commit, TipoRevisaoCommit.SEM_FOLLOW_UP);
            commitsPedentesPorData[dataCommit].semrevisao += contarTipoRevisao(commit, TipoRevisaoCommit.SEM_REVISAO)/2; // commits sem revisao inserem duas entradas

            if (commitsPedentesPorData[dataCommit].pendente) {
                if (!dataUltimoCommitComRevisaoPendente || dataCommit < dataUltimoCommitComRevisaoPendente) {
                    dataUltimoCommitComRevisaoPendente = dataCommit;
                }
            }
        });

        commitsPorDataLabels = [];
        commitsPorDataPendentes = [];
        commitsPorDataPar = [];
        commitsPorDataComFollowUp = [];
        commitsPorDataSemFollowUp = [];
        commitsPorDataSemRevisao = [];
        const datasQueSeraoExibidas = Object.keys(commitsPedentesPorData).sort().slice(-10);
        if (datasQueSeraoExibidas.indexOf(dataUltimoCommitComRevisaoPendente) === -1) {
            datasQueSeraoExibidas[0] = dataUltimoCommitComRevisaoPendente;
            datasQueSeraoExibidas[1] = RETICENCIAS;
        }
        datasQueSeraoExibidas.forEach(data => {
            if (data === RETICENCIAS) {
                commitsPorDataLabels.push(data);
                commitsPorDataPendentes.push(VALOR_ZERO);
                commitsPorDataPar.push(VALOR_ZERO);
                commitsPorDataComFollowUp.push(VALOR_ZERO);
                commitsPorDataSemFollowUp.push(VALOR_ZERO);
                commitsPorDataSemRevisao.push(VALOR_ZERO);
                return;
            }
            let total = commitsPedentesPorData[data].pendente +
                commitsPedentesPorData[data].par +
                commitsPedentesPorData[data].comfollowup +
                commitsPedentesPorData[data].semfollowup +
                commitsPedentesPorData[data].semrevisao;

            const percent = (valor) => `(${((valor/total) * 100).toFixed(0)}%)`;

            commitsPorDataLabels.push(data);
            commitsPorDataPendentes.push({meta: `Revisões Pendentes ${percent(commitsPedentesPorData[data].pendente)}`, value: commitsPedentesPorData[data].pendente});
            commitsPorDataPar.push({meta: `Commits feitos em Par ${percent(commitsPedentesPorData[data].par)}`, value: commitsPedentesPorData[data].par});
            commitsPorDataComFollowUp.push({meta: `Revisões com Follow-Up ${percent(commitsPedentesPorData[data].comfollowup)}`, value: commitsPedentesPorData[data].comfollowup});
            commitsPorDataSemFollowUp.push({meta: `Revisões sem Follow-Up ${percent(commitsPedentesPorData[data].semfollowup)}`, value: commitsPedentesPorData[data].semfollowup});
            commitsPorDataSemRevisao.push({meta: `Commits sem revisão ${percent(commitsPedentesPorData[data].semrevisao)}`, value: commitsPedentesPorData[data].semrevisao});
        });
        commitsPorDataLabels = JSON.stringify(commitsPorDataLabels);
        commitsPorDataPendentes = JSON.stringify(commitsPorDataPendentes);
        commitsPorDataPar = JSON.stringify(commitsPorDataPar);
        commitsPorDataComFollowUp = JSON.stringify(commitsPorDataComFollowUp);
        commitsPorDataSemFollowUp = JSON.stringify(commitsPorDataSemFollowUp);
        commitsPorDataSemRevisao = JSON.stringify(commitsPorDataSemRevisao);
    });
    TrelloService.getListEmAndamento().then(listEmAndamento => {
        trello.maxWipEmAndamento = maxWip(listEmAndamento);
        trello.wipEmAndamento = listEmAndamento.cards.length;
        trello.wipEmAndamentoIncidentes = contarIncidentes(listEmAndamento);
    });
    TrelloService.getListEmTestes().then(listEmTestes => {
        trello.maxWipEmTestes = maxWip(listEmTestes);
        trello.wipEmTestes = listEmTestes.cards.length;
        trello.wipEmTestesIncidentes = contarIncidentes(listEmTestes);
    });
}

router.get('/', function(req, res) {
    addCors(req, res);

    const trelloTotalWip = trello.wipEmAndamento + trello.wipEmTestes;
    const trelloMaxWip = trello.maxWipEmAndamento + trello.maxWipEmTestes;
    res.render('splash', {
        dataUltimoCommitComRevisaoPendente: dataUltimoCommitComRevisaoPendente,
        commitsPorDataLabels: commitsPorDataLabels,
        commitsPorDataPendentes: commitsPorDataPendentes,
        commitsPorDataPar: commitsPorDataPar,
        commitsPorDataComFollowUp: commitsPorDataComFollowUp,
        commitsPorDataSemFollowUp: commitsPorDataSemFollowUp,
        commitsPorDataSemRevisao: commitsPorDataSemRevisao,
        trello: trello,
        trelloTotalWip: trelloTotalWip,
        trelloMaxWip: trelloMaxWip,
        trelloWipColor: trelloTotalWip > trelloMaxWip ? 'red' : 'navy',
    });
});

load(); // carrega primeira vez
setInterval(load, 3 * 60 * 1000); // agenda uma carga a cada 3 minutos

module.exports = router;