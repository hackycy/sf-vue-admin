import Vue from 'vue'
import Element from 'element-ui'
import Cookies from 'js-cookie'

import Permission from './directive/permission'
import * as filters from './filters' // global filters

// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.use(Element, {
  size: Cookies.get('size') || 'medium' // set element-ui default size
})

// 注册v-permission指令
Vue.use(Permission)
