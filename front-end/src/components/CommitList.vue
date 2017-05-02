<template>
<div class="col-md-12">
  <div class="row">
    <div class="col-md-12" style="margin-top: 5px">
      <div class="dropdown" style="float: right;">
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
      <h3 class="page-header" style="margin-top: 5px;">Sesol-2 Code Review</h3>
    </div>

    <div class="col-md-12">
      <committer v-if="exibirUsuarioLogado" :committer-email="logado().email"></committer>

      <div style="margin-top: 5px;">
        <div class="col-md-12">
          <button v-on:click="exibirMinhasRevisoesPendentes" class="btn btn-info" type="button" title="Você tem {{ qtdCommitsPendentesDoUsuarioLogado }} indicações de revisão pendentes.">
            Revisões <span class="badge">{{ qtdCommitsPendentesDoUsuarioLogado }}</span>
          </button>
          <button v-on:click="exibirMeusTodos" class="btn btn-info" type="button" title="Clique para exibir seus TODOs (comentários que te mencionam) no GitLab.">
            Menções <span class="badge">{{ qtdTodosPendentesDoUsuarioLogado }}</span>
          </button>
          <a href="https://trello.com/b/ty9DwoOK/sprint" class="btn btn-info" target="_blank" title="Clique para abrir o Trello Sesol-2 (outra aba)">
            Trello
          </a>
        </div>
      </div>
    </div>

    <div class="col-md-12">
      <hr>
      <label style="width: 100%">
        Exibir somente commits realizados por:
        <select v-model="exibirSomenteCommitsEfetuadosPor" v-on:change="carregarCommits" class="form-control" style="display: inline-block; width: 80%">
        <option v-for="committer in committers" v-bind:value="committer.email">
          {{ committer.name }}
        </option>
      </select>
      <button title="Voltar a exibir commits de 'Todos'" class="btn btn-default" :disabled="exibirSomenteCommitsEfetuadosPor === emailTodos()" v-on:click="restaurarCommitsEfetuadosPor"><span class="glyphicon glyphicon-erase"></span></button>
      </label>
    </div>
    <div class="col-md-12">
      <label><input type="checkbox" v-model="exibirSomenteCommitsEmQueSouRevisor" v-on:change="carregarCommits"> Somente commits dos quais sou revisor(a)</label>
    </div>
    <div class="col-md-12">
      <label><input type="checkbox" v-model="exibirSomenteCommitsNaoRevisados" v-on:change="carregarCommits"> Somente commits não revisados por mim</label>
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

    <div class="col-md-12"><br>&nbsp;<br></div>
  </div>
</div>
</template>

<script>
import Commit from '../components/Commit'
import store from '../store'
import utils from '../utils'
import committers from '../committers'
import Committer from './Committer'
import {CommitterService} from "../servicos/CommitterService";

