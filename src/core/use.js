import Vue from 'vue'
import ElementUI from 'element-ui'

import PermissionHelper from '@/core/permission'
import PermissionDirective from '@/core/directives/permission'

import ELDragDialog from '@/core/directives/el-drag-dialog'
import FormDialog from '@/components/FormDialog'
import ContextMenu from '@/components/ContextMenu'
import EventBus from '@/utils/event-bus'

Vue.use(EventBus)
// di
Vue.use(PermissionHelper)
Vue.use(PermissionDirective)

// ui
Vue.use(ElementUI)
Vue.use(ELDragDialog)
Vue.use(FormDialog)
Vue.use(ContextMenu)
