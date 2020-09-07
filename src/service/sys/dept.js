import { Permission } from '@/decorator/service'
import request from '@/utils/request'

class SysDeptService {
  @Permission('sys/dept/list')
  list() {
    return request({
      url: '/sys/dept/list',
      method: 'get'
    })
  }
}

export default SysDeptService
