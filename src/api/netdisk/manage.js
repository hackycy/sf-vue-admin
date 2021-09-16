import request from '@/utils/request'
import ManageApi from '@/core/permission/modules/netdisk/manage'

const NETDISK_TIMEOUT_INTERVAL = 60000

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
    data,
    timeout: NETDISK_TIMEOUT_INTERVAL
  })
}

export function renameDirOrFile(data) {
  return request({
    url: ManageApi.rename,
    method: 'post',
    data,
    timeout: NETDISK_TIMEOUT_INTERVAL
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
    data,
    timeout: NETDISK_TIMEOUT_INTERVAL
  })
}

export function getToken() {
  return request({
    url: ManageApi.token,
    method: 'get'
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
    data,
    timeout: NETDISK_TIMEOUT_INTERVAL
  })
}

export function copyFiles(data) {
  return request({
    url: ManageApi.copy,
    method: 'post',
    data,
    timeout: NETDISK_TIMEOUT_INTERVAL
  })
}
