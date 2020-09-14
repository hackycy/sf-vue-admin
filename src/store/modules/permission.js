import { constantRoutes, NotFoundRoute, asyncRoutesMap } from '@/router'
import Layout from '@/layout'
import PlaceHolder from '@/layout/placeholder'
import { toHump } from '@/utils'
import { validURL } from '@/utils/validate'

/**
 * 获取外联路由
 */
function getExternalLinkRoute(id, path, title, icon) {
  return {
    path: `external-link${id}`,
    component: Layout,
    children: [
      {
        path: path,
        meta: { title, icon }
      }
    ]
  }
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
  },
  resetRoutes({ commit }) {
    return new Promise(resolve => {
      commit('SET_ROUTES', [])
      resolve()
    })
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
function filterAsyncRoutes(routes, parentRoute) {
  const res = []

  routes.forEach(route => {
    if (route.type === 2 || !route.isShow) {
      // 如果是权限或隐藏直接跳过
      return
    }
    // 根级别菜单渲染
    let realRoute
    if (!parentRoute && !route.parentId && route.type === 1) {
      // 根菜单
      if (validURL(route.router)) {
        realRoute = getExternalLinkRoute(route.id, route.router, route.name, route.icon)
      } else {
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
                meta: {
                  title: route.name,
                  icon: route.icon,
                  noCache: !route.keepalive
                }
              }
            ]
          }
        }
      }
    } else if (!parentRoute && !route.parentId && route.type === 0) {
      // 目录
      const childRoutes = filterAsyncRoutes(routes, route)
      realRoute = {
        path: route.router,
        component: Layout,
        alwaysShow: true,
        meta: { title: route.name, icon: route.icon }
      }
      if (childRoutes && childRoutes.length > 0) {
        realRoute.redirect = childRoutes[0].path
        realRoute.children = childRoutes
      }
    } else if (parentRoute && parentRoute.id === route.parentId && route.type === 1) {
      // 子菜单
      if (validURL(route.router)) {
        realRoute = getExternalLinkRoute(route.id, route.router, route.name, route.icon)
      } else {
        const component = asyncRoutesMap[route.viewPath]
        if (component) {
          realRoute = {
            path: route.router,
            name: toHump(route.viewPath),
            meta: {
              title: route.name,
              icon: route.icon,
              noCache: !route.keepalive
            },
            component
          }
        }
      }
    } else if (parentRoute && parentRoute.id === route.parentId && route.type === 0) {
      // 如果还是目录，继续递归
      const childRoute = filterAsyncRoutes(routes, route)
      realRoute = {
        path: route.router,
        meta: {
          title: route.name,
          icon: route.icon
        },
        alwaysShow: true,
        component: PlaceHolder
      }
      if (childRoute && childRoute.length > 0) {
        realRoute.redirect = childRoute[0].path
        realRoute.children = childRoute
      }
    }
    // add curent route
    if (realRoute) {
      res.push(realRoute)
    }
  })
  return res
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
