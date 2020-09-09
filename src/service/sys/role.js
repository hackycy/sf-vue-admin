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

  @Permission('sys/role/page')
  page(query) {
    return request({
      url: '/sys/role/page',
      method: 'get',
      params: query
    })
  }

  @Permission('sys/role/delete')
  delete(data) {
    return request({
      url: '/sys/role/delete',
      method: 'post',
      data
    })
  }

  @Permission('sys/role/info')
  info(query) {
    return request({
      url: '/sys/role/info',
      method: 'get',
      params: query
    })
  }

  @Permission('sys/role/add')
  add(data) {
    return request({
      url: '/sys/role/add',
      method: 'post',
      data
    })
  }

  @Permission('sys/role/update')
  update(data) {
    return request({
      url: '/sys/role/update',
      method: 'post',
      data
    })
  }
}

export default SysMenuService
