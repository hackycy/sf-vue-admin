import { toHump } from '@/utils'
import store from '@/store'
import { checkPermission } from './check-permission'

/**
 * example
 * path -> ./modules/user
 * <a-button v-if="$auth('user.add')">Button</a-button>
 * path -> ./modules/sys/user
 * <a-button v-if="$auth('sys.user.add')">Button</a-button>
 * @param Vue
 */
function plugin(Vue) {
  if (plugin.installed) {
    return
  }

  const apiModules = {}

  // 查找所有api列表下以 .class.js 后缀的文件定义
  const modulesPermissionFiles = require.context('@/api/', true, /\.class\.js$/)

  // result like this ['./netdisk/test.class.js']
  modulesPermissionFiles.keys().forEach(path => {
    // 格式转换
    const pathList = path
      .substr(2) // 去除 ./ 前缀
      .replace('.class.js', '') // 移除文件后缀名
      .split('/') // 切割
      .map(e => {
        // 转换驼峰
        return toHump(e)
      })

    // 获取父级文件夹名称
    const parents = pathList.slice(0, pathList.length - 1)
    const name = pathList[pathList.length - 1]

    const n = path.replace('./', '')
    const Rqd = require(`@/api/${n}`).default

    if (!Rqd) {
      throw new Error('use .class.js must export default class')
    }

    // 实例化
    const instance = new Rqd()

    if (parents.length <= 0) {
      // 无父级路径时
      apiModules[name] = instance
    } else {
      // 将路径转化为对象
      let cur = apiModules

      parents.forEach(k => {
        if (!cur[k]) {
          cur[k] = {}
        }

        cur = cur[k]
      })

      cur[name] = instance
    }
  })

  // 挂载所有权限列表到实例上
  !Vue.prototype.$api && (Vue.prototype.$api = apiModules)
  !store.$api && (store.$api = apiModules)

  // 返回一个函数进行判断是否有该权限 例如 $auth('sys.user.add')
  !Vue.prototype.$auth &&
    Object.defineProperties(Vue.prototype, {
      $auth: {
        get() {
          return checkPermission
        }
      }
    })
}

export default plugin
