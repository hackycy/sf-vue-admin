import Layout from '@/layout'
import BlankLayout from '@/layout/components/BlankLayout'
import { isExternal } from '@/utils/validate'
import { toHump } from '@/utils'
import { constantRouterComponents } from '@/router'

/**
 * 获取外联路由
 */
export function getExternalLinkRoute(id, path, title, icon) {
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

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, parentRoute) {
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
      if (isExternal(route.router)) {
        realRoute = getExternalLinkRoute(route.id, route.router, route.name, route.icon)
      } else {
        const component = constantRouterComponents[route.viewPath]
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
      if (isExternal(route.router)) {
        realRoute = getExternalLinkRoute(route.id, route.router, route.name, route.icon)
      } else {
        const component = constantRouterComponents[route.viewPath]
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
        component: BlankLayout
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
