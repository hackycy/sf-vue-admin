/**
 * example
 * path -> ./modules/user
 * <a-button v-if="$auth('user.add')">Button</a-button>
 * path -> ./modules/sys/user
 * <a-button v-if="$auth('sysUser.add')">Button</a-button>
 * @param Vue
 */
function plugin(Vue) {
  if (plugin.installed) {
    return
  }

  const modulesPermissionFiles = require.context('./modules', true, /\.js$/)

  const modules = modulesPermissionFiles.keys().reduce((modules, modulePath) => {
    // set './app.js' => 'app'
    // set './sys/app.js' => 'sysApp'
    const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
      .replace(/[-_\/][a-z]/ig, s => s.substring(1).toUpperCase())
    const value = modulesPermissionFiles(modulePath).default

    // pass sys/user/add => sys:user:add
    const permissionModule = Object.keys(value).reduce((obj, key) => {
      obj[key] = value[key].replace(/\//g, ':')
      return obj
    }, {})

    modules[moduleName] = permissionModule
    return modules
  }, {})

  // 挂载所有权限列表到实例上
  !Vue.prototype.$permission && (Vue.prototype.$permission = modules)

  // auth
  !Vue.prototype.$auth && Object.defineProperties(Vue.prototype, {
    $auth: {
      get() {
        const _this = this
        return (perm) => {
          const [pm, action] = perm.split('.')
          const permissionList = _this.$store.getters.perms
          if (_this.$permission[pm] && _this.$permission[pm][action]) {
            return permissionList.indexOf(_this.$permission[pm][action]) > -1
          }
          return false
        }
      }
    }
  })
}

export default plugin
