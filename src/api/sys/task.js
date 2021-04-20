import request from '@/utils/request'
import TaskApi from '@/core/permission/modules/sys/task'

export function getTaskList(query) {
  return request({
    url: TaskApi.page,
    params: query,
    method: 'get'
  })
}

export function getTaskInfo(query) {
  return request({
    url: TaskApi.info,
    params: query,
    method: 'get'
  })
}

export function createTask(data) {
  return request({
    url: TaskApi.add,
    method: 'post',
    data
  })
}

export function deleteTask(data) {
  return request({
    url: TaskApi.delete,
    method: 'post',
    data
  })
}

export function updateTask(data) {
  return request({
    url: TaskApi.update,
    method: 'post',
    data
  })
}

export function execOnceTask(data) {
  return request({
    url: TaskApi.once,
    method: 'post',
    data
  })
}

export function startTask(data) {
  return request({
    url: TaskApi.start,
    method: 'post',
    data
  })
}

export function stopTask(data) {
  return request({
    url: TaskApi.stop,
    method: 'post',
    data
  })
}
