import request from '@/utils/request'

export function updateAccountInfo(data) {
  return request({
    url: 'common/account/update',
    method: 'post',
    data
  })
}

export function getInfo() {
  return request({
    url: 'common/account/info',
    method: 'get'
  })
}

export function permmenu() {
  return request({
    url: 'common/account/permmenu',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: 'common/account/logout',
    method: 'post'
  })
}
