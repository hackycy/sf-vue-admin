import request from '@/utils/request'
import LogApi from '@/core/permission/modules/sys/log'

export function getReqLogList(query) {
  return request({
    url: LogApi.req,
    method: 'get',
    params: query
  })
}

export function getLoginLogList(query) {
  return request({
    url: LogApi.login,
    method: 'get',
    params: query
  })
}

export function getTaskLogList(query) {
  return request({
    url: LogApi.task,
    method: 'get',
    params: query
  })
}
