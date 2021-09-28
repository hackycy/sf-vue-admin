import request from '@/utils/request'
import ParamConfigApi from '@/core/permission/modules/sys/param-config'

export function getParamConfigList(query) {
  return request({
    url: ParamConfigApi.page,
    method: 'get',
    params: query
  })
}

export function getParamConfigInfo(query) {
  return request({
    url: ParamConfigApi.info,
    method: 'get',
    params: query
  })
}

export function createParamConfig(data) {
  return request({
    url: ParamConfigApi.add,
    method: 'post',
    data
  })
}
