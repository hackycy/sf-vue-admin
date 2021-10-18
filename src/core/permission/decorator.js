import { isString } from 'lodash'

/**
 * 权限点，例如 add
 * 会与prefix 拼接组成 例如：sys/user/add
 */
export function PermissionAction(action) {
  return function(target, propertyKey, _) {
    if (!isString(action)) {
      throw new Error('unsupport permission action type')
    }

    if (!target.$permission) {
      target.$permission = {}
    }

    // 延迟执行
    setTimeout(() => {
      // 挂载权限点
      target.$permission[propertyKey] =
        (`${target.$permissonPrefix ? target.$permissonPrefix + '/' : ''}${action}`).replace(/\//g, ':')
    }, 0)
  }
}

/**
 * 权限前缀，例如 sys/user
 */
export function PermissionPrefix(prefix = '') {
  return function(constructor) {
    if (!isString(prefix)) {
      throw new Error('unsupport permission prefix type')
    }

    constructor.prototype.$permissonPrefix = prefix
  }
}
