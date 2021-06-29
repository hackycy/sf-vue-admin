// import { isEmpty } from 'lodash'
import IO from 'socket.io-client'
import { getToken } from './auth'

export const EVENT_CONNECT = 'connect'
export const EVENT_DISCONNECT = 'disconnect'

export class ScoketIOWrapper {
  constructor() {
    this.closeWs = false
    // init
    this._init()
  }

  /**
   * 是否已经连接成功
   */
  isInit() {
    return !this.closeWs
  }

  /**
   * SocketIO 初始化
   */
  _init() {
    if (this.closeWs) {
      throw new Error('socket is closed')
    }
    const token = getToken()
    // if (isEmpty(token)) {
    //   // 未登录状态下禁止连接
    //   this.closeWs = true
    //   return
    // }
    // 初始化实例
    this.socketInstance = IO({
      path: '/ws',
      query: { token }
    })
    // connect event
    this.socketInstance.on(EVENT_CONNECT, (socket) => {
      this.id = socket.id
      console.log(this.id)
    })
    // 监听服务端发送close事件，则手动关闭
    this.socketInstance.on(EVENT_DISCONNECT, () => {
      // close
      this.closeWs = true
      this.socketInstance.close()
    })
  }

  /**
   * client emit
   * The following events are reserved and should not be used as event names by your application:
   * connect、connect_error、connect_timeout、error、disconnect、
   * disconnecting、newListener、reconnect_attempt、reconnecting、reconnect_error、
   * reconnect_failed、removeListener、ping、pong
   */
  emit(eventName, ...args) {
    this.socketInstance.emit(eventName, args)
  }
}
