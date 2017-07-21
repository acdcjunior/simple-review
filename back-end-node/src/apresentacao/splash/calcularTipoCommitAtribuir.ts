import {contarRevisoresPendentes, contarTipoRevisao} from "./CommitContagens";
import {TipoRevisaoCommit} from "../../commit/Commit";

export function calcularTipoCommitAtribuir(commitsPedentes, commit) {

    let pendentes = contarRevisoresPendentes(commit);
    if (pendentes > 0) {
        commitsPedentes.pendentes++;
        return;
    }
    let pars = contarTipoRevisao(commit, TipoRevisaoCommit.PAR);
    let comFollow = contarTipoRevisao(commit, TipoRevisaoCommit.COM_FOLLOW_UP);
    let semFollow = contarTipoRevisao(commit, TipoRevisaoCommit.SEM_FOLLOW_UP);
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
