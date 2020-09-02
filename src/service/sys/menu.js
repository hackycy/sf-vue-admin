import { Service, Permission } from '@/decorator/service'
import request from '@/utils/request'

@Service('sys/menu')
class SysMenuService {
  @Permission('list')
  list() {
    return request({
      url: '/sys/menu/list',
      method: 'get'
    })
  }
}

export default SysMenuService
