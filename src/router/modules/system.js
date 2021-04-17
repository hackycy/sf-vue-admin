/**
 * system module
 */
export default {
  'views/system/permission/menu': () => import('@/views/system/permission/menu'),
  'views/system/permission/user': () => import('@/views/system/permission/user'),
  'views/system/permission/role': () => import('@/views/system/permission/role'),
  'views/system/monitor/req-log': () => import('@/views/system/monitor/req-log'),
  'views/system/monitor/online': () => import('@/views/system/monitor/online'),
  'views/system/monitor/login-log': () => import('@/views/system/monitor/login-log')
}
