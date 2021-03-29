import { constantRoutes } from '@/config/router.config'
import { filterAsyncRoutes, NotFoundRouter } from '@/router/generator-routers'

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }, menus) {
    return new Promise(resolve => {
      // 后端路由json进行转换成真正的router map
      const accessRoutes = filterAsyncRoutes(menus, null)
      // 404 route must be end
      accessRoutes.push(NotFoundRouter)
      commit('SET_ROUTES', accessRoutes)
      resolve(accessRoutes)
    })
  },
  resetRoutes({ commit }) {
    return new Promise(resolve => {
      commit('SET_ROUTES', [])
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
