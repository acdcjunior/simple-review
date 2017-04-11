<template>
<div class="col-md-12">
  <div class="row">
    <div class="col-md-12">
      <div class="dropdown" style="float: right; margin-top: 5px">
        <button class="btn btn-default dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
          <span class="glyphicon glyphicon-option-vertical"></span>
          <span class="caret"></span>
        </button>
        <ul class="dropdown-menu  dropdown-menu-right" aria-labelledby="dropdownMenu1">
          <li><a href="#" v-on:click="alterarOpcaoBooleana('ocultarEspacosEmBranco')">Ocultar Espaços em Branco: <b>{{ ocultarEspacosEmBranco ? 'Sim' : 'Não' }}</b></a></li>
          <li><a href="#" v-on:click="alterarOpcaoBooleana('diffLadoALado')">Exibir Diff Lado a Lado: <b>{{ diffLadoALado ? 'Sim' : 'Não' }}</b></a></li>
          <li role="separator" class="divider"></li>
          <li><a :href="'#/login/'"><span class="glyphicon glyphicon-transfer"></span>Trocar usuário</a></li>
        </ul>
      </div>
      <h2 class="page-header">
        Sesol-2
        UT: <a href="http://jenkins/view/Sesol-2/job/sagas2.dese.unit/"><img id="ut" src="../assets/question_mark.png" class="avatar"></a>
        IT: <a href="http://jenkins/view/Sesol-2/job/sagas2.dese.integ/"><img id="it" src="../assets/question_mark.png" class="avatar"></a>
      </h2>
    </div>

    <div class="col-md-12">
      <committer :committer-email="'commiterLogado'"></committer>
    </div>

    <div class="col-md-12">
      <hr>
      <label style="width: 100%">
        Exibir somente commits do(a) autor(a):
        <select v-model="exibirSomenteCommitsEfetuadosPor" v-on:change="carregarCommits" class="form-control" style="display: inline-block; width: 85%">
        <option v-for="committer in committers" v-bind:value="committer.email">
          {{ committer.nome }}
        </option>
      </select>
      <button title="Voltar a exibir commits de 'Todos'" class="btn btn-default" :disabled="exibirSomenteCommitsEfetuadosPor === emailTodos()" v-on:click="restaurarCommitsEfetuadosPor"><span class="glyphicon glyphicon-erase"></span></button>
      </label>
    </div>
    <div class="col-md-12">
      <label><input type="checkbox" v-model="exibirSomenteCommitsEmQueSouRevisor" v-on:change="carregarCommits"> Exibir somente commits dos quais sou revisor(a)</label>
    </div>
    <div class="col-md-12">
      <label><input type="checkbox" v-model="exibirSomenteCommitsNaoRevisados" v-on:change="carregarCommits"> Exibir somente commits ainda não revisados</label>
      <br>
      Encontrados: {{ (commits || []).length }}
      <hr>
    </div>

    <div class="col-md-12" v-if="!commits">
      <img src="../assets/loading.gif" alt="">
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
import utils from '../utils'
import committers from '../committers'
import Committer from './Committer'

export default {
  components: {
    Committer, Commit
  },

  data () {
    let opcoesCommitList = JSON.parse(this.$cookie.get('opcoesCommitList'))
    if (!opcoesCommitList) {
      opcoesCommitList = {
        ocultarEspacosEmBranco: true,
        diffLadoALado: true,
        exibirSomenteCommitsEmQueSouRevisor: true,
        exibirSomenteCommitsNaoRevisados: true,
        exibirSomenteCommitsEfetuadosPor: store.todos.email
      }
    }
    utils.ocultarEspacosEmBranco = opcoesCommitList.ocultarEspacosEmBranco
    utils.diffLadoALado = opcoesCommitList.diffLadoALado
    let data = {
      id: '',
      title: '',
      content: '',
      createdAt: '',
      type: '',
      commits: [],
      ocultarEspacosEmBranco: opcoesCommitList.ocultarEspacosEmBranco,
      diffLadoALado: opcoesCommitList.diffLadoALado,
      exibirSomenteCommitsEmQueSouRevisor: opcoesCommitList.exibirSomenteCommitsEmQueSouRevisor,
      exibirSomenteCommitsNaoRevisados: opcoesCommitList.exibirSomenteCommitsNaoRevisados,
      exibirSomenteCommitsEfetuadosPor: opcoesCommitList.exibirSomenteCommitsEfetuadosPor,
      committers: [
        store.todos
      ]
    }
    Object.keys(committers.committers).forEach((c) => {
      data.committers.push(committers.get(c))
    })
    return data
  },

  created () {
    if (committers.testLogin(this)) {
      return
    }
    window.$('.dropdown-toggle').dropdown()
    window.$.getJSON('http://srv-ic-master:8089/view/Sesol-2/job/sagas2.dese.unit/api/json?pretty=true', function (data) {
      window.$('ut').removeClass('avatar').attr('src', 'http://jenkins/static/48484716/images/32x32/' + data.color + '.gif')
    })
    window.$.getJSON('http://srv-ic-master:8089/view/Sesol-2/job/sagas2.dese.integ/api/json?pretty=true', function (data) {
      window.$('it').removeClass('avatar').attr('src', 'http://jenkins/static/48484716/images/32x32/' + data.color + '.gif')
    })

    this.carregarCommits()
    store.registerListener('list', () => {
      this.carregarCommits()
    })
  },

  methods: {
    logado () {
      return committers.commiterLogado
    },
    restaurarCommitsEfetuadosPor () {
      this.exibirSomenteCommitsEfetuadosPor = store.todos.email
      this.carregarCommits()
    },
    emailTodos () {
      return store.todos.email
    },
    alterarOpcaoBooleana (nomeOpcao) {
      this[nomeOpcao] = !this[nomeOpcao]
      this.salvarCookieOpcoes()
    },
    salvarCookieOpcoes () {
      utils.ocultarEspacosEmBranco = this.ocultarEspacosEmBranco
      utils.diffLadoALado = this.diffLadoALado
      this.$cookie.set('opcoesCommitList', JSON.stringify({
        ocultarEspacosEmBranco: this.ocultarEspacosEmBranco,
        diffLadoALado: this.diffLadoALado,
        exibirSomenteCommitsEmQueSouRevisor: this.exibirSomenteCommitsEmQueSouRevisor,
        exibirSomenteCommitsNaoRevisados: this.exibirSomenteCommitsNaoRevisados,
        exibirSomenteCommitsEfetuadosPor: this.exibirSomenteCommitsEfetuadosPor
      }), { expires: '1Y' })
    },
    carregarCommits () {
      this.salvarCookieOpcoes()
      this.commits = undefined
      store.reloadCommits(this, 'commits', this.exibirSomenteCommitsEfetuadosPor, this.exibirSomenteCommitsEmQueSouRevisor, this.logado().email, this.exibirSomenteCommitsNaoRevisados)
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
