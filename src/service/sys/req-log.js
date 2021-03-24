import { Permission } from '@/core/decorator/service'
import request from '@/utils/request'

class SysReqLogService {
  @Permission('sys/log/req/page')
  page(query) {
    return request({
      url: '/sys/log/req/page',
      params: query,
      method: 'get'
    })
  }
  @Permission('sys/log/req/search')
  search(query) {
    return request({
      url: '/sys/log/req/search',
      params: query,
      method: 'get'
    })
  }
}

export default SysReqLogService
