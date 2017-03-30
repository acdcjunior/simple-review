<template>
<div class="col-md-12">
  <div class="row">
    <div class="col-md-12">
      <h2 class="page-header">
        Sesol-2
        UT: <a href="http://jenkins/view/Sesol-2/job/sagas2.dese.unit/"><img id="ut" src=""></a>
        IT: <a href="http://jenkins/view/Sesol-2/job/sagas2.dese.integ/"><img id="it" src=""></a>
      </h2>
      <script>
          $.getJSON("http://srv-ic-master:8089/view/Sesol-2/job/sagas2.dese.unit/api/json?pretty=true", function (data) {
              $("ut").attr("src", "http://jenkins/static/48484716/images/32x32/" + data.color + ".gif");
          });
          $.getJSON("http://srv-ic-master:8089/view/Sesol-2/job/sagas2.dese.integ/api/json?pretty=true", function (data) {
              $("it").attr("src", "http://jenkins/static/48484716/images/32x32/" + data.color + ".gif");
          });
      </script>
    </div>

    <div class="col-md-12">
      <label style="width: 100%">
        Exibir somente commits do revisor:
        <select v-model="exibirSomenteCommitsAtribuidosA" v-on:change="carregarCommits" class="form-control">
          <option v-for="committer in committers" v-bind:value="committer.email">
            {{ committer.nome }}
          </option>
        </select>
      </label>
    </div>
    <div class="col-md-12">
      <label style="width: 100%">
        Exibir somente commits do autor:
        <select v-model="exibirSomenteCommitsEfetuadosPor" v-on:change="carregarCommits" class="form-control">
          <option v-for="committer in committers" v-bind:value="committer.email">
          {{ committer.nome }}
          </option>
        </select>
      </label>
    </div>
    <div class="col-md-12">
      <label><input type="checkbox" v-model="exibirSomenteCommitsNaoRevisados" v-on:change="carregarCommits"> Exibir somente commits pendentes</label>
      <br>
      Encontrados: {{ commits.length }}
      <hr>
    </div>
    <commit
      v-for="commit in commits"
      :commit="commit">
    </commit>

    <div class="col-md-12" style="display: none;">
      <div class="panel panel-default">
        <div class="panel-body">
          <input type="text" class="form-control" v-model="title" placeholder="Enter title">
          <input type="text" class="form-control" v-model="content" placeholder="Enter content">
          <button class="btn btn-default" v-on:click="submit">Submit</button>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import Commit from '../components/Commit'
import store from '../store'

export default {
  components: {
    Commit
  },

  data () {
    return {
      id: '',
      title: '',
      content: '',
      createdAt: '',
      type: '',
      commits: [],
      exibirSomenteCommitsNaoRevisados: true,
      exibirSomenteCommitsAtribuidosA: store.todos.email,
      exibirSomenteCommitsEfetuadosPor: store.todos.email,
      committers: [
        store.todos,
        {nome: 'Antonio', email: 'antonio@existe.com'},
        {nome: 'Afonso', email: 'afonso@existe.com'}
      ]
    }
  },

  created () {
    this.carregarCommits()
    store.registerListener('list', () => {
      console.log('commit list updated!')
      this.carregarCommits()
    })
  },

  methods: {
    carregarCommits () {
      store.reloadCommits(this, 'commits', this.exibirSomenteCommitsAtribuidosA, this.exibirSomenteCommitsEfetuadosPor, this.exibirSomenteCommitsNaoRevisados)
    },
    submit () {
      const data = {
        'type': 'commit',
        'title': this.title,
        'content': this.content,
        'createdAt': new Date().toJSON()
      }
      store.create(data).then(results => {
        store.reloadCommits(this, 'commits')
      })
      this.title = ''
      this.content = ''
    }
  }
}
</script>

<style>
.panel {
  -webkit-box-shadow: 0 0 0 rgba(0, 0, 0, 0);
  box-shadow: 0 0 0 rgba(0, 0, 0, 0);
}

.panel h3 {
  margin-top: 0;
}
</style>
