<template>
  <div class="col-md-12" id="{{ commit.sha }}">
    <div class="panel panel-default">
      <div class="panel-body">
        <a v-on:click="abrirRevisao" href="#" target="diff" style="word-wrap: break-word;"><h3>{{ commit.title }}</h3></a>

        <committer :committer-email="committer().email"></committer>

        <button v-if="usuarioLogadoNuncaRevisouCommit()" class="btn btn-info" style="float: right" v-on:click="abrirRevisao">Revisar</button>
        <button v-else=""                                class="btn btn-default" style="float: right" v-on:click="abrirRevisao">Ver</button>

        <div class="pull-right">
            <a v-if="this.committerLogado().canOpenCouch" style="width: 20px; padding-left: 0" href="http://{{ couchdbHost() }}:5984/_utils/fauxton/#/database/sesol2/{{ commit.sha }}" target="_blank" class="btn btn-default pull-right">&nbsp;<span style="display: inline-block; margin-left: -1px;" class="glyphicon glyphicon-cog"></span></a>
            <a v-if="this.committerLogado().canRemoveReview" style="width: 20px; padding-left: 0" v-on:click="marcarComoNaoSerahRevisado" class="btn btn-default pull-right" title="Marcar commit como sem necessidade de revisão." :disabled="commitJahMarcadoComoNaoSerahRevisado()">&nbsp;<span style="display: inline-block; margin-left: -1px;" class="glyphicon glyphicon-eye-close"></span></a>
        </div>

          <p style="margin: 10px 5px 0 0">
          Criado {{ timeAgo(commit.created_at) }}.
          &nbsp;
          <span v-for="bolinha in bolinhas">
            <span class="bolinha" v-bind:class="bolinha.className" v-bind:title="bolinha.hint">{{ bolinha.iniciais }}</span>
          </span>
        </p>
      </div>
    </div>
  </div>
</template>

<style>
  .bolinha {
    display: inline-block;
    border-radius: 50%;

    width: 24px;
    height: 24px;
    padding: 3px 3px 0 2px;

    border: 1px solid #666;

    text-align: center;

    color: #dedede;
    font-size: 11px;
    font-family: 'Roboto', sans-serif;
  }
  .bolinha.bolinha-text-danger { background: #de615f;  }
  .bolinha.bolinha-text-success { background: #009803; }
  .bolinha.bolinha-text-muted { background: #777777; }
  .bolinha.bolinha-text-info { background: #31708f; }
  .bolinha.bolinha-text-primary { background: #337ab7; }
</style>

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

  created() {
      this.bolinhas = this.calcularBolinhas();
  },

  methods: {
    committerLogado() {
        if (!committers.committerLogado) {
            console.log('Não há committer logado! -> ', committers.committerLogado);
        }
        return committers.committerLogado;
    },
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
    criarBolinha(emailRevisor, classeTipoRevisao, tipoRevisaoTexto) {
        const committer = committers.get(emailRevisor);
        if (committer.isBotComentador) {
            return;
        }
        return {className: 'bolinha-' + classeTipoRevisao, email: emailRevisor, iniciais: committer.name.substr(0, 2).toUpperCase(), hint: `${tipoRevisaoTexto.replace(/<\/?em>/g, '')} por ${committer.name}`}
    },
    calcularBolinhas() {
        let bolinhas = [];
        this.commit.revisores.forEach(emailRevisor => {
            const bolinha = this.criarBolinha(emailRevisor, 'text-danger', 'Pendente de revisão');
            if (bolinha) {
                bolinhas.push(bolinha);
            }
        });
        this.commit.revisoes.forEach(revisao => {
            if (this.commit.revisores.indexOf(revisao.revisor) !== -1) {
                bolinhas = bolinhas.filter(badge => badge.email !== revisao.revisor);
            }
            const bolinha = this.criarBolinha(revisao.revisor, CommitService.TIPO_REVISAO_DADOS[revisao.tipoRevisao].tipoRevisaoClass, CommitService.TIPO_REVISAO_DADOS[revisao.tipoRevisao].tipoRevisaoTexto);
            if (bolinha) {
                bolinhas.push(bolinha);
            }
        });
        return bolinhas;
    },
    abrirRevisao () {
        utils.atualizarDiff(this.commit.sha);
        this.$router.go('/commit/' + this.commit.sha)
    },
    couchdbHost() {
        return window.env.COUCHDB_HOST
    },
    marcarComoNaoSerahRevisado() {
        CommitService.marcarComoNaoSerahRevisado(this.commit);
    },
    commitJahMarcadoComoNaoSerahRevisado() {
        return CommitService.commitJahMarcadoComoNaoSerahRevisado(this.commit);
    }
  }
}
</script>