export default {
  components: {
    Committer, Commit
  },

  data () {
    let opcoesCommitList = JSON.parse(this.$cookie.get('opcoesCommitList'));
    if (!opcoesCommitList) {
      opcoesCommitList = {
        ocultarEspacosEmBranco: true,
        diffLadoALado: true,
        exibirSomenteCommitsEmQueSouRevisor: true,
        exibirSomenteCommitsNaoRevisados: true,
        exibirSomenteCommitsEfetuadosPor: store.todos.email
      }
    }
    utils.ocultarEspacosEmBranco = opcoesCommitList.ocultarEspacosEmBranco;
    utils.diffLadoALado = opcoesCommitList.diffLadoALado;
    let data = {
      id: '',
      title: '',
      content: '',
      createdAt: '',
      type: '',
      commits: [],

      exibirUsuarioLogado: true,
      qtdCommitsPendentesDoUsuarioLogado: undefined,
      qtdTodosPendentesDoUsuarioLogado: undefined,
      qtdTodosPendentesDoUsuarioLogadoTimer: undefined,

      ocultarEspacosEmBranco: opcoesCommitList.ocultarEspacosEmBranco,
      diffLadoALado: opcoesCommitList.diffLadoALado,
      exibirSomenteCommitsEmQueSouRevisor: opcoesCommitList.exibirSomenteCommitsEmQueSouRevisor,
      exibirSomenteCommitsNaoRevisados: opcoesCommitList.exibirSomenteCommitsNaoRevisados,
      exibirSomenteCommitsEfetuadosPor: opcoesCommitList.exibirSomenteCommitsEfetuadosPor,
      committers: [
        store.todos
      ]
    };
    Object.keys(committers.committers).forEach((c) => {
      data.committers.push(committers.get(c))
    });
    return data
  },

  route: {
      canReuse: false,
      data ({ to }) {
          // workaround pq o vue nao atualiza sozinho!! :|
          this.exibirUsuarioLogado = false;
          setTimeout(() => {
              this.exibirUsuarioLogado = true;
          }, 500);

          clearInterval(this.qtdTodosPendentesDoUsuarioLogadoTimer);
          this.qtdTodosPendentesDoUsuarioLogadoTimer = setInterval(() => {
              CommitterService.gitlabTodosDoUsuarioLogado().then(qtdTodosUsuarioLogado => {
                  this.qtdTodosPendentesDoUsuarioLogado = qtdTodosUsuarioLogado;
              });
          }, 5000);

          this.carregarCommits().then(() => {
              if (to.query && to.query.scroll) {
                const commitParaScroll = document.getElementById(to.query.scroll);
                if (commitParaScroll) { // ele pode ter sumido da lista, se o cara revisou e tah filtrando revisados, por exemplo
                    window.$('html, body, .layout-col_left').animate({
                        scrollTop: window.$(commitParaScroll).offset().top - 10
                    }, 600, () => {
                        let urlAtual = window.location.href;
                        let novaUrl = urlAtual.replace(new RegExp("scroll=" + to.query.scroll, "g"), "").replace(/\?$/g, "");
                        window.history.pushState({path: novaUrl}, '', novaUrl);
                    });
                }
              }
          });
      }
  },

  created () {
    if (committers.testLogin(this)) {
      return
    }
    utils.limparDiff();
    window.$('.dropdown-toggle').dropdown();

    this.carregarCommits();
    store.registerListener('list', () => {
      this.carregarCommits()
    })
  },

  methods: {
    logado() {
        if (!committers.committerLogado) {
            console.log('Não há committer logado! -> ', committers.committerLogado);
        }
        return committers.committerLogado;
    },
    exibirMinhasRevisoesPendentes() {
        this.exibirSomenteCommitsEmQueSouRevisor = true;
        this.exibirSomenteCommitsNaoRevisados = true;
        this.exibirSomenteCommitsEfetuadosPor = store.todos.email;
        this.carregarCommits();
    },
    exibirMeusTodos () {
        utils.exibirTodosNoFrame();
    },
    restaurarCommitsEfetuadosPor () {
      this.exibirSomenteCommitsEfetuadosPor = store.todos.email;
      this.carregarCommits()
    },
    emailTodos () {
      return store.todos.email
    },
    alterarOpcaoBooleana (nomeOpcao) {
      this[nomeOpcao] = !this[nomeOpcao];
      this.salvarCookieOpcoes()
    },
    salvarCookieOpcoes () {
      utils.ocultarEspacosEmBranco = this.ocultarEspacosEmBranco;
      utils.diffLadoALado = this.diffLadoALado;
      this.$cookie.set('opcoesCommitList', JSON.stringify({
        ocultarEspacosEmBranco: this.ocultarEspacosEmBranco,
        diffLadoALado: this.diffLadoALado,
        exibirSomenteCommitsEmQueSouRevisor: this.exibirSomenteCommitsEmQueSouRevisor,
        exibirSomenteCommitsNaoRevisados: this.exibirSomenteCommitsNaoRevisados,
        exibirSomenteCommitsEfetuadosPor: this.exibirSomenteCommitsEfetuadosPor
      }), { expires: '1Y' })
    },
    carregarCommits () {
      this.salvarCookieOpcoes();
      this.commits = undefined;
      return store.findAllCommitsThat(this.logado().email, this.exibirSomenteCommitsEfetuadosPor, this.exibirSomenteCommitsEmQueSouRevisor, this.exibirSomenteCommitsNaoRevisados).then(commits => {
          this.commits = commits;
          return store.findAllCommitsPendentesDoRevisor(this.logado().email).then(commitsPendentesDoUsuarioLogado => {
              this.qtdCommitsPendentesDoUsuarioLogado = commitsPendentesDoUsuarioLogado.length;
          })
      });
    }
  }
}
</script>