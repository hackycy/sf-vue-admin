import Vue from 'vue'
import ElementUI from 'element-ui'

import PermissionHelper from '@/core/permission'

import ELDragDialog from '@/directive/el-drag-dialog'

import FormDialog from '@/components/FormDialog'

// use
Vue.use(ElementUI)
Vue.use(PermissionHelper)
Vue.use(ELDragDialog)
Vue.use(FormDialog)
