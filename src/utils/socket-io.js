// import { isEmpty } from 'lodash'
import IO from 'socket.io-client'
import { getToken } from './auth'

export const EVENT_CONNECT = 'connect'
export const EVENT_DISCONNECT = 'disconnect'

/**
 * Socket连接状态
 */
export const SocketStatus = {
  // 连接中
  CONNECTING: 'CONNECTING',
  // 已连接
  CONNECTED: 'CONNECTED',
  // 已关闭
  CLOSE: 'CLOSE'
}

export class SocketIOWrapper {
  constructor() {
    this.status = SocketStatus.CONNECTING
    // init
    this._init()
  }

  changeStatus(status) {
    this.status = status
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
    this.socketInstance = IO(process.env.VUE_APP_BASE_SOCKET_NSP, {
      path: process.env.VUE_APP_BASE_SOCKET_PATH,
      query: { token }
    })
    // connect event
    this.socketInstance.on(EVENT_CONNECT, (socket) => {
      this.changeStatus(SocketStatus.CONNECTED)
    })
    // 监听服务端发送close事件，则手动关闭
    this.socketInstance.on(EVENT_DISCONNECT, () => {
      // close
      this.changeStatus(SocketStatus.CLOSE)
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
