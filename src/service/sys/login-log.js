import { Permission } from '@/core/decorator/service'
import request from '@/utils/request'

class SysLoginLogService {
  @Permission('sys/log/login/page')
  page(query) {
    return request({
      url: '/sys/log/login/page',
      params: query,
      method: 'get'
    })
  }
}

export default SysLoginLogService
