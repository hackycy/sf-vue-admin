import request from '@/utils/request'
import MenuApi from '@/core/permission/modules/sys/menu'

export function getMenuList() {
  return request({
    url: MenuApi.list,
    method: 'get'
  })
}

export function getMenuInfo(query) {
  return request({
    url: MenuApi.info,
    method: 'get',
    params: query
  })
}
