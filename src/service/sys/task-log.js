import { Permission } from '@/core/decorator/service'
import request from '@/utils/request'

class SysTaskLogService {
  @Permission('sys/log/task/page')
  page(query) {
    return request({
      url: '/sys/log/task/page',
      params: query,
      method: 'get'
    })
  }
}

export default SysTaskLogService
