import { constantRoutes } from '@/router'
import Layout from '@/layout'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
// function hasPermission(roles, route) {
//   if (route.meta && route.meta.roles) {
//     return roles.some(role => route.meta.roles.includes(role))
//   } else {
//     return true
//   }
// }

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    // if (hasPermission(roles, tmp)) {
    //   if (tmp.children) {
    //     tmp.children = filterAsyncRoutes(tmp.children, roles)
    //   }
    //   res.push(tmp)
    // }
    if (tmp.type !== 2) {
      // 非权限，只需要目录或菜单
      if (!tmp.parentId) {
        // 根目录
        // routes.forEach(second)
        // const childrenRoute = filerAsyncChildrenRoutes(routes, tmp.id)
        const realRoute = {
          path: tmp.router,
          component: Layout,
          meta: {
            title: tmp.name
          }
          // children: childrenRoute
        }
        res.push(realRoute)
      }
    }
  })

  return res
}

export function filerAsyncChildrenRoutes(routes, parentId) {
  const res = []
  routes.forEach(route => {
    const tmp = { ...route }
    if (tmp.type !== 2) {
      if (tmp.parentId === parentId) {
        let childrenRoute
        if (tmp.type === 0) {
          childrenRoute = filerAsyncChildrenRoutes(routes, tmp.id)
        }
        const realRoute = {
          path: tmp.router,
          children: childrenRoute
          // component: () => import(`@/views/${tmp.viewPath}`)
        }
        res.push(realRoute)
      }
    }
  })
  return res
}

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
      // 转换
      const accessedRoutes = filterAsyncRoutes(menus)
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
