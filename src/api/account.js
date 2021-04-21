import request from '@/utils/request'

export function updateAccountInfo(data) {
  return request({
    url: 'common/account/update',
    method: 'post',
    data
  })
}
