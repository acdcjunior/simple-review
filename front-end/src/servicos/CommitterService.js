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
                    'PRIVATE-TOKEN': committers.committerLogado.impersonationToken
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

    static usuarioLogadoNuncaRevisouCommit(commit) {
        return commit.revisoes.filter(revisao => revisao.revisor === committers.committerLogado.email).length === 0;
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
            revisor: committers.committerLogado.email,
            sexoRevisor: committers.committerLogado.sexo,
            data: new Date().toISOString(),
            tipoRevisao: tipoRevisao
        });
        return store.atualizar(commit).then(() => {
            backEnd.marcarRevisado(commit.sha, committers.committerLogado, tipoRevisao).then(assimQueMarcarRevisado || (()=>{}));
        });
    }

    static marcarComoNaoSerahRevisado(commit, assimQueMarcarRevisado) {
        // apaga revisores e coloca somente o bot
        commit.revisores = [committers.botComentador.email];
        // coloca bot jah como um dos revisores, para nao aparecer que commit estah pendente
        commit.revisoes.push({
            revisor: committers.botComentador.email,
            sexoRevisor: committers.botComentador.sexo,
            data: new Date().toISOString(),
            tipoRevisao: CommitService.TIPO_REVISAO.SEM_REVISAO
        });
        // adiciona outra revisao com o usuario atual, pra ficar registrado quem marcou como naoSerahRevisado
        return CommitService.marcarComoRevisado(commit, CommitService.TIPO_REVISAO.SEM_REVISAO, assimQueMarcarRevisado);
    }

    static commitJahMarcadoComoNaoSerahRevisado(commit) {
        return commit.revisores.length === 1 && commit.revisores[0] === committers.botComentador.email;
    }

}

CommitService.TIPO_REVISAO = {
    SEM_FOLLOW_UP: "sem follow-up",
    COM_FOLLOW_UP: "com follow-up",
    SEM_REVISAO: "sem revisão",
    PAR: "par"
};

CommitService.TIPO_REVISAO_DADOS = {};
CommitService.TIPO_REVISAO_DADOS[CommitService.TIPO_REVISAO.SEM_FOLLOW_UP] = {
    tipoRevisaoClass: 'text-primary',
    tipoRevisaoTexto: `Revisado (sem <em>follow-up</em>)`
};
CommitService.TIPO_REVISAO_DADOS[CommitService.TIPO_REVISAO.COM_FOLLOW_UP] = {
    tipoRevisaoClass: 'text-info', /* notar que o css de texto eh diferente do css de button (trocado!!!) */
    tipoRevisaoTexto: `Revisado (com <em>follow-up</em>)`
};
CommitService.TIPO_REVISAO_DADOS[CommitService.TIPO_REVISAO.SEM_REVISAO] = {
    tipoRevisaoClass: 'text-muted',
    tipoRevisaoTexto: `Marcado como sem revisão`
};
CommitService.TIPO_REVISAO_DADOS[CommitService.TIPO_REVISAO.PAR] = {
    tipoRevisaoClass: 'text-success',
    tipoRevisaoTexto: `Marcado feito em par`
};
