<template>
  <div class="col-md-12">
    <div class="panel panel-default">
      <div class="panel-body">
        <h3>{{ commit.title }}</h3>
        <p>{{ commit.author_email }} {{ dateAgo() }}</p>
        <a class="btn btn-default" :href="'#/commit/' + commit._id">Revisar</a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Commit',

  props: {
    commit: Object
  },

  methods: {
    dateAgo () {
      return window.jQuery.timeago(Date.parse('2017-03-17T09:24:17Z'))
    }
  }
}
</script>
