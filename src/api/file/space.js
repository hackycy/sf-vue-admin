import request from '@/utils/request'
import FileSpaceApi from '@/core/permission/modules/file/space'

export function getFileList(query) {
  return request({
    url: FileSpaceApi.list,
    method: 'get',
    params: query
  })
}
