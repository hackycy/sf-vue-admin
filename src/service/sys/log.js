import { Permission } from '@/decorator/service'
import request from '@/utils/request'

class SysLogService {
  @Permission('sys/log/page')
  page(query) {
    return request({
      url: '/sys/log/page',
      params: query,
      method: 'get'
    })
  }
}

export default SysLogService
