import Vue from 'vue'
import ElementUI from 'element-ui'

import PermissionHelper from '@/core/permission'
import TableLayout from '@/layout/components/TableLayout'

// use
Vue.use(ElementUI)
Vue.use(PermissionHelper)

// component
Vue.component('TableLayout', TableLayout)
