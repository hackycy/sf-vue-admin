import { Permission } from '@/core/decorator/service'
import request from '@/utils/request'

class UserService {
  @Permission('sys/user/page')
  page(query) {
    return request({
      url: '/sys/user/page',
      method: 'get',
      params: query
    })
  }

  @Permission('sys/user/delete')
  delete(data) {
    return request({
      url: '/sys/user/delete',
      method: 'post',
      data
    })
  }

  @Permission('sys/user/add')
  add(data) {
    return request({
      url: '/sys/user/add',
      method: 'post',
      data
    })
  }

  @Permission('sys/user/info')
  info(query) {
    return request({
      url: '/sys/user/info',
      method: 'get',
      params: query
    })
  }

  @Permission('sys/user/update')
  update(data) {
    return request({
      url: '/sys/user/update',
      method: 'post',
      data
    })
  }
}

export default UserService
