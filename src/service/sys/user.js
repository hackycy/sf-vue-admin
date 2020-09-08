import { Permission } from '@/decorator/service'
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
}

export default UserService
