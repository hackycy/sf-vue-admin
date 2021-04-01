import request from '@/utils/request'
import MenuApi from '@/core/permission/modules/sys/menu'

export function getMenuList() {
  return request({
    url: MenuApi.list,
    method: 'get'
  })
}
