import request from '@/utils/request'
import { PermissionAction, PermissionPrefix } from '@/core/permission/decorator'

@PermissionPrefix('sys/log')
class SysLog {
  @PermissionAction('login/page')
  loginPage(query) {
    return request({
      url: 'sys/log/login/page',
      method: 'get',
      params: query
    })
  }

  @PermissionAction('task/page')
  taskPage(query) {
    return request({
      url: 'sys/log/task/page',
      method: 'get',
      params: query
    })
  }
}

export default SysLog
