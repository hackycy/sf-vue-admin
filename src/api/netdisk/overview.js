import request from '@/utils/request'

export function getDesc() {
  return request({
    url: 'netdisk/overview/desc',
    method: 'get'
  })
}
