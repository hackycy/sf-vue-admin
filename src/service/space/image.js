import { Permission } from '@/core/decorator/service'
import request from '@/utils/request'

class ImageSpaceService {
  @Permission('space/image/type/list')
  type() {
    return request({
      url: '/space/image/type/list',
      method: 'get'
    })
  }

  @Permission('space/image/type/add')
  addType(data) {
    return request({
      url: '/space/image/type/add',
      method: 'post',
      data
    })
  }

  @Permission('space/image/type/delete')
  deleteType(data) {
    return request({
      url: '/space/image/type/delete',
      method: 'post',
      data
    })
  }

  @Permission('space/image/page')
  page(query) {
    return request({
      url: '/space/image/page',
      method: 'get',
      params: query
    })
  }

  @Permission('space/image/delete')
  delete(data) {
    return request({
      url: '/space/image/delete',
      method: 'post',
      data
    })
  }

  @Permission('space/image/upload')
  upload(data) {
    return request({
      url: '/space/image/upload',
      method: 'post',
      data
    })
  }
}

export default ImageSpaceService
