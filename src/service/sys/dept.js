import { Permission } from '@/decorator/service'
import request from '@/utils/request'

class SysDeptService {
  @Permission('sys/dept/list')
  list() {
    return request({
      url: '/sys/dept/list',
      method: 'get'
    })
  }

  @Permission('sys/dept/info')
  info(query) {
    return request({
      url: '/sys/dept/info',
      method: 'get',
      params: query
    })
  }

  @Permission('sys/dept/update')
  update(data) {
    return request({
      url: '/sys/dept/update',
      method: 'post',
      data
    })
  }

  @Permission('sys/dept/add')
  add(data) {
    return request({
      url: '/sys/dept/add',
      method: 'post',
      data
    })
  }

  @Permission('sys/dept/delete')
  delete(data) {
    return request({
      url: '/sys/dept/delete',
      method: 'post',
      data
    })
  }

  @Permission('sys/dept/transfer')
  transfer(data) {
    return request({
      url: '/sys/dept/transfer',
      method: 'post',
      data
    })
  }
}

export default SysDeptService
