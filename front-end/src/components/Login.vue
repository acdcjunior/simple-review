<template>
<div class="col-md-12">
  <div class="row">
    <div class="col-md-12">
      <h2 class="page-header">
        Quem é você?
      </h2>
    </div>

    <div class="col-md-12">
      <div class="panel panel-default">
        <div class="panel-body">
          <label style="width: 100%">
            Selecione na lista abaixo:
            <select v-model="committerSelecionado" class="form-control">
            <option v-for="committer in committers" v-bind:value="committer">
              {{ committer.nome }}
            </option>
              </select>
          </label>

          <button class="btn btn-primary" style="float: right" v-on:click="submit" :disabled="!committerSelecionado">Acessar</button>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import Commit from '../components/Commit'
import committers from '../committers'

export default {
  components: {
    Commit
  },

  data () {
    let data = {
      committerSelecionado: undefined,
      committers: [
      ]
    }
    Object.keys(committers.committers).forEach((c) => {
      data.committers.push(committers.get(c))
    })
    return data
  },

  methods: {
    submit () {
      this.$cookie.set('commiterLogado', JSON.stringify(this.committerSelecionado), { expires: '1Y' })
      committers.commiterLogado = this.committerSelecionado
      this.$router.go('/commits')
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
