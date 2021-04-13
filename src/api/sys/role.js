import request from '@/utils/request'
import RoleApi from '@/core/permission/modules/sys/role'

export function getRoleList() {
  return request({
    url: RoleApi.list,
    method: 'get'
  })
}
