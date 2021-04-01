import Vue from 'vue'
import Router from 'vue-router'
import { constantRoutes } from '@/config/router.config'

Vue.use(Router)

// generate components map
export const constantRouterComponents = {}

// auto load
const modulesFiles = require.context('./modules', true, /\.js$/)

modulesFiles.keys().forEach(path => {
  const value = modulesFiles(path).default

  // mouted
  Object.keys(value).forEach(ele => {
    constantRouterComponents[ele] = value[ele]
  })
})

// create router
const createRouter = () => new Router({
  mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
