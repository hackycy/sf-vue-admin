import request from '@/utils/request'
import TaskApi from '@/core/permission/modules/sys/task'

export function getTaskList(query) {
  return request({
    url: TaskApi.page,
    params: query,
    method: 'get'
  })
}
