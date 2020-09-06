import { Permission } from '@/decorator/service'
import request from '@/utils/request'

class SysMenuService {
  // @Permission('sys/role/list')
  // list() {
  //   return request({
  //     url: '/sys/role/list',
  //     method: 'get'
  //   })
  // }

  @Permission('sys/role/page')
  page(query) {
    return request({
      url: '/sys/role/page',
      method: 'get',
      params: query
    })
  }
}

export default SysMenuService
