import { constantRoutes } from '@/router'
import Layout from '@/layout'
import { map } from '@/router/_import'

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
    // if (hasPermission(roles, tmp)) {
    //   if (tmp.children) {
    //     tmp.children = filterAsyncRoutes(tmp.children, roles)
    //   }
    //   res.push(tmp)
    // }
    if (route.type !== 2) {
      // 非权限，只需要目录或菜单
      if (!route.parentId) {
        // 根目录
        // routes.forEach(second)
        const childrenRoute = filerAsyncChildrenRoutes(routes, route.id)
        const realRoute = {
          path: route.router,
          component: Layout,
          meta: { title: route.name, icon: route.icon },
          children: childrenRoute
        }
        res.push(realRoute)
      }
    }
  })
  console.log(res)
  return res
}

export function filerAsyncChildrenRoutes(routes, parentId) {
  const res = []
  routes.forEach(route => {
    if (route.type !== 2) {
      if (route.parentId === parentId) {
        let childrenRoute
        if (route.type === 0) {
          childrenRoute = filerAsyncChildrenRoutes(routes, route.id)
        }
        console.log('>>>>>>>>>>>>>>>>>>>')
        console.log(map[route.viewPath])
        console.log(route.viewPath)
        console.log('>>>>>>>>>>>>>>>>>>>')
        const realRoute = {
          path: route.router,
          children: childrenRoute,
          meta: {
            title: route.name,
            icon: route.icon
          },
          component: map[route.viewPath]
        }
        // if (route.viewPath) {
        //   console.log('>>>>>>> divider >>>>>>>>>')
        //   console.log(map['views/dashboard/index'])
        //   console.log('>>>>>>> dynamic >>>>>>>>>')
        //   console.log(map[route.viewPath])
        //   console.log('>>>>>>> divider >>>>>>>>>')
        // }
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
