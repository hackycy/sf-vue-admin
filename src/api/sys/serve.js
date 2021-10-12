import request from '@/utils/request'

export function getServeStat() {
  return request({
    url: 'sys/serve/stat',
    method: 'get'
  })
}
