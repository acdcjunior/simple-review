import Vue from 'vue'
import Router from 'vue-router'
import App from './App'
import CommitList from './components/CommitList'
import CommitView from './components/CommitView'
import Login from './components/Login.vue'
import VueCookie from 'vue-cookie'
// Tell Vue to use the plugin

Vue.use(Router);
Vue.use(VueCookie);

const router = new Router();

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
});

router.beforeEach(function () {
  window.scrollTo(0, 0)
});

router.redirect({
  '*': '/commits'
});

router.start(App, '#app');

window.addEventListener('message', function (event) {
  if (event.data === 'hide-loading') {
    setTimeout(() => {
      window.$("#iframe-loading-image").hide();
      window.$(".iframe-loading-over").fadeOut(1000, () => {
        console.log('showing back');
        window.$("#iframe-loading-image").show();
      });
    }, 200);
  }
});

