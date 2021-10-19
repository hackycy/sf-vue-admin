import request from '@/utils/request'
import { PermissionAction, PermissionPrefix } from '@/core/permission/decorator'

@PermissionPrefix('sys/param-config')
class SysParamConfig {
  @PermissionAction()
  page(query) {
    return request({
      url: 'sys/param-config/page',
      method: 'get',
      params: query
    })
  }

  @PermissionAction()
  info(query) {
    return request({
      url: 'sys/param-config/info',
      method: 'get',
      params: query
    })
  }

  @PermissionAction()
  add(data) {
    return request({
      url: 'sys/param-config/add',
      method: 'post',
      data
    })
  }

  @PermissionAction()
  update(data) {
    return request({
      url: 'sys/param-config/update',
      method: 'post',
      data
    })
  }

  @PermissionAction()
  delete(data) {
    return request({
      url: 'sys/param-config/delete',
      method: 'post',
      data
    })
  }
}

export default SysParamConfig
