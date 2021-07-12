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
