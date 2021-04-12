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

export function deleteDept(data) {
  return request({
    url: DeptApi.delete,
    method: 'post',
    data
  })
}

export function updateDept(data) {
  return request({
    url: DeptApi.update,
    method: 'post',
    data
  })
}

export function createDept(data) {
  return request({
    url: DeptApi.add,
    method: 'post',
    data
  })
}

export function getDeptInfo(query) {
  return request({
    url: DeptApi.info,
    method: 'get',
    params: query
  })
}
