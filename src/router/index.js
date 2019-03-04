import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/Home/home'
import Audio from '@/views/Home/Audio'
Vue.use(Router)

export default new Router({
  routes: [{
      path: '/',
      name: 'Home',
      component: Home,
      meta: {
        title: '火火兔内容云'
      }
    },
    {
      path: '/home',
      name: 'Home',
      component: Home,
      meta: {
        title: '火火兔内容云'
      }
    },
    {
      path: '/audio',
      name: Audio,
      component: Audio,
      meta: {
        title: '专辑'
      }
    }
  ]
  //mode: 'history',
})
