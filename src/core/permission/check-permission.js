import store from '@/store'

/**
 * 根据给定值判断是否具有该权限 例如给定 sys.dept.add
 */
export function checkPermission(perm) {
  try {
    const permissionList = store.getters.perms

    // 转换获取真实的权限名称
    const pms = perm.split('.')
    let permissionName = null
    let cur = store.$api
    for (let i = 0; i < pms.length; i++) {
      if (i < pms.length - 1) {
        cur = cur[pms[i]]
      } else {
        permissionName = cur._permission[pms[i]]
      }
    }

    // 判断是否存在
    return permissionList.indexOf(permissionName) > -1
  } catch (e) {
    return false
  }
}
