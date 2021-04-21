import request from '@/utils/request'

export function login(data) {
  return request({
    url: 'public/login',
    method: 'post',
    data
  })
}

export function getImageCaptcha(query) {
  return request({
    url: 'public/captcha/img',
    method: 'get',
    query
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
