import store from '../store';
import committers from '../committers';
import backEnd from '../servicos/backEnd';

export class CommitterEntity {

    constructor(committer) {
        Object.assign(this, committer);
    }

    vazioOuA() {
        return !this.sexo ? "(a)" : this.sexo === "m" ? "" : "a";
    }
    oOuA() {
        return !this.sexo ? "o(a)" : this.sexo === "m" ? "o" : "a";
    }
    mencao() {
        return `@${this.username} [\`${this.name}\`]`;
    }

}

export class CommitterService {

    static gitlabTodosDoUsuarioLogado() {
        return new Promise((resolve, reject) => {
            window.$.ajax({
                dataType: 'json',
                url: `${window.env.GITLAB_PROTOCOL_HOST}/api/v4/todos`,
                headers: {
                    'PRIVATE-TOKEN': committers.commiterLogado.impersonationToken
                },
                success: todos => {
                    resolve(todos.length);
                },
                error: (err) => {
                    reject(err);
                }
            });
        });
    }

}

export class CommitService {

    static usuarioLogadoEstaNaListaDeRevisoresDoCommit(commit) {
        return commit.revisores.indexOf(committers.commiterLogado.email) !== -1;
    }

    static usuarioLogadoNuncaRevisouCommit(commit) {
        return commit.revisoes.filter(revisao => revisao.revisor === committers.commiterLogado.email).length === 0;
    }

    static commitFoiRevisado(commit) {
        let revisoresPendentes = commit.revisores.length;
        commit.revisoes.forEach(revisao => {
            if (commit.revisores.indexOf(revisao.revisor) !== -1) {
                revisoresPendentes--;
            }
        });
        return revisoresPendentes <= 0;
    }

    static marcarComoRevisado(commit, tipoRevisao, assimQueMarcarRevisado) {
        commit.revisoes.push({
            revisor: committers.commiterLogado.email,
            sexoRevisor: committers.commiterLogado.sexo,
            data: new Date().toISOString(),
            tipoRevisao: tipoRevisao
        });
        return store.atualizar(commit).then(() => {
            backEnd.marcarRevisado(commit.sha, committers.commiterLogado, tipoRevisao).then(assimQueMarcarRevisado || (()=>{}));
        });
    }

}
