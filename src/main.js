import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import 'element-ui/lib/theme-chalk/index.css'// lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'
import bootstrap from '@/core/bootstrap'

import '@/core/use' // vue use
import '@/icons' // icon
import '@/permission' // permission control

Vue.config.productionTip = false

import { SocketIOWrapper } from '@/utils/socket-io'

new SocketIOWrapper()

new Vue({
  el: '#app',
  router,
  store,
  // init localstorage, vuex
  created: bootstrap,
  render: h => h(App)
})
