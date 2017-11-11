import {CommitRepository} from "../../commit/CommitRepository";
import {Commit, TipoRevisaoCommit} from "../../commit/Commit";
import {BOT_EMAIL, contarRevisorTemRevisaoPendente, contarTipoRevisao} from "./CommitContagens";

export class CommitsPorUsuario {

    legenda: string = 'Sem commits por usuario para exibir';
    labels: string = '[]';
    pendentes: string = '[]';
    par: string = '[]';
    comFollowUp: string = '[]';
    semFollowUp: string = '[]';
    semRevisao: string = '[]';

    calcularCommitsPorUsuarioSempre() {
        CommitRepository.findAllCommits().then((commits: Commit[]) => {
            const commitsPendentesPorUsuario = {};

            commits.forEach(commit => {
                commit.revisores.forEach(revisor => {
                    commitsPendentesPorUsuario[revisor] = commitsPendentesPorUsuario[revisor] || {
                        pendente: 0,
                        par: 0,
                        comfollowup: 0,
                        semfollowup: 0,
                        semrevisao: 0
                    };
                    commitsPendentesPorUsuario[revisor].pendente += contarRevisorTemRevisaoPendente(revisor, commit);
                    commitsPendentesPorUsuario[revisor].par += contarTipoRevisao(commit, TipoRevisaoCommit.PAR, revisor);
                    commitsPendentesPorUsuario[revisor].comfollowup += contarTipoRevisao(commit, TipoRevisaoCommit.COM_FOLLOW_UP, revisor);
                    commitsPendentesPorUsuario[revisor].semfollowup += contarTipoRevisao(commit, TipoRevisaoCommit.SEM_FOLLOW_UP, revisor);
                    commitsPendentesPorUsuario[revisor].semrevisao += contarTipoRevisao(commit, TipoRevisaoCommit.SEM_REVISAO, revisor);
                });
            });

            const commitsPorUsuarioSempreLabels = [];
            const commitsPorUsuarioSemprePendentes = [];
            const commitsPorUsuarioSemprePar = [];
            const commitsPorUsuarioSempreComFollowUp = [];
            const commitsPorUsuarioSempreSemFollowUp = [];
            const commitsPorUsuarioSempreSemRevisao = [];

            const usuariosQueSeraoExibidos = Object.keys(commitsPendentesPorUsuario).filter(item => item !== BOT_EMAIL).sort();

            this.legenda = 'Tipos de revisões por revisor';

            usuariosQueSeraoExibidos.forEach(revisor => {
                const commitsDoRevisor = commitsPendentesPorUsuario[revisor];

                const total = commitsDoRevisor.pendente + commitsDoRevisor.par + commitsDoRevisor.comfollowup + commitsDoRevisor.semfollowup + commitsDoRevisor.semrevisao;
                const percent = (valor) => `(${((valor / total) * 100).toFixed(0)}%)`;

                commitsPorUsuarioSempreLabels.push(revisor);
                commitsPorUsuarioSemprePendentes.push(  {value: commitsDoRevisor.pendente,    meta: `Revisões Pendentes ${percent(commitsDoRevisor.pendente)}`});
                commitsPorUsuarioSemprePar.push(        {value: commitsDoRevisor.par,         meta: `Commits feitos em Par ${percent(commitsDoRevisor.par)}`});
                commitsPorUsuarioSempreComFollowUp.push({value: commitsDoRevisor.comfollowup, meta: `Revisões com Follow-Up ${percent(commitsDoRevisor.comfollowup)}`});
                commitsPorUsuarioSempreSemFollowUp.push({value: commitsDoRevisor.semfollowup, meta: `Revisões sem Follow-Up ${percent(commitsDoRevisor.semfollowup)}`});
                commitsPorUsuarioSempreSemRevisao.push( {value: commitsDoRevisor.semrevisao,  meta: `Commits sem necessidade de revisão ${percent(commitsDoRevisor.semrevisao)}`});
            });

            this.labels = JSON.stringify(commitsPorUsuarioSempreLabels);
            this.pendentes = JSON.stringify(commitsPorUsuarioSemprePendentes);
            this.par = JSON.stringify(commitsPorUsuarioSemprePar);
            this.comFollowUp = JSON.stringify(commitsPorUsuarioSempreComFollowUp);
            this.semFollowUp = JSON.stringify(commitsPorUsuarioSempreSemFollowUp);
            this.semRevisao = JSON.stringify(commitsPorUsuarioSempreSemRevisao);
        }).catch(e => console.error('Erro ao calcular commits por usuario', e));
    }


}