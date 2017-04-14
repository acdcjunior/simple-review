<template>
  <div class="col-md-12">
    <p></p>
    <p><button class="btn btn-default" v-on:click="retornarParaCommits"><span class="glyphicon glyphicon-circle-arrow-left"></span> Retornar para commits</button></p>

  <div class="row" v-if="!commit">
    <div class="col-md-12">
      <img src="../assets/loading.gif" alt="">
    </div>
  </div>
  <div class="row" v-if="commit">
    <div class="col-md-12">
      <div class="panel panel-default">
        <div class="panel-body">
          <h2>{{ commit.title }}</h2>
          <pre style="white-space: pre-wrap;">{{ commit.message }}</pre>
        </div>
      </div>
    </div>
    <div class="col-md-12">
      <p>
        Commit realizado <strong style="color: black">{{ timeAgoCommittado() }}</strong>.
      </p>
      <p>
        <strong style="color: black">Autor(a):</strong>
        <committer v-if="commit.author_email" :committer-email="commit.author_email"></committer>
      </p>
      <br>
      <p>
        <strong style="color: black">Revisor(a) designado(a):</strong>
        <committer v-if="commit.revisores[0]" :committer-email="commit.revisores[0]"></committer>
      </p>
      <p v-if="commit.revisores.length === 2">
        <strong style="color: black">Segundo(a) revisor(a)  designado(a):</strong>
        <committer v-if="commit.revisores[1]" :committer-email="commit.revisores[1]"></committer>
      </p>

      <div v-show="!exibirLoadingRevisaoAlterada">
        <br>
        <hr>
        <h4>Revisões concluídas: {{ commitRevisado() ? 'Sim' : 'Não' }}</h4>
        <div v-for="revisao in commit.revisoes">
          <br>
          <strong style="margin-left: 1px" :class="tipoRevisaoClass(revisao)">Revisor(a) - {{ revisao.tipo === 'par' ? 'feito em par' : 'revisão comum' }}:</strong>
          <committer v-if="revisao.revisor" :committer-email="revisao.revisor"></committer>
          <br>
          Revisado <span :class="tipoRevisaoClass(revisao)">{{ timeAgoRevisado(revisao) }}</span>.
        </div>
      </div>
      <div class="col-md-12" v-if="exibirLoadingRevisaoAlterada">
        <img src="../assets/loading.gif" alt="">
      </div>

      <hr>
    </div>
    <div class="col-md-12" v-if="usuarioLogadoPodeRevisarEsteCommit()">
      <p><button class="btn btn-primary" v-on:click="marcarComoRevisado()"><span class="glyphicon glyphicon-ok"></span> Marcar como Revisado</button></p>
      <button class="btn btn-success" v-on:click="marcarComoFeitoEmPar()"><span class="glyphicon glyphicon-user"></span> Fizemos em Par</button>
    </div>

    <div class="col-md-12">
      <br>
      <br>
      Histórico:
      <ul>
        <li v-for="historico in commit.historico">{{ historico }}</li>
        <li v-for="revisao in commit.revisoes">Revisado por {{ revisao.revisor }} {{ timeAgo(revisao.data) }}, com revisão do tipo {{ revisao.tipo }}.</li>
      </ul>
    </div>

    <div class="col-md-12"><br>&nbsp;<br>&nbsp;<br></div>
  </div>
  </div>
</template>

<script>
import store from '../store'
import utils from '../utils'
import committers from '../committers'
import Committer from './Committer'
import backEnd from '../servicos/backEnd'

export default {
  components: {
    Committer
  },

  data () {
    return {
      _id: '',
      commit: '',
      type: '',
      createdAt: '',
      commitId: '',
      revisaoAlterada: false,
      exibirLoadingRevisaoAlterada: false
    }
  },

  created () {
    committers.testLogin(this)
  },

  route: {
    data ({ to }) {
      let sha = to.params.id
      utils.atualizarDiff(sha)
      store.registerListener('view', () => {
        this.loadCommit(sha)
      })
      return this.loadCommit(sha)
    }
  },

  methods: {
    timeAgo (data) {
        return utils.timeago(data);
    },
    timeAgoCommittado () {
      return utils.timeago(this.commit.created_at)
    },
    timeAgoRevisado (revisao) {
      return utils.timeago(revisao.data)
    },
    tipoRevisaoClass (revisao) {
      return (revisao.tipo || '').indexOf('par') === -1 ? 'text-primary' : 'text-success'
    },
    loadCommit (commitId) {
      return store.findById(commitId).then(commit => {
          this.commit = commit;
      });
    },
    commitRevisado () {
        let revisoresPendentes = this.commit.revisores.length;
        this.commit.revisoes.forEach(revisao => {
            if (this.commit.revisores.indexOf(revisao.revisor) !== -1) {
                revisoresPendentes--;
            }
        });
        return revisoresPendentes <= 0;
    },
    usuarioLogadoPodeRevisarEsteCommit () {
        return this.commit.author_email !== committers.commiterLogado.email &&
               !this.commitRevisado() &&
               this.usuarioLogadoNuncaRevisouEsteCommit();
    },
    usuarioLogadoNuncaRevisouEsteCommit () {
        return this.commit.revisoes.filter(revisao => revisao.revisor === committers.commiterLogado.email).length === 0;
    },
    marcarComoFeitoEmPar () {
        this.marcarComoRevisado('par');
    },
    marcarComoRevisado (status) {
        this.revisaoAlterada = true;
        this.exibirLoadingRevisaoAlterada = true;
        setTimeout(() => { this.exibirLoadingRevisaoAlterada = false }, 1000);
        this.commit.revisoes.push({revisor: committers.commiterLogado.email, data: new Date().toISOString(), tipo: status || 'comum'});
        store.create(this.commit).then(() => {
            backEnd.marcarRevisado(this.commit.sha, committers.commiterLogado.email, status === 'par').then(() => {
                window.diff.notes.refresh();
            });
            this.loadCommit(this.commit._id)
        })
    },
    retornarParaCommits () {
        utils.limparDiff();
        this.commit = undefined;
        this.$router.go('/commits')
    }
  }
}
</script>
