import { constantRoutes, NotFoundRoute, asyncRoutesMap } from '@/router'
import Layout from '@/layout'
import PlaceHolder from '@/layout/placeholder'
import { toHump } from '@/utils'

// /**
//  * Use meta.role to determine if the current user has permission
//  * @param roles
//  * @param route
//  */
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
function filterAsyncRoutes(routes, parentRoute) {
  const res = []

  routes.forEach(route => {
    // if (hasPermission(roles, tmp)) {
    //   if (tmp.children) {
    //     tmp.children = filterAsyncRoutes(tmp.children, roles)
    //   }
    //   res.push(tmp)
    // }
    if (route.type === 2) {
      return
    }
    // 根级别菜单渲染
    let realRoute
    if (!parentRoute && !route.parentId && route.type === 1) {
      // 根目录
      // routes.forEach(second)
      // const childrenRoute = filerAsyncChildrenRoutes(routes, route.id)
      // console.log(childrenRoute)
      const component = asyncRoutesMap[route.viewPath]
      if (component) {
        realRoute = {
          path: route.router,
          redirect: `${route.router}/index`,
          component: Layout,
          children: [
            {
              path: 'index',
              name: toHump(`${route.router}/index`),
              component,
              meta: { title: route.name, icon: route.icon }
            }
          ]
        }
      }
    } else if (!parentRoute && !route.parentId && route.type === 0) {
      // 根目录
      const childRoute = filterAsyncRoutes(routes, route)
      if (childRoute && childRoute.length > 0) {
        const redirect = childRoute[0].path
        realRoute = {
          path: route.router,
          redirect,
          component: Layout,
          children: childRoute,
          meta: {
            title: route.name,
            icon: route.icon
          }
        }
      }
    } else if (parentRoute && parentRoute.id === route.parentId) {
      // 子目录
      if (route.type === 1) {
        // 已经是菜单了，中断递归
        const component = asyncRoutesMap[route.viewPath]
        if (component) {
          realRoute = {
            path: route.router,
            name: toHump(route.viewPath),
            meta: {
              title: route.name,
              icon: route.icon
            },
            component
          }
          console.log(toHump(route.viewPath))
        }
      } else if (route.type === 0) {
        // 如果还是目录，继续递归
        const childRoute = filterAsyncRoutes(routes, route)
        const redirect = childRoute[0].path
        if (childRoute && childRoute.length > 0) {
          realRoute = {
            path: route.router,
            redirect,
            meta: {
              title: route.name,
              icon: route.icon
            },
            children: childRoute,
            component: PlaceHolder
          }
        }
      }
    }
    if (realRoute) {
      res.push({ ...realRoute })
    }
  })
  // 404 route must end
  res.push(NotFoundRoute)
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
      const accessedRoutes = filterAsyncRoutes(menus, null)
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
