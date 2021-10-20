import request from '@/utils/request'
import { PermissionAction, PermissionPrefix } from '@/core/permission/decorator'

@PermissionPrefix('sys/menu')
class SysMenu {
  @PermissionAction()
  list() {
    return request({
      url: 'sys/menu/list',
      method: 'get'
    })
  }

  @PermissionAction()
  info(query) {
    return request({
      url: 'sys/menu/info',
      method: 'get',
      params: query
    })
  }

  @PermissionAction()
  add(data) {
    return request({
      url: 'sys/menu/add',
      method: 'post',
      data
    })
  }

  @PermissionAction()
  update(data) {
    return request({
      url: 'sys/menu/update',
      method: 'post',
      data
    })
  }

  @PermissionAction()
  delete(data) {
    return request({
      url: 'sys/menu/delete',
      method: 'post',
      data
    })
  }
}

export default SysMenu
