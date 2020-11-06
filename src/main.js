import Vue from 'vue'
import 'normalize.css/normalize.css' // a modern alternative to CSS resets
import './styles/element-variables.scss'

// import enLang from 'element-ui/lib/locale/lang/en'// 如果使用中文语言包请默认支持，无需额外引入，请删除该依赖
import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import './icons' // icon
import './permission' // permission control
import './utils/error-log' // error log
import './core/use' // use

import bootstrap from './core/bootstrap'

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  created: bootstrap,
  render: h => h(App)
})
