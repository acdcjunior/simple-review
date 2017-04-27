<template>
  <div class="col-md-12" id="{{ commit.sha }}">
    <div class="panel panel-default">
      <div class="panel-body">
        <a href="{{ gitlabLink() }}" target="diff" style="word-wrap: break-word;"><h3>{{ commit.title }}</h3></a>

        <committer :committer-email="committer().email"></committer>

        <button v-if="usuarioLogadoNuncaRevisouCommit()" class="btn btn-info" style="float: right" v-on:click="abrirRevisao">Revisar</button>
        <button v-else=""                                class="btn btn-default" style="float: right" v-on:click="abrirRevisao">Ver</button>

        <p style="margin: 10px 5px 0 0">
          Criado {{ timeAgo(commit.created_at) }}.

          <span v-if="!commitRevisado()" style="font-size: smaller">Com revisões pendentes.</span>
          <span v-else style="font-weight: bold">{{ revisadoHaTempos() }}.</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import committers from '../committers'
import utils from '../utils'
import Committer from './Committer'
import {CommitService} from "../servicos/CommitterService";

export default {
  name: 'Commit',

  components: {
    Committer
  },

  props: {
    commit: Object
  },

  methods: {
    committer () {
      return committers.get(this.commit.author_email)
    },
    timeAgo (data) {
      return utils.timeago(data)
    },
    revisadoHaTempos() {
      if (this.commit.revisores.length === 0) {
          return 'Sem revisores'
      }
      return 'Revisado ' + utils.timeago(this.commit.revisoes[this.commit.revisoes.length - 1].data)
    },
    gitlabLink () {
      return utils.gitlabLink(this.commit.sha)
    },
    usuarioLogadoNuncaRevisouCommit() {
        return CommitService.usuarioLogadoNuncaRevisouCommit(this.commit);
    },
    commitRevisado () {
        return CommitService.commitFoiRevisado(this.commit);
    },
    abrirRevisao () {
      utils.atualizarDiff(this.commit.sha)
      this.$router.go('/commit/' + this.commit.sha)
    }
  }
}
</script>
