import Vue from 'vue'
import Router from 'vue-router'
import App from './App'
import CommitList from './components/CommitList'
import CommitView from './components/CommitView'
import Login from './components/Login.vue'
import VueCookie from 'vue-cookie'
// Tell Vue to use the plugin

window.env = window.env || {};
window.env.isDev = window.location.host === '127.0.0.1:8080';
window.env.GITLAB_HOST   = window.env.isDev ? '127.0.0.1:8090' : '127.0.0.1';
window.env.BACK_END_NODE = window.env.isDev ? '127.0.0.1:8090' : '';
window.env.COUCHDB_HOST  = window.location.hostname;

Vue.use(Router)
Vue.use(VueCookie)

require('bootstrap')

const router = new Router()

router.map({
  '/login': {
    component: Login
  },

  '/commits': {
    component: CommitList
  },

  '/commit/:id': {
    component: CommitView
  }
})

router.beforeEach(function () {
  window.scrollTo(0, 0)
})

router.redirect({
  '*': '/commits'
})

router.start(App, '#app')
