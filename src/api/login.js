import request from '@/utils/request'

export function login(data) {
  return request({
    url: 'login',
    method: 'post',
    data
  })
}

export function getImageCaptcha(query) {
  return request({
    url: 'captcha/img',
    method: 'get',
    query
  })
}

export function getInfo() {
  return request({
    url: 'person',
    method: 'get'
  })
}

export function permmenu() {
  return request({
    url: 'permmenu',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: 'logout',
    method: 'post'
  })
}
