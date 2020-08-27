import request from '@/utils/request'

export function getCaptchaImg(query) {
  return request({
    url: '/comm/captcha/img',
    method: 'get',
    params: query
  })
}
