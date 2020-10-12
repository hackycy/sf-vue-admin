import { Permission } from '@/decorator/service'
import request from '@/utils/request'

class OnlineService {
  @Permission('sys/online/list')
  list() {
    return request({
      url: '/sys/online/list',
      method: 'get'
    })
  }
}

export default OnlineService
