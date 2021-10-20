import request from '@/utils/request'
import { PermissionAction, PermissionPrefix } from '@/core/permission/decorator'

@PermissionPrefix('sys/role')
class SysRole {
  @PermissionAction()
  info(query) {
    return request({
      url: 'sys/role/info',
      method: 'get',
      params: query
    })
  }

  @PermissionAction()
  list() {
    return request({
      url: 'sys/role/list',
      method: 'get'
    })
  }

  @PermissionAction()
  page(query) {
    return request({
      url: 'sys/role/page',
      method: 'get',
      params: query
    })
  }

  @PermissionAction()
  add(data) {
    return request({
      url: 'sys/role/add',
      method: 'post',
      data
    })
  }

  @PermissionAction()
  update(data) {
    return request({
      url: 'sys/role/update',
      method: 'post',
      data
    })
  }

  @PermissionAction()
  delete(data) {
    return request({
      url: 'sys/role/delete',
      method: 'post',
      data
    })
  }
}

export default SysRole
