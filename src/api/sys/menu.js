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

export function createMenu(data) {
  return request({
    url: MenuApi.add,
    method: 'post',
    data
  })
}

export function updateMenu(data) {
  return request({
    url: MenuApi.update,
    method: 'post',
    data
  })
}

export function deleteMenu(data) {
  return request({
    url: MenuApi.delete,
    method: 'post',
    data
  })
}
