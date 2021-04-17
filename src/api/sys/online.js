import request from '@/utils/request'
import OnlineApi from '@/core/permission/modules/sys/online'

export function getOnlineList() {
  return request({
    url: OnlineApi.list,
    method: 'get'
  })
}

export function kickUser(data) {
  return request({
    url: OnlineApi.kick,
    method: 'post',
    data
  })
}
