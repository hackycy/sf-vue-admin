import { Permission } from '@/core/decorator/service'
import request from '@/utils/request'

class SysLoginLogService {
  @Permission('sys/login-log/page')
  page(query) {
    return request({
      url: '/sys/login-log/page',
      params: query,
      method: 'get'
    })
  }
}

export default SysLoginLogService
