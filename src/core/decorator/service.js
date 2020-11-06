/* eslint-disable new-cap */
import path from 'path'
import store from '@/store'

/**
 * permission权限注册
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

/**
 * 命名空间前缀注册，暂未使用
 * @param {*} value 命名空间
 */
export function Service(value) {
  return function(target) {
    // 命名
    if (typeof value === 'string') {
      target.prototype.namespace = value.replace(/\//g, ':')
    } else if (value.prototype.toString.call() === '[object Object]') {
      const { namespace } = value
      target.prototype.namespace = namespace.replace(/\//g, ':')
    }
  }
}

/**
 * plugin install
 * @param {*} Vue vue
 */
export default function register(Vue) {
  // require.context('@/service/', true, /\.js$/).keys().forEach(e => { console.log(e) })
  const files = require.context('@/service/', true, /\.js$/)

  const modules = {}

  // 挂载 $service
  Vue.prototype.$service = modules
  store.$service = modules

  files
    .keys()
    .forEach(e => {
      const list = e.substr(2).split('/')
      const parents = list.slice(0, list.length - 1)
      // 文件路径出现_-等符号则转换
      const name = path.basename(e, '.js').replace(/[_-][a-z]/ig, s => s.substring(1).toUpperCase())

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

