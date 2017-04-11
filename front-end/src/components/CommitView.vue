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
      <p>
        <strong style="color: black">Revisor(a) designado(a):</strong>
        <committer v-if="commit.revisor_email" :committer-email="commit.revisor_email"></committer>
      </p>

      <div v-if="commit.revisor_efetivo_email" v-show="!exibirLoadingRevisaoAlterada">
        <br>
        <hr>
        <h4>Revisado: <span :class="revisaoClass()">{{ commit.revisado || 'Não' }}</span></h4>
        <br>
        <strong style="margin-left: 1px" :class="revisaoClass()">Revisor(a) efetivo(a):</strong>
        <committer v-if="commit.revisor_efetivo_email" :committer-email="commit.revisor_efetivo_email"></committer>
        <br>
        Revisado <span :class="revisaoClass()">{{ timeAgoRevisado() }}</span>.
      </div>
      <div class="col-md-12" v-if="exibirLoadingRevisaoAlterada">
        <img src="../assets/loading.gif" alt="">
      </div>
      <div v-if="!revisaoAlterada && !commit.revisor_efetivo_email">
        <hr><h4>Revisado: {{ commit.revisado || 'Não' }}</h4>
      </div>

      <hr>
    </div>
    <div class="col-md-12" v-if="!commit.revisado">
      <p><button class="btn btn-primary" v-on:click="revisar('Sim')"><span class="glyphicon glyphicon-ok"></span> Marcar como Revisado</button></p>
      <button class="btn btn-success" v-on:click="revisar('Sim, feito em par')"><span class="glyphicon glyphicon-user"></span> Fizemos em Par</button>
    </div>

    <button class="btn btn-danger" v-if="0" v-on:click="limparRevisor"><span class="glyphicon glyphicon-user"></span> Tirar</button>
    <div v-if="0">
      <div class="col-md-12">
        <h3 class="page-header">Comments ({{ comments.length }})</h3>
      </div>
      <comment
              v-for="comment in comments"
              :comment="comment">
      </comment>
      <div class="col-md-4">
        <div class="panel panel-default">
          <div class="panel-body">
            <input type="text" class="form-control" v-model="content" placeholder="Enter content">
            <button class="btn btn-default" v-on:click="submit">Submit</button>
          </div>
        </div>
      </div>
    </div>
  </div>
  </div>
</template>

<script>
import Comment from '../components/Comment'
import store from '../store'
import utils from '../utils'
import committers from '../committers'
import Committer from './Committer'

export default {
  components: {
    Committer, Comment
  },

  data () {
    return {
      _id: '',
      commit: '',
      comments: [],
      content: '',
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
    timeAgoCommittado () {
      return utils.timeago(this.commit.created_at)
    },
    timeAgoRevisado () {
      return utils.timeago(this.commit.revisor_efetivo_data)
    },
    revisaoClass () {
      return (this.commit.revisado || '').indexOf('par') === -1 ? 'text-primary' : 'text-success'
    },
    loadCommit (commitId) {
      return store.findById(commitId).then(commit =>
        store.findCommentsByCommitId(commit._id).then(comments => {
          this.commit = commit
          this.comments = comments
        })
      )
    },
    revisar (status) {
      this.revisaoAlterada = true
      this.exibirLoadingRevisaoAlterada = true
      setTimeout(() => { this.exibirLoadingRevisaoAlterada = false }, 1000)
      this.commit.revisado = status
      this.commit.revisor_efetivo_email = committers.commiterLogado.email
      this.commit.revisor_efetivo_data = new Date().toISOString()
      store.create(this.commit).then(() => {
        this.loadCommit(this.commit._id)
      })
    },
    limparRevisor () {
      this.commit.revisor_efetivo_email = undefined
      this.commit.revisado = false
      store.create(this.commit).then(() => {
        this.loadCommit(this.commit._id)
      })
    },
    submit () {
      const data = {
        content: this.content,
        type: 'comment',
        createdAt: new Date().toJSON(),
        commitId: this.commit._id
      }
      store.create(data).then(() => {
        store.reloadComments(this, 'comments', this.commit._id)
      })
      this.content = ''
    },
    retornarParaCommits () {
      utils.limparDiff()
      this.commit = undefined
      this.$router.go('/commits')
    }
  }
}
</script>
