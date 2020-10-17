import { Permission } from '@/decorator/service'
import request from '@/utils/request'

class SysTaskService {
  @Permission('sys/task/page')
  page(query) {
    return request({
      url: '/sys/task/page',
      params: query,
      method: 'get'
    })
  }
}

export default SysTaskService
