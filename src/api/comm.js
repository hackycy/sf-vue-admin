import request from '@/utils/request'

export function getCaptchaImg(query) {
  return request({
    url: '/comm/captcha/img',
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
