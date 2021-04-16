import request from '@/utils/request'
import RoleApi from '@/core/permission/modules/sys/role'

export function getRoleInfo(query) {
  return request({
    url: RoleApi.info,
    method: 'get',
    params: query
  })
}

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

export function createRole(data) {
  return request({
    url: RoleApi.add,
    method: 'post',
    data
  })
}

export function updateRole(data) {
  return request({
    url: RoleApi.update,
    method: 'post',
    data
  })
}

export function deleteRole(data) {
  return request({
    url: RoleApi.delete,
    method: 'post',
    data
  })
}
