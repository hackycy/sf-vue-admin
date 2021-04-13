import request from '@/utils/request'
import UserApi from '@/core/permission/modules/sys/user'

export function getUserListPage(data) {
  return request({
    url: UserApi.page,
    method: 'post',
    data
  })
}
