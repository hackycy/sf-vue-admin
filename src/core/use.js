import Vue from 'vue'
import ElementUI from 'element-ui'

import PermissionHelper from '@/core/permission'
import PermissionDirective from '@/core/directives/permission'

import ELDragDialog from '@/core/directives/el-drag-dialog'
import FormDialog from '@/components/FormDialog'
import ContextMenu from '@/components/ContextMenu'

// use
Vue.use(ElementUI)
Vue.use(PermissionHelper)
Vue.use(PermissionDirective)
Vue.use(ELDragDialog)
Vue.use(FormDialog)
Vue.use(ContextMenu)
