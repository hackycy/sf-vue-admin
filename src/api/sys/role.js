import request from '@/utils/request'
import RoleApi from '@/core/permission/modules/sys/role'

export function getRoleList() {
  return request({
    url: RoleApi.list,
    method: 'get'
  })
}

export function getRoleListByPage(query) {
  return request({
    url: RoleApi.page,
    method: 'get'
  })
}
