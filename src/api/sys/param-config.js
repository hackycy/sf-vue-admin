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

export function updateParamConfig(data) {
  return request({
    url: ParamConfigApi.update,
    method: 'post',
    data
  })
}

export function deleteParamConfig(data) {
  return request({
    url: ParamConfigApi.delete,
    method: 'post',
    data
  })
}
