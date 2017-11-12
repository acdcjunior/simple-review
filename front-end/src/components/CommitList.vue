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
        <div class="col-md-7">
          Revisões Pendentes:
          <a v-on:click="exibirMinhasRevisoesPendentes" href="#" title="Você tem {{ qtdCommitsPendentesDoUsuarioLogado }} indicações de revisão pendentes.">
            <span class="numero" v-bind:class="{'numero-vermelho': qtdCommitsPendentesDoUsuarioLogado > 5, 'numero-amarelo': qtdCommitsPendentesDoUsuarioLogado > 2}">{{ qtdCommitsPendentesDoUsuarioLogado }}</span>
          </a>

        </div>
        <div class="col-md-5" style="font-size: 90%">
          Menções:
          <a v-on:click="exibirMeusTodos" href="#" title="Exibir quem te MARCOU.">
            <span class="numero">{{ qtdTodosPendentesDoUsuarioLogado+10 }}</span>
          </a>
        </div>
      </div>
    </div>

    <div class="col-md-12">
        <div class="col-md-12">
            <hr v-if="painelBusca">
            <button title="Alterar busca" class="btn btn-sm text-right" v-bind:class="{'btn-default': buscaEstahComValoresPadrao(), 'btn-danger': !buscaEstahComValoresPadrao()}" v-on:click="togglePainelBusca">
                <span class="center-block glyphicon" v-bind:class="{'glyphicon-menu-up': painelBusca, 'glyphicon-menu-down': !painelBusca}" style="margin-right: auto; margin-bottom: 3px;"></span>
            </button>
        </div>
    </div>

    <div class="col-md-12" v-if="painelBusca">
        <div class="col-md-12">
            <label style="width: 100%">
                Exibir somente commits do autor:
                <select v-model="exibirSomenteCommitsDoAutor" v-on:change="carregarCommits" class="form-control">
                    <option v-for="committer in committers" v-bind:value="committer.email">
                        {{ committer.name }}
                    </option>
                </select>
            </label>
        </div>

        <div class="col-md-12">
            <label style="width: 100%">
                Exibir commits cujo revisor é:
                <select v-model="exibirSomenteCommitsDoRevisor" v-on:change="carregarCommits" class="form-control">
                    <option v-for="committer in committers" v-bind:value="committer.email">
                        {{ committer.name }}
                    </option>
                </select>
            </label>
        </div>

        <div class="col-md-12">
            <label><input type="checkbox" v-model="exibirSomenteCommitsNaoRevisados" v-on:change="carregarCommits"> Somente commits não revisados</label>
        </div>

        <div class="col-md-12">
            <button class="btn btn-default" :disabled="buscaEstahComValoresPadrao()" v-on:click="exibirMinhasRevisoesPendentes">
                Restaurar Busca Padrão
            </button>
        </div>

        <div class="col-md-10" style="padding-top: 10px">
            Revisões encontradas: {{ (commits || []).length }}
        </div>
    </div>

    <div class="col-md-12">
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

        exibirSomenteCommitsDoAutor: store.todos.email,
        exibirSomenteCommitsDoRevisor: store.todos.email,
        exibirSomenteCommitsNaoRevisados: true
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

      painelBusca: false,

      exibirSomenteCommitsDoAutor: opcoesCommitList.exibirSomenteCommitsDoAutor,
      exibirSomenteCommitsDoRevisor: opcoesCommitList.exibirSomenteCommitsDoRevisor,
      exibirSomenteCommitsNaoRevisados: opcoesCommitList.exibirSomenteCommitsNaoRevisados,

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
              }).catch(e => {
                  console.log("Error while getting TODOs from logged-in user.", e);
                  clearInterval(this.qtdTodosPendentesDoUsuarioLogadoTimer);
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
    exibirMeusTodos () {
        utils.exibirTodosNoFrame();
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

        exibirSomenteCommitsDoAutor: this.exibirSomenteCommitsDoAutor,
        exibirSomenteCommitsDoRevisor: this.exibirSomenteCommitsDoRevisor,
        exibirSomenteCommitsNaoRevisados: this.exibirSomenteCommitsNaoRevisados
      }), { expires: '1Y' })
    },
    carregarCommits () {
      this.salvarCookieOpcoes();
      this.commits = undefined;
      return store.findAllCommitsThat(this.exibirSomenteCommitsDoAutor, this.exibirSomenteCommitsDoRevisor, this.exibirSomenteCommitsNaoRevisados).then(commits => {
          this.commits = commits;
          return store.findAllCommitsPendentesDoRevisor(this.logado().email).then(commitsPendentesDoUsuarioLogado => {
              this.qtdCommitsPendentesDoUsuarioLogado = commitsPendentesDoUsuarioLogado.length;
          })
      });
    },

    togglePainelBusca () {
        this.painelBusca = !this.painelBusca;
    },
    exibirMinhasRevisoesPendentes() {
        this.exibirSomenteCommitsDoAutor = store.todos.email;
        this.exibirSomenteCommitsDoRevisor = this.logado().email;
        this.exibirSomenteCommitsNaoRevisados = true;
        this.carregarCommits();
    },
    buscaEstahComValoresPadrao() {
        return this.exibirSomenteCommitsDoAutor === store.todos.email && this.exibirSomenteCommitsDoRevisor === this.logado().email && this.exibirSomenteCommitsNaoRevisados;
    }
  }
}
</script>