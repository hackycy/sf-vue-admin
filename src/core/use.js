import Vue from 'vue'
import ElementUI from 'element-ui'

import PermissionHelper from '@/core/permission'
import PermissionDirective from '@/core/directives/permission'

import ELDragDialog from '@/core/directives/el-drag-dialog'
import ELTableInfiniteScroll from '@/core/directives/table-infinite-scroll'
import FormDialog from '@/components/FormDialog'
import ContextMenu from '@/components/ContextMenu'
import EventBus from '@/utils/event-bus'

Vue.use(EventBus)
// directives
Vue.use(PermissionHelper)
Vue.use(PermissionDirective)
Vue.use(ELDragDialog)
Vue.use(ELTableInfiniteScroll)

// ui
Vue.use(ElementUI)
Vue.use(FormDialog)
Vue.use(ContextMenu)
