import { Permission } from '@/decorator/service'
import request from '@/utils/request'

class SysMenuService {
  @Permission('sys/menu/list')
  list() {
    return request({
      url: '/sys/menu/list',
      method: 'get'
    })
  }

  @Permission('sys/menu/update')
  update(data) {
    return request({
      url: '/sys/menu/update',
      method: 'post',
      data
    })
  }

  @Permission('sys/menu/add')
  add(data) {
    return request({
      url: '/sys/menu/add',
      method: 'post',
      data
    })
  }
}

export default SysMenuService
