import Vue from 'vue'
import ElementUI from 'element-ui'

import PermissionHelper from '@/core/permission'

import ELDragDialog from '@/directives/el-drag-dialog'
import FormDialog from '@/components/FormDialog'
import ContextMenu from '@/components/ContextMenu'

// use
Vue.use(ElementUI)
Vue.use(PermissionHelper)
Vue.use(ELDragDialog)
Vue.use(FormDialog)
Vue.use(ContextMenu)
