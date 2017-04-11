<template>
  <div class="col-md-12">
    <div class="panel panel-default">
      <div class="panel-body">
        <a v-if="!commit.revisado" href="{{ gitlabLink() }}" target="diff"><h3>{{ commit.title }}</h3></a>
        <a v-if="commit.revisado" href="{{ gitlabLink() }}" target="diff" class="text-muted"><h3>{{ commit.title }}</h3></a>
        <committer :committer-email="committer().email"></committer>
        <button v-if="!commit.revisado" class="btn btn-info" style="float: right" v-on:click="abrirRevisao">Revisar</button>
        <button v-if="commit.revisado" class="btn btn-default" style="float: right" v-on:click="abrirRevisao">Ver</button>
        <p style="margin: 10px 5px 0 0">
          Criado {{ timeAgo(commit.created_at) }}.
          <span v-if="!commit.revisado">Ainda não revisado.</span>
          <strongx>
          <span v-if="commit.revisado && commit.revisado.indexOf('par') === -1" class="text-primary">Revisado {{ timeAgo(commit.revisor_efetivo_data) }}.</span>
          <span v-if="commit.revisado && commit.revisado.indexOf('par') !== -1" class="text-success">Feito em par.</span>
          </strongx>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import committers from '../committers'
import utils from '../utils'
import Committer from './Committer'

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
    gitlabLink () {
      return utils.gitlabLink(this.commit.sha)
    },
    abrirRevisao () {
      utils.atualizarDiff(this.commit.sha)
      this.$router.go('/commit/' + this.commit.sha)
    }
  }
}
</script>
