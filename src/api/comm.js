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

export function permmenu() {
  return request({
    url: '/permmenu'
  })
}
