import request from '@/utils/request'

export function getInfo(token) {
  return request({
    url: '/sys/user/info',
    method: 'post'
  })
}

export function logout() {
  return request({
    url: '/vue-element-admin/user/logout',
    method: 'post'
  })
}
