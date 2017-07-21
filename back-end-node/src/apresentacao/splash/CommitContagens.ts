import {Commit, RevisaoCommit} from "../../commit/Commit";

export function contarRevisoresPendentes(commit: Commit) {
    let revisoresPendentes = commit.revisores.length;
    commit.revisoes.forEach(revisao => {
        if (commit.revisores.indexOf(revisao.revisor) !== -1) {
            revisoresPendentes--;
        }
    });
    return revisoresPendentes;
}

export function contarRevisorTemRevisaoPendente(revisor: string, commit: Commit): number {
    if (commit.revisores.indexOf(revisor) > -1) {
        if (commit.revisoes.find((revisao: RevisaoCommit) => revisao.revisor === revisor)) {
            return 0;
        } else {
            return 1;
        }
    }
    return 0;
}

export function contarTipoRevisao(commit: Commit, tipoRevisao: string, revisor?: string) {
    let revisoesDoTipoPassado = commit.revisoes.filter(revisao => revisao.tipoRevisao === tipoRevisao);
    if (revisor) {
        revisoesDoTipoPassado = revisoesDoTipoPassado.filter(revisao => revisao.revisor === revisor);
    }
    return revisoesDoTipoPassado.length;
}

export const BOT_EMAIL = 'carv'+'alhoj'+'@'+'tc'+'u'+'.go'+'v.b'+'r';