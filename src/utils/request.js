import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

const UNKNOWN_ERROR = '未知错误，请重试'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 10000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['Authorization'] = getToken()
    }
    return config
  },
  error => {
    // do something with request error

    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data

    // if the custom code is not 200, it is judged as an error.
    if (res.code !== 200) {
      Message({
        message: res.message || UNKNOWN_ERROR,
        type: 'error',
        duration: 5 * 1000
      })

      // Illegal token
      if (res.code === 11001 || res.code === 11002) {
        // to re-login
        MessageBox.confirm(res.message || '账号异常，您可以取消停留在该页上，或重新登录', '警告', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        }).catch(() => {})
      }

      // throw other
      const error = new Error(res.message || UNKNOWN_ERROR)
      error.code = res.code
      return Promise.reject(error)
    } else {
      return res
    }
  },
  error => {
    // 处理 422 或者 500 的错误异常提示
    let errMsg
    if (error && error.response) {
      switch (error.response.status) {
        case 422:
          errMsg = `参数错误：${error.response.data.message}`
          break
        case 500:
          errMsg = '服务器异常，请稍后再试！'
          break
      }
    }
    Message({
      message: errMsg ?? UNKNOWN_ERROR,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
