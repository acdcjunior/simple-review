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
          <pre style="white-space: pre-wrap; word-break: normal;">{{ commit.message }}</pre>
        </div>
      </div>
    </div>
    <div class="col-md-12">
      <p>
        Commit realizado <strong style="color: black">{{ timeAgoCommittado() }}</strong>.
      </p>
      <p>
        <strong style="color: black">Autor{{ committerEntity(commit.author_email).vazioOuA() }}:</strong>
        <committer v-if="commit.author_email" :committer-email="commit.author_email"></committer>
      </p>
      <br>
        <strong v-if="commit.revisores.length===1" style="color: black">Revisor{{ committerEntity(commit.revisores[0]).vazioOuA() }} indicad{{ committerEntity(commit.revisores[0]).oOuA() }}:</strong>
        <strong v-else="" style="color: black">Revisores indicados:</strong>
        <div v-for="revisor in commit.revisores">
          <committer :committer-email="revisor"></committer>
        </div>

      <div class="col-md-12" v-if="usuarioLogadoPodeRevisarEsteCommit()">
        <hr>

        <p><button class="btn btn-success" v-on:click="marcarComoFeitoEmPar()"><span class="glyphicon glyphicon-user"></span> Fizemos em Par</button></p>
        <p><button class="btn btn-primary" v-on:click="marcarComoRevisadoComFollowUp()"><span class="glyphicon glyphicon-ok"></span> Marcar como Revisado, com <em>follow-up</em></button></p>
        <p><button class="btn btn-info" v-on:click="marcarComoRevisadoSemFollowUp()"><span class="glyphicon glyphicon-ok"></span> Marcar como Revisado, sem <em>follow-up</em></button></p>

        <hr>
        <a href="http://git/sti/sagas2/blob/desenvolvimento/CONTRIBUTING.md" target="_blank">
          Clique aqui para abrir a <strong>Checklist</strong> <img src="../assets/external-link.png" alt="Abre em outra janela" style="margin: 0 0 3px 1px;">
        </a>
      </div>

      <h2 class="col-md-12" v-if="usuarioLogadoEhAutorDesteCommit()">
        <hr>
        Você é {{ committerLogado().oOuA() }} autor{{ committerLogado().vazioOuA() }} deste commit.
        <hr>
      </h2>

      <h2 v-show="!exibirLoadingRevisaoAlterada" class="col-md-12" v-if="!usuarioLogadoNuncaRevisouEsteCommit()">
        <hr>
        Você revisou este commit.
        <hr>
      </h2>

      <div v-show="!exibirLoadingRevisaoAlterada">
        <br>
        <hr>
        <div v-for="revisao in commit.revisoes">
          <br>
          <strong style="margin-left: 1px" :class="tipoRevisaoClass(revisao)"><span v-html="tipoRevisaoTexto(revisao)"></span> {{ timeAgoRevisado(revisao) }} por:</strong>
          <committer v-if="revisao.revisor" :committer-email="revisao.revisor"></committer>
        </div>
      </div>

      <div class="col-md-12" v-if="exibirLoadingRevisaoAlterada">
        <hr>
        <img src="../assets/loading.gif" alt="">
        <hr>
      </div>

      <hr>
    </div>

    <div class="col-md-12">
      <br>
      <br>
      Histórico:
      <ul>
        <li v-for="historico in commit.historico">{{ historico.replace(':gear:', '⚙').replace(':heavy_plus_sign:', '➕').replace(':point_right:', '👉').replace(':ok:', '🆗') }}</li>
        <li v-for="revisao in commit.revisoes">Revisado por {{ committerEntity(revisao.revisor).mencao() }} {{ timeAgo(revisao.data) }}, com revisão do tipo {{ revisao.tipoRevisao }}.</li>
      </ul>
    </div>


    <div class="col-md-12">
      <a href="http://srv-codereview:5984/_utils/fauxton/#/database/sesol2/{{ commit.sha }}" target="_blank" class="btn btn-default pull-right">&nbsp;<span class="glyphicon glyphicon-cog"></span></a>
      <a v-on:click="marcarComoNaoSerahRevisado" class="btn btn-default pull-right" title="Marcar commit como sem necessidade de revisão." :disabled="commitJahMarcadoComoNaoSerahRevisado()">&nbsp;<span class="glyphicon glyphicon-eye-close"></span></a>
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
import {CommitService} from '../servicos/CommitterService'

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
      canReuse: false,
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
    committerLogado() {
        return committers.committerLogado
    },
    timeAgo (data) {
        return utils.timeago(data);
    },
    committerEntity(email) {
        return committers.committerEntity(email);
    },
    mencaoCommitter(email) {
        return committers.committerEntity(email).mencao();
    },
    timeAgoCommittado () {
      return utils.timeago(this.commit.created_at)
    },
    timeAgoRevisado (revisao) {
      return utils.timeago(revisao.data)
    },
    tipoRevisaoClass(revisao) {
        return CommitService.TIPO_REVISAO_DADOS[revisao.tipoRevisao].tipoRevisaoClass;
    },
    tipoRevisaoTexto(revisao) {
        return CommitService.TIPO_REVISAO_DADOS[revisao.tipoRevisao].tipoRevisaoTexto;
    },
    loadCommit (commitId) {
      return store.findById(commitId).then(commit => {
          this.commit = commit;
      });
    },
    commitRevisado() {
        return CommitService.commitFoiRevisado(this.commit);
    },
    usuarioLogadoPodeRevisarEsteCommit() {
        return !this.usuarioLogadoEhAutorDesteCommit() && this.usuarioLogadoNuncaRevisouEsteCommit();
    },
    usuarioLogadoEhAutorDesteCommit() {
        return this.commit.author_email === committers.committerLogado.email;
    },
    usuarioLogadoNuncaRevisouEsteCommit() {
        return CommitService.usuarioLogadoNuncaRevisouCommit(this.commit);
    },
    marcarComoFeitoEmPar () {
        this.marcarComoRevisado(CommitService.TIPO_REVISAO.PAR);
    },
    marcarComoRevisadoComFollowUp() {
        this.marcarComoRevisado(CommitService.TIPO_REVISAO.COM_FOLLOW_UP);
    },
    marcarComoRevisadoSemFollowUp() {
        this.marcarComoRevisado(CommitService.TIPO_REVISAO.SEM_FOLLOW_UP);
    },
    marcarComoNaoSerahRevisado() {
        this.revisaoAlterada = true;
        this.exibirLoadingRevisaoAlterada = true;
        setTimeout(() => { this.exibirLoadingRevisaoAlterada = false }, 1000);

        CommitService.marcarComoNaoSerahRevisado(this.commit, () => { window.diff.notes.refresh(); }).then(() => {
            this.loadCommit(this.commit._id);
        });
    },
    commitJahMarcadoComoNaoSerahRevisado() {
        return CommitService.commitJahMarcadoComoNaoSerahRevisado(this.commit);
    },
    marcarComoRevisado(tipoRevisao) {
        this.revisaoAlterada = true;
        this.exibirLoadingRevisaoAlterada = true;
        setTimeout(() => { this.exibirLoadingRevisaoAlterada = false }, 1000);

        CommitService.marcarComoRevisado(this.commit, tipoRevisao, () => { window.diff.notes.refresh(); }).then(() => {
            this.loadCommit(this.commit._id);
        });
    },
    retornarParaCommits () {
        utils.limparDiff();
        let shaDesteCommit = this.commit.sha;
        this.commit = undefined;
        this.$router.go('/commits?scroll=' + shaDesteCommit)
    }
  }
}
</script>
