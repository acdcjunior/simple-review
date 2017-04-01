<template>
  <div class="col-md-12">
    <div class="panel panel-default">
      <div class="panel-body">
        <a href="{{ gitlabLink() }}" target="diff"><h3>{{ commit.title }}</h3></a>
        <committer :committer-email="committer().email"></committer>
        <button class="btn btn-default" style="float: right" v-on:click="abrirRevisao">Revisar</button>
        <p style="margin: 10px 5px 0 0">{{ timeAgoCommittado() }}.</p>
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
    timeAgoCommittado () {
      return utils.timeagoMaiusculo(this.commit.created_at)
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
