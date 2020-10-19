import { Permission } from '@/decorator/service'
import request from '@/utils/request'

class SysTaskLogService {
  @Permission('sys/task-log/page')
  page(query) {
    return request({
      url: '/sys/task-log/page',
      params: query,
      method: 'get'
    })
  }
}

export default SysTaskLogService
