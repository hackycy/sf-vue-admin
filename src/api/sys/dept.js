import request from '@/utils/request'
import DeptApi from '@/core/permission/modules/sys/dept'

export function getDeptList() {
  return request({
    url: DeptApi.list,
    method: 'get'
  })
}

export function moveDeptList(data) {
  return request({
    url: DeptApi.move,
    method: 'post',
    data
  })
}
