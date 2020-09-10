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

  @Permission('sys/dept/transfer')
  transfer(data) {
    return request({
      url: '/sys/dept/transfer',
      method: 'post',
      data
    })
  }
}

export default SysDeptService
