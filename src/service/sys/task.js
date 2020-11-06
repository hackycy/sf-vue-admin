import { Permission } from '@/core/decorator/service'
import request from '@/utils/request'

class SysTaskService {
  @Permission('sys/task/page')
  page(query) {
    return request({
      url: '/sys/task/page',
      params: query,
      method: 'get'
    })
  }

  @Permission('sys/task/info')
  info(data) {
    return request({
      url: '/sys/task/info',
      method: 'post',
      data
    })
  }

  @Permission('sys/task/update')
  update(data) {
    return request({
      url: '/sys/task/update',
      method: 'post',
      data
    })
  }

  @Permission('sys/task/add')
  add(data) {
    return request({
      url: '/sys/task/add',
      method: 'post',
      data
    })
  }

  @Permission('sys/task/delete')
  delete(data) {
    return request({
      url: '/sys/task/delete',
      method: 'post',
      data
    })
  }

  @Permission('sys/task/stop')
  stop(data) {
    return request({
      url: '/sys/task/stop',
      method: 'post',
      data
    })
  }

  @Permission('sys/task/start')
  start(data) {
    return request({
      url: '/sys/task/start',
      method: 'post',
      data
    })
  }

  @Permission('sys/task/once')
  once(data) {
    return request({
      url: '/sys/task/once',
      method: 'post',
      data
    })
  }
}

export default SysTaskService
