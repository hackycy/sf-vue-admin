import { Permission } from '@/decorator/service'
import request from '@/utils/request'

class ImageSpaceService {
  @Permission('space/image/type')
  type() {
    return request({
      url: '/space/image/type',
      method: 'get'
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
