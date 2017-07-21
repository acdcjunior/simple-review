"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CommitRepository_1 = require("../../commit/CommitRepository");
const Commit_1 = require("../../commit/Commit");
const CommitContagens_1 = require("./CommitContagens");
class CommitsPorUsuario {
    constructor() {
        this.legenda = 'Sem commits por usuario para exibir';
        this.labels = '[]';
        this.pendentes = '[]';
        this.par = '[]';
        this.comFollowUp = '[]';
        this.semFollowUp = '[]';
        this.semRevisao = '[]';
    }
    calcularCommitsPorUsuarioSempre() {
        CommitRepository_1.CommitRepository.findAllCommits().then((commits) => {
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
                    commitsPendentesPorUsuario[revisor].pendente += CommitContagens_1.contarRevisorTemRevisaoPendente(revisor, commit);
                    commitsPendentesPorUsuario[revisor].par += CommitContagens_1.contarTipoRevisao(commit, Commit_1.TipoRevisaoCommit.PAR, revisor);
                    commitsPendentesPorUsuario[revisor].comfollowup += CommitContagens_1.contarTipoRevisao(commit, Commit_1.TipoRevisaoCommit.COM_FOLLOW_UP, revisor);
                    commitsPendentesPorUsuario[revisor].semfollowup += CommitContagens_1.contarTipoRevisao(commit, Commit_1.TipoRevisaoCommit.SEM_FOLLOW_UP, revisor);
                    commitsPendentesPorUsuario[revisor].semrevisao += CommitContagens_1.contarTipoRevisao(commit, Commit_1.TipoRevisaoCommit.SEM_REVISAO, revisor);
                });
            });
            const commitsPorUsuarioSempreLabels = [];
            const commitsPorUsuarioSemprePendentes = [];
            const commitsPorUsuarioSemprePar = [];
            const commitsPorUsuarioSempreComFollowUp = [];
            const commitsPorUsuarioSempreSemFollowUp = [];
            const commitsPorUsuarioSempreSemRevisao = [];
            const usuariosQueSeraoExibidos = Object.keys(commitsPendentesPorUsuario).filter(item => item !== CommitContagens_1.BOT_EMAIL).sort();
            this.legenda = 'Tipos de revisões por revisor';
            usuariosQueSeraoExibidos.forEach(revisor => {
                const commitsDoRevisor = commitsPendentesPorUsuario[revisor];
                const total = commitsDoRevisor.pendente + commitsDoRevisor.par + commitsDoRevisor.comfollowup + commitsDoRevisor.semfollowup + commitsDoRevisor.semrevisao;
                const percent = (valor) => `(${((valor / total) * 100).toFixed(0)}%)`;
                commitsPorUsuarioSempreLabels.push(revisor);
                commitsPorUsuarioSemprePendentes.push({ value: commitsDoRevisor.pendente, meta: `Revisões Pendentes ${percent(commitsDoRevisor.pendente)}` });
                commitsPorUsuarioSemprePar.push({ value: commitsDoRevisor.par, meta: `Commits feitos em Par ${percent(commitsDoRevisor.par)}` });
                commitsPorUsuarioSempreComFollowUp.push({ value: commitsDoRevisor.comfollowup, meta: `Revisões com Follow-Up ${percent(commitsDoRevisor.comfollowup)}` });
                commitsPorUsuarioSempreSemFollowUp.push({ value: commitsDoRevisor.semfollowup, meta: `Revisões sem Follow-Up ${percent(commitsDoRevisor.semfollowup)}` });
                commitsPorUsuarioSempreSemRevisao.push({ value: commitsDoRevisor.semrevisao, meta: `Commits sem necessidade de revisão ${percent(commitsDoRevisor.semrevisao)}` });
            });
            this.labels = JSON.stringify(commitsPorUsuarioSempreLabels);
            this.pendentes = JSON.stringify(commitsPorUsuarioSemprePendentes);
            this.par = JSON.stringify(commitsPorUsuarioSemprePar);
            this.comFollowUp = JSON.stringify(commitsPorUsuarioSempreComFollowUp);
            this.semFollowUp = JSON.stringify(commitsPorUsuarioSempreSemFollowUp);
            this.semRevisao = JSON.stringify(commitsPorUsuarioSempreSemRevisao);
        });
    }
}
exports.CommitsPorUsuario = CommitsPorUsuario;
