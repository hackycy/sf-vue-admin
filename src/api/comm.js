import request from '@/utils/request'

export function getCaptchaImg(query) {
  return request({
    url: '/captcha/img',
    method: 'get',
    params: query
  })
}

export function login(data) {
  return request({
    url: '/login',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: '/logout',
    method: 'post'
  })
}

export function permmenu() {
  return request({
    url: '/permmenu'
  })
}

export function person() {
  return request({
    url: '/person'
  })
}
