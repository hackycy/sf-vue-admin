import request from '@/utils/request'
import { PermissionAction, PermissionPrefix } from '@/core/permission/decorator'

@PermissionPrefix('sys/task')
class SysTask {
  @PermissionAction()
  page(query) {
    return request({
      url: 'sys/task/page',
      params: query,
      method: 'get'
    })
  }

  @PermissionAction()
  info(query) {
    return request({
      url: 'sys/task/info',
      params: query,
      method: 'get'
    })
  }

  @PermissionAction()
  add(data) {
    return request({
      url: 'sys/task/add',
      method: 'post',
      data
    })
  }

  @PermissionAction()
  delete(data) {
    return request({
      url: 'sys/task/delete',
      method: 'post',
      data
    })
  }

  @PermissionAction()
  update(data) {
    return request({
      url: 'sys/task/update',
      method: 'post',
      data
    })
  }

  @PermissionAction()
  once(data) {
    return request({
      url: 'sys/task/once',
      method: 'post',
      data
    })
  }

  @PermissionAction()
  start(data) {
    return request({
      url: 'sys/task/start',
      method: 'post',
      data
    })
  }

  @PermissionAction()
  stop(data) {
    return request({
      url: 'sys/task/stop',
      method: 'post',
      data
    })
  }
}

export default SysTask
