import request from '@/utils/request'
import LogApi from '@/core/permission/modules/sys/log'

export function getReqLogList(query) {
  return request({
    url: LogApi.req,
    method: 'get',
    params: query
  })
}
