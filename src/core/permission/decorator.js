import { isString } from 'lodash'

/**
 * 权限点，例如 add
 * 会与prefix 拼接组成 例如：sys/user/add
 */
export function PermissionAction(action) {
  return function(target, propertyKey, _) {
    const realAction = action || propertyKey

    if (!target._permission) {
      target._permission = {}
    }

    // 延迟执行
    setTimeout(() => {
      // 挂载权限点
      target._permission[propertyKey] =
        (`${target.$permissonPrefix ? target.$permissonPrefix + '/' : ''}${realAction}`).replace(/\//g, ':')
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
