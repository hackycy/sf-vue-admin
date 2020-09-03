/* eslint-disable new-cap */
import path from 'path'

/**
 * url权限注册
 * @param {String} value info
 */
export function Permission(value) {
  return function(target, key, descriptor) {
    if (!target.permission) {
      target.permission = {}
    }
    target.permission[key] = value.replace(/\//g, ':')
    return descriptor
  }
}

// /**
//  * 命名空间前缀注册
//  * @param {*} value 命名空间
//  */
// export function Service(value) {
//   return function(target) {
//     // 命名
//     if (typeof value === 'string') {
//       target.prototype.namespace = value
//     } else if (value.prototype.toString.call() === '[object Object]') {
//       const { namespace } = value
//       target.prototype.namespace = namespace
//     }
//   }
// }

export default class ServiceRegisterPlugin { }

/**
 * plugin install
 * @param {*} Vue vue
 */
ServiceRegisterPlugin.install = function(Vue, options) {
  let store
  // require.context('@/service/', true, /\.js$/).keys().forEach(e => { console.log(e) })
  const files = require.context('@/service/', true, /\.js$/)

  const modules = {}

  Vue.prototype.$service = modules

  if (options) {
    store = options.store
    store.$service = modules
  }

  files
    .keys()
    .forEach(e => {
      const list = e.substr(2).split('/')
      const parents = list.slice(0, list.length - 1)
      const name = path.basename(e, '.js')

      let curr = modules
      let prev = null
      let key = null

      parents.forEach((k) => {
        if (!curr[k]) {
          curr[k] = {}
        }

        prev = curr
        curr = curr[k]
        key = k
      })

      const n = e.replace('./', '')

      const ep = require(`@/service/${n}`).default
      if (ep) {
        const service = new ep()

        if (name === 'index') {
          prev[key] = service
        } else {
          curr[name] = service
        }
      } else {
        console.error(`Service must export default [${e}]`)
      }
    })
}

