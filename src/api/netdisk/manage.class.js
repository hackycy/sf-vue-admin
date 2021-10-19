import request from '@/utils/request'
import { PermissionAction, PermissionPrefix } from '@/core/permission/decorator'

const NETDISK_TIMEOUT_INTERVAL = 60000

@PermissionPrefix('netdisk/manage')
class NetdiskManage {
  @PermissionAction()
  list(query) {
    return request({
      url: 'netdisk/manage/list',
      method: 'get',
      params: query
    })
  }

  @PermissionAction()
  mkdir(data) {
    return request({
      url: 'netdisk/manage/mkdir',
      method: 'post',
      data
    })
  }

  @PermissionAction()
  rename(data) {
    return request({
      url: 'netdisk/manage/rename',
      method: 'post',
      data,
      timeout: NETDISK_TIMEOUT_INTERVAL
    })
  }

  @PermissionAction()
  download(data) {
    return request({
      url: 'netdisk/manage/download',
      method: 'post',
      data
    })
  }

  @PermissionAction()
  delete(data) {
    return request({
      url: 'netdisk/manage/delete',
      method: 'post',
      data,
      timeout: NETDISK_TIMEOUT_INTERVAL
    })
  }

  @PermissionAction()
  token() {
    return request({
      url: 'netdisk/manage/token',
      method: 'get'
    })
  }

  @PermissionAction()
  info(data) {
    return request({
      url: 'netdisk/manage/info',
      method: 'post',
      data
    })
  }

  @PermissionAction()
  mark(data) {
    return request({
      url: 'netdisk/manage/mark',
      method: 'post',
      data
    })
  }

  @PermissionAction()
  cut(data) {
    return request({
      url: 'netdisk/manage/cut',
      method: 'post',
      data,
      timeout: NETDISK_TIMEOUT_INTERVAL
    })
  }

  @PermissionAction()
  copy(data) {
    return request({
      url: 'netdisk/manage/copy',
      method: 'post',
      data,
      timeout: NETDISK_TIMEOUT_INTERVAL
    })
  }
}

export default NetdiskManage
