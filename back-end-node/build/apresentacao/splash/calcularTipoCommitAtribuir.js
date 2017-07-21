"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CommitContagens_1 = require("./CommitContagens");
const Commit_1 = require("../../commit/Commit");
function calcularTipoCommitAtribuir(commitsPedentes, commit) {
    let pendentes = CommitContagens_1.contarRevisoresPendentes(commit);
    if (pendentes > 0) {
        commitsPedentes.pendentes++;
        return;
    }
    let pars = CommitContagens_1.contarTipoRevisao(commit, Commit_1.TipoRevisaoCommit.PAR);
    let comFollow = CommitContagens_1.contarTipoRevisao(commit, Commit_1.TipoRevisaoCommit.COM_FOLLOW_UP);
    let semFollow = CommitContagens_1.contarTipoRevisao(commit, Commit_1.TipoRevisaoCommit.SEM_FOLLOW_UP);
    if (pars > 0 && comFollow === 0) {
        commitsPedentes.par++;
        return;
    }
    if (comFollow) {
        commitsPedentes.comfollowup++;
        return;
    }
    if (semFollow) {
        commitsPedentes.semfollowup++;
        return;
    }
    commitsPedentes.semRevisao++;
}
exports.calcularTipoCommitAtribuir = calcularTipoCommitAtribuir;
