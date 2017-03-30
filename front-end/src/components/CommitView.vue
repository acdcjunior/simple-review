<template>
  <div class="col-md-12">
    <p></p>
    <p><a class="btn btn-default" :href="'#/commits'"><span class="glyphicon glyphicon-circle-arrow-left"></span> Voltar para commits</a></p>
  <div class="row">
    <div class="col-md-12">
      <div class="panel panel-default">
        <div class="panel-body">
          <h2>{{ commit.title }}</h2>
          <p>{{ commit.message }}</p>
        </div>
      </div>
    </div>
    <div class="col-md-12">
      <p>Autor: {{ commit.author_email || '&lt;sem autor>' }}</p>
      <p>Revisor: {{ commit.revisor_email || '&lt;sem revisor>' }}</p>
      <p>Revisado: {{ commit.revisado || 'Não' }}</p>
    </div>
    <div class="col-md-12">
      <p><button class="btn btn-primary" v-on:click="alterarStatus(true)"><span class="glyphicon glyphicon-ok"></span> Marcar como Revisado</button></p>
      <button class="btn btn-success" v-on:click="alterarStatus(false)"><span class="glyphicon glyphicon-user"></span> Fizemos em Par</button>
    </div>

    <div style="display: none;">
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

export default {
  components: {
    Comment
  },

  data () {
    return {
      _id: '',
      commit: '',
      comments: [],
      content: '',
      type: '',
      createdAt: '',
      commitId: ''
    }
  },

  route: {
    data ({ to }) {
      store.registerListener('view', () => {
        console.log('commit VIEW updated!')
        this.loadCommit(to.params.id)
      })
      return this.loadCommit(to.params.id)
    }
  },

  methods: {
    loadCommit (commitId) {
      return store.findCommitById(commitId).then(commit =>
        store.findCommentsByCommitId(commit._id).then(comments => {
          this.commit = commit
          this.comments = comments
        })
      )
    },
    alterarStatus (status) {
      this.commit.revisado = status
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
    }
  }
}
</script>
