import request from '@/utils/request'

export function updateAccountInfo(data) {
  return request({
    url: 'account/update',
    method: 'post',
    data
  })
}

export function updatePassword(data) {
  return request({
    url: 'account/password',
    method: 'post',
    data
  })
}

export function getInfo() {
  return request({
    url: 'account/info',
    method: 'get'
  })
}

export function permmenu() {
  return request({
    url: 'account/permmenu',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: 'account/logout',
    method: 'post'
  })
}
