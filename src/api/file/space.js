import request from '@/utils/request'
import FileSpaceApi from '@/core/permission/modules/file/space'

export function getFileList(query) {
  return request({
    url: FileSpaceApi.list,
    method: 'get',
    params: query
  })
}

export function createDir(data) {
  return request({
    url: FileSpaceApi.mkdir,
    method: 'post',
    data
  })
}

export function renameDirOrFile(data) {
  return request({
    url: FileSpaceApi.rename,
    method: 'post',
    data
  })
}

export function getDownloadLink(data) {
  return request({
    url: FileSpaceApi.download,
    method: 'post',
    data
  })
}

export function getToken() {
  return request({
    url: FileSpaceApi.token,
    method: 'get'
  })
}
