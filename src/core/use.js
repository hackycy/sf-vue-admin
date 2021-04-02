import Vue from 'vue'
import ElementUI from 'element-ui'

import PermissionHelper from '@/core/permission'
import TableLayout from '@/layout/components/TableLayout'

import ELDragDialog from '@/directive/el-drag-dialog'

// use
Vue.use(ElementUI)
Vue.use(PermissionHelper)
Vue.use(ELDragDialog)

// component
Vue.component('TableLayout', TableLayout)
