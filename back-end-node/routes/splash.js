const express = require('express');
const router = express.Router();

const addCors = require('./addCors');
//noinspection JSUnresolvedVariable
const TipoRevisaoCommit = require('../build/commit/Commit').TipoRevisaoCommit;
//noinspection JSUnresolvedVariable
const CommitRepository = require('../build/commit/CommitRepository').CommitRepository;
//noinspection JSUnresolvedVariable
const TrelloService = require('../build/trello/TrelloService').TrelloService;
//noinspection JSUnresolvedVariable
const JenkinsCache = require('../build/integracaocontinua/JenkinsService').JenkinsCache;

const trello = {
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

let commitsPorData = {
    labels: '[]',
    pendentes: '[]',
    par: '[]',
    comFollowUp: '[]',
    semFollowUp: '[]',
    semRevisao: '[]',
    legenda: 'Sem commits para exibir'
};
function calcularCommitsPorData() {
    CommitRepository.findAllCommits().then(commits => {
        const commitsPedentesPorData = {};
        let dataUltimoCommitComRevisaoPendente = undefined;
        commits.forEach(commit => {
            const dataCommit = commit.created_at.slice(0, 10);
            commitsPedentesPorData[dataCommit] = commitsPedentesPorData[dataCommit] || {
                    pendente: 0,
                    par: 0,
                    comfollowup: 0,
                    semfollowup: 0,
                    semrevisao: 0
                };
            commitsPedentesPorData[dataCommit].pendente += contarRevisoresPendentes(commit);
            commitsPedentesPorData[dataCommit].par += contarTipoRevisao(commit, TipoRevisaoCommit.PAR);
            commitsPedentesPorData[dataCommit].comfollowup += contarTipoRevisao(commit, TipoRevisaoCommit.COM_FOLLOW_UP);
            commitsPedentesPorData[dataCommit].semfollowup += contarTipoRevisao(commit, TipoRevisaoCommit.SEM_FOLLOW_UP);
            commitsPedentesPorData[dataCommit].semrevisao += contarTipoRevisao(commit, TipoRevisaoCommit.SEM_REVISAO) / 2; // commits sem revisao inserem duas entradas

            if (commitsPedentesPorData[dataCommit].pendente &&
                (!dataUltimoCommitComRevisaoPendente || dataCommit < dataUltimoCommitComRevisaoPendente)) {
                dataUltimoCommitComRevisaoPendente = dataCommit;
            }
        });

        const commitsPorDataLabels = [];
        const commitsPorDataPendentes = [];
        const commitsPorDataPar = [];
        const commitsPorDataComFollowUp = [];
        const commitsPorDataSemFollowUp = [];
        const commitsPorDataSemRevisao = [];

        const datasQueSeraoExibidas = Object.keys(commitsPedentesPorData).sort().slice(-10);
        if (datasQueSeraoExibidas.indexOf(dataUltimoCommitComRevisaoPendente) === -1) {
            datasQueSeraoExibidas[0] = dataUltimoCommitComRevisaoPendente;
            datasQueSeraoExibidas[1] = RETICENCIAS;
            commitsPorData.legenda = 'Tipos de revisões por dia -- dia mais distante sem revisão, mais últimos 8 dias';
        } else {
            commitsPorData.legenda = 'Tipos de revisões por dia -- últimos 10 dias';
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
            const total = commitsPedentesPorData[data].pendente +
                commitsPedentesPorData[data].par +
                commitsPedentesPorData[data].comfollowup +
                commitsPedentesPorData[data].semfollowup +
                commitsPedentesPorData[data].semrevisao;

            const percent = (valor) => `(${((valor / total) * 100).toFixed(0)}%)`;

            commitsPorDataLabels.push(data);
            commitsPorDataPendentes.push({
                meta: `Revisões Pendentes ${percent(commitsPedentesPorData[data].pendente)}`,
                value: commitsPedentesPorData[data].pendente
            });
            commitsPorDataPar.push({
                meta: `Commits feitos em Par ${percent(commitsPedentesPorData[data].par)}`,
                value: commitsPedentesPorData[data].par
            });
            commitsPorDataComFollowUp.push({
                meta: `Revisões com Follow-Up ${percent(commitsPedentesPorData[data].comfollowup)}`,
                value: commitsPedentesPorData[data].comfollowup
            });
            commitsPorDataSemFollowUp.push({
                meta: `Revisões sem Follow-Up ${percent(commitsPedentesPorData[data].semfollowup)}`,
                value: commitsPedentesPorData[data].semfollowup
            });
            commitsPorDataSemRevisao.push({
                meta: `Commits sem necessidade de revisão ${percent(commitsPedentesPorData[data].semrevisao)}`,
                value: commitsPedentesPorData[data].semrevisao
            });
        });
        commitsPorData = {
            labels: JSON.stringify(commitsPorDataLabels),
            pendentes: JSON.stringify(commitsPorDataPendentes),
            par: JSON.stringify(commitsPorDataPar),
            comFollowUp: JSON.stringify(commitsPorDataComFollowUp),
            semFollowUp: JSON.stringify(commitsPorDataSemFollowUp),
            semRevisao: JSON.stringify(commitsPorDataSemRevisao)
        };
    });
}

function load() {
    calcularCommitsPorData();
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

    let imagemJenkins = 'public/images/question-mark.png';
    if (JenkinsCache.sagas2JobData.color) {
        imagemJenkins = `http://jenkins/static/48484716/images/32x32/${JenkinsCache.sagas2JobData.color}.gif`;
    }

    const trelloTotalWip = trello.wipEmAndamento + trello.wipEmTestes;
    const trelloMaxWip = trello.maxWipEmAndamento + trello.maxWipEmTestes;

    res.render('splash', {
        grafico: {
            labels: commitsPorData.labels,
            series: {
                a: {cor: '#de615f', dados: commitsPorData.pendentes},
                b: {cor: '#337ab7', dados: commitsPorData.semFollowUp},
                c: {cor: '#31708f', dados: commitsPorData.comFollowUp},
                d: {cor: '#009803', dados: commitsPorData.par},
                e: {cor: '#777',    dados: commitsPorData.semRevisao},
            },
            legenda: commitsPorData.legenda
        },

        imagemJenkins: imagemJenkins,

        trello: trello,
        trelloTotalWip: trelloTotalWip,
        trelloMaxWip: trelloMaxWip,
        trelloWipColor: trelloTotalWip > trelloMaxWip ? '#D83737' : (trelloTotalWip === trelloMaxWip ? '#d7d200' : '#009803'),
    });
});

load(); // carrega primeira vez
setInterval(load, 3 * 60 * 1000); // agenda uma carga a cada 3 minutos

module.exports = router;
