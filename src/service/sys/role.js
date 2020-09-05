import { Permission } from '@/decorator/service'
import request from '@/utils/request'

class SysMenuService {
  @Permission('sys/role/list')
  list() {
    return request({
      url: '/sys/role/list',
      method: 'get'
    })
  }
}

export default SysMenuService
