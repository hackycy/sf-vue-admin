import { Permission } from '@/core/decorator/service'
import request from '@/utils/request'

class OnlineService {
  @Permission('sys/online/list')
  list() {
    return request({
      url: '/sys/online/list',
      method: 'get'
    })
  }

  @Permission('sys/online/kick')
  kick(data) {
    return request({
      url: '/sys/online/kick',
      method: 'post',
      data
    })
  }
}

export default OnlineService
