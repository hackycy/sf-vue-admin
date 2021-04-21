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
