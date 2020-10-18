import { Permission } from '@/decorator/service'
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
}

export default SysTaskService
