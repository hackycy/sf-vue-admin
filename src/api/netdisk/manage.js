import request from '@/utils/request'
import ManageApi from '@/core/permission/modules/netdisk/manage'

export function getFileList(query) {
  return request({
    url: ManageApi.list,
    method: 'get',
    params: query
  })
}

export function createDir(data) {
  return request({
    url: ManageApi.mkdir,
    method: 'post',
    data
  })
}

export function renameDirOrFile(data) {
  return request({
    url: ManageApi.rename,
    method: 'post',
    data
  })
}

export function getDownloadLink(data) {
  return request({
    url: ManageApi.download,
    method: 'post',
    data
  })
}

export function deleteFileOrDir(data) {
  return request({
    url: ManageApi.delete,
    method: 'post',
    data
  })
}

export function getToken() {
  return request({
    url: ManageApi.token,
    method: 'get'
  })
}

export function checkTaskStatus(data) {
  return request({
    url: ManageApi.check,
    method: 'post',
    data
  })
}

export function getFileDetailInfo(data) {
  return request({
    url: ManageApi.info,
    method: 'post',
    data
  })
}

export function updateFileMark(data) {
  return request({
    url: ManageApi.mark,
    method: 'post',
    data
  })
}

export function cutFiles(data) {
  return request({
    url: ManageApi.cut,
    method: 'post',
    data
  })
}

export function copyFiles(data) {
  return request({
    url: ManageApi.copy,
    method: 'post',
    data
  })
}
