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

  @Permission('update')
  update(data) {
    return request({
      url: '/sys/menu/update',
      method: 'post',
      data: data
    })
  }
}

export default SysMenuService
