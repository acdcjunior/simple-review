import Vue from 'vue'
import Router from 'vue-router'
import App from './App'
import CommitList from './components/CommitList'
import CommitView from './components/CommitView'

Vue.use(Router)

const router = new Router()

router.map({
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
