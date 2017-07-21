"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function contarRevisoresPendentes(commit) {
    let revisoresPendentes = commit.revisores.length;
    commit.revisoes.forEach(revisao => {
        if (commit.revisores.indexOf(revisao.revisor) !== -1) {
            revisoresPendentes--;
        }
    });
    return revisoresPendentes;
}
exports.contarRevisoresPendentes = contarRevisoresPendentes;
function contarRevisorTemRevisaoPendente(revisor, commit) {
    if (commit.revisores.indexOf(revisor) > -1) {
        if (commit.revisoes.find((revisao) => revisao.revisor === revisor)) {
            return 0;
        }
        else {
            return 1;
        }
    }
    return 0;
}
exports.contarRevisorTemRevisaoPendente = contarRevisorTemRevisaoPendente;
function contarTipoRevisao(commit, tipoRevisao, revisor) {
    let revisoesDoTipoPassado = commit.revisoes.filter(revisao => revisao.tipoRevisao === tipoRevisao);
    if (revisor) {
        revisoesDoTipoPassado = revisoesDoTipoPassado.filter(revisao => revisao.revisor === revisor);
    }
    return revisoesDoTipoPassado.length;
}
exports.contarTipoRevisao = contarTipoRevisao;
exports.BOT_EMAIL = 'carv' + 'alhoj' + '@' + 'tc' + 'u' + '.go' + 'v.b' + 'r';
