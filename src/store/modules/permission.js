import { constantRoutes, NotFoundRoute, asyncRoutesMap } from '@/router'
import Layout from '@/layout'
import PlaceHolder from '@/layout/placeholder'
import { toHump } from '@/utils'

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
function filterAsyncRoutes(routes, parentRoute) {
  const res = []

  routes.forEach(route => {
    if (route.type === 2 || !route.isShow) {
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
              name: toHump(route.viewPath),
              component,
              meta: { title: route.name, icon: route.icon, noCache: route.keepalive }
            }
          ]
        }
      }
    } else if (!parentRoute && !route.parentId && route.type === 0) {
      // 根目录
      const childRoutes = filterAsyncRoutes(routes, route)
      if (childRoutes && childRoutes.length > 0) {
        const redirect = childRoutes[0].path
        realRoute = {
          path: route.router,
          redirect,
          component: Layout,
          children: childRoutes,
          meta: { title: route.name, icon: route.icon }
        }
      }
    } else if (parentRoute && parentRoute.id === route.parentId && route.type === 1) {
      // 子菜单
      const component = asyncRoutesMap[route.viewPath]
      if (component) {
        realRoute = {
          path: route.router,
          name: toHump(route.viewPath),
          meta: {
            title: route.name,
            icon: route.icon,
            noCache: route.keepalive
          },
          component
        }
      }
    } else if (parentRoute && parentRoute.id === route.parentId && route.type === 0) {
      // 如果还是目录，继续递归
      const childRoute = filterAsyncRoutes(routes, route)
      if (childRoute && childRoute.length > 0) {
        const redirect = childRoute[0].path
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
    // add curent route
    if (realRoute) {
      res.push(realRoute)
    }
  })
  console.log(res)
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
      // 后端路由json进行转换成真正的routerMap
      const accessedRoutes = filterAsyncRoutes(menus, null)
      // 404 route must end
      accessedRoutes.push(NotFoundRoute)
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
