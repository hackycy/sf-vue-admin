import { isEmpty } from 'lodash'
import IO from 'socket.io-client'
import {
  EVENT_CONNECT,
  EVENT_DISCONNECT
} from './event-type'
import { getToken } from '../../utils/auth'

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
    this.socketInstance = null
    // init
    this._init()
  }

  close() {
    if (this.socketInstance) {
      this.socketInstance.close()
    }
    this.socketInstance = null
  }

  /**
   * SocketIO 初始化
   */
  _init() {
    if (this.socketInstance && this.socketInstance.connected) {
      throw new Error('socket is connecting')
    }
    // auth token
    const token = getToken()
    if (isEmpty(token)) {
      // 未登录状态则直接关闭连接
      this.close()
      return
    }
    // 初始化SocketIO实例
    this.socketInstance = IO(process.env.VUE_APP_BASE_SOCKET_NSP, {
      path: process.env.VUE_APP_BASE_SOCKET_PATH,
      query: { token }
    })
    // connect event
    this.socketInstance.on(EVENT_CONNECT, () => {
      // TODO
    })
    this.socketInstance.on(EVENT_DISCONNECT, () => {
      // TODO
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
