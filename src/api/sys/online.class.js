import request from '@/utils/request'
import { PermissionAction, PermissionPrefix } from '@/core/permission/decorator'

@PermissionPrefix('sys/online')
class SysOnline {
  @PermissionAction()
  list() {
    return request({
      url: 'sys/online/list',
      method: 'get'
    })
  }

  @PermissionAction()
  kick(data) {
    return request({
      url: 'sys/online/kick',
      method: 'post',
      data
    })
  }
}

export default SysOnline
