import { Permission } from '@/decorator/service'
import request from '@/utils/request'

class SysReqLogService {
  @Permission('sys/req-log/page')
  page(query) {
    return request({
      url: '/sys/req-log/page',
      params: query,
      method: 'get'
    })
  }
  @Permission('sys/req-log/search')
  search(query) {
    return request({
      url: '/sys/req-log/search',
      params: query,
      method: 'get'
    })
  }
}

export default SysReqLogService
