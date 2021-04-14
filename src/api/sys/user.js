import request from '@/utils/request'
import UserApi from '@/core/permission/modules/sys/user'

export function getUserListPage(data) {
  return request({
    url: UserApi.page,
    method: 'post',
    data
  })
}

export function createUser(data) {
  return request({
    url: UserApi.add,
    method: 'post',
    data
  })
}

export function getUserInfo(query) {
  return request({
    url: UserApi.info,
    method: 'get',
    params: query
  })
}

export function updateUser(data) {
  return request({
    url: UserApi.update,
    method: 'post',
    data
  })
}
