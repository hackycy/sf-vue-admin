import Vue from 'vue'

import Cookies from 'js-cookie'

import moment from 'moment-timezone'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import Element from 'element-ui'
import './styles/element-variables.scss'
// import enLang from 'element-ui/lib/locale/lang/en'// 如果使用中文语言包请默认支持，无需额外引入，请删除该依赖

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import './icons' // icon
import './permission' // permission control
import './utils/error-log' // error log

import * as filters from './filters' // global filters

import ServiceRegisterPlugin from './decorator/service'
import Permission from './directive/permission'

moment.locale('zh-cn') // zh-cn
moment.tz.setDefault('Asia/Shanghai') // timezone

Vue.use(Element, {
  size: Cookies.get('size') || 'medium' // set element-ui default size
})

Vue.use(ServiceRegisterPlugin)

// 注册v-permission指令
Vue.use(Permission)

// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
