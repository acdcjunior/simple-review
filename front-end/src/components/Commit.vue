<template>
  <div class="col-md-12">
    <div class="panel panel-default">
      <div class="panel-body">
        <a v-if="commitRevisado()" href="{{ gitlabLink() }}" target="diff" class="text-muted" style="word-wrap: break-word;"><h3>{{ commit.title }}</h3></a>
        <a v-else=""               href="{{ gitlabLink() }}" target="diff"                    style="word-wrap: break-word;"><h3>{{ commit.title }}</h3></a>
        <committer :committer-email="committer().email"></committer>
        <button v-if="!commit.revisado" class="btn btn-info" style="float: right" v-on:click="abrirRevisao">Revisar</button>
        <button v-if="commit.revisado" class="btn btn-default" style="float: right" v-on:click="abrirRevisao">Ver</button>
        <p style="margin: 10px 5px 0 0">
          Criado {{ timeAgo(commit.created_at) }}.
          <span v-if="!commitRevisado()">Ainda não revisado.</span>
          <span v-else style="font-weight: bold">Revisado {{ timeAgoRevisado() }}.</span>
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
    timeAgoRevisado () {
      return utils.timeago(this.commit.revisoes[this.commit.revisoes.length - 1].data)
    },
    gitlabLink () {
      return utils.gitlabLink(this.commit.sha)
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
    abrirRevisao () {
      utils.atualizarDiff(this.commit.sha)
      this.$router.go('/commit/' + this.commit.sha)
    }
  }
}
</script>
