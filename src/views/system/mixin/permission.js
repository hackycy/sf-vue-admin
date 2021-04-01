import { isEmpty, join } from 'lodash'

/**
 * permisson op mixin
 */
export default {
  methods: {
    /**
     * 逗号分隔权限
     * @param {String} perms 例如 sys:user:add,sys:user:update
     * @returns 权限数组
     */
    splitPerms(perms) {
      if (perms) {
        const permsArray = perms.split(',')
        if (permsArray && permsArray.length > 0) {
          return permsArray
        }
      }
      return []
    },
    joinPerms(perms) {
      if (isEmpty(perms)) {
        return ''
      }
      const arr = perms.map(e => {
        return join(e, ':')
      })
      return join(arr, ',')
    },
    /**
     * 渲染菜单至表格
     * @param {Object} menus 所有菜单
     * @param {Object} parentMenu 父级菜单
     */
    filterMenuToTable(menus, parentMenu) {
      const res = []
      menus.forEach(menu => {
        // 根级别菜单渲染
        let realMenu
        if (!parentMenu && !menu.parentId && menu.type === 1) {
          // 根菜单，查找该跟菜单下子菜单，因为可能会包含权限
          const childMenu = this.filterMenuToTable(menus, menu)
          realMenu = { ...menu }
          realMenu.children = childMenu
        } else if (!parentMenu && !menu.parentId && menu.type === 0) {
          // 根目录
          const childMenu = this.filterMenuToTable(menus, menu)
          realMenu = { ...menu }
          realMenu.children = childMenu
        } else if (parentMenu && parentMenu.id === menu.parentId && menu.type === 1) {
          // 子菜单下继续找是否有子菜单
          const childMenu = this.filterMenuToTable(menus, menu)
          realMenu = { ...menu }
          realMenu.children = childMenu
        } else if (parentMenu && parentMenu.id === menu.parentId && menu.type === 0) {
          // 如果还是目录，继续递归
          const childMenu = this.filterMenuToTable(menus, menu)
          realMenu = { ...menu }
          realMenu.children = childMenu
        } else if (parentMenu && parentMenu.id === menu.parentId && menu.type === 2) {
          realMenu = { ...menu }
        }
        // add curent route
        if (realMenu) {
          realMenu.pid = menu.id
          res.push(realMenu)
        }
      })
      return res
    }
  }
}
