<template>
  <div>
    <img class="avatar" v-bind:src="committer.avatar_url">
    {{ committer.nome }}
  </div>
</template>

<script>
import committers from '../committers'

export default {
  name: 'Committer',

  props: {
    committerEmail: String
  },

  data () {
    if (this.committerEmail === 'commiterLogado') {
      return {committer: committers.commiterLogado}
    }
    return {committer: committers.get(this.committerEmail)}
  }
}
</script>
