import { Permission } from '@/decorator/service'
import request from '@/utils/request'

class SysReqService {
  @Permission('sys/req/page')
  page(query) {
    return request({
      url: '/sys/req/page',
      params: query,
      method: 'get'
    })
  }
  @Permission('sys/req/search')
  search(query) {
    return request({
      url: '/sys/req/search',
      params: query,
      method: 'get'
    })
  }
}

export default SysReqService
