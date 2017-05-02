<template>
  <div style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
    <img class="avatar" v-bind:src="committer.avatar_url">
    {{ committer.name }}
  </div>
</template>

<script>
import committers from '../committers'

export default {
  name: 'Committer',

  props: {
    committerEmail: String
  },

  route: {
      canReuse: false
  },

  data () {
    return {committer: committers.get(this.committerEmail)}
  }
}
</script>
