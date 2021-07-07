import { isEmpty, isFunction } from 'lodash'
import IO from 'socket.io-client'
import {
  EVENT_CONNECT,
  EVENT_DISCONNECT,
  EVENT_RECONNECTING,
  EVENT_ERROR
} from './event-type'
import store from '@/store'
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
  /**
   * socket.io-client reserved event keywords
   * @type {string[]}
   */
  static staticEvents = [
    'connect',
    'error',
    'disconnect',
    'reconnect',
    'reconnect_attempt',
    'reconnecting',
    'reconnect_error',
    'reconnect_failed',
    'connect_error',
    'connect_timeout',
    'connecting',
    'ping',
    'pong'
  ]

  constructor() {
    // socket io client instance
    this.socketInstance = null
    // emit cache queue
    this.emitQueue = []
    // flush will using
    this.runningQueue = []
    this.handleIndex = 0
    this.flushing = false
    this.waiting = false
    // init
    this._init()
  }

  isConnected() {
    return this.socketInstance.connected
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
    this.changeStatus(SocketStatus.CONNECTING)
    // 初始化SocketIO实例
    this.socketInstance = IO(process.env.VUE_APP_BASE_SOCKET_NSP, {
      path: process.env.VUE_APP_BASE_SOCKET_PATH,
      query: { token }
    })
    // register default event
    this.socketInstance.on(EVENT_CONNECT, this.handleConnectEvent.bind(this))
    this.socketInstance.on(EVENT_DISCONNECT, this.handleDisconnectEvent.bind(this))
    this.socketInstance.on(EVENT_RECONNECTING, this.handleReconnectingEvent.bind(this))
    this.socketInstance.on(EVENT_ERROR, this.handleErrorEvent.bind(this))
  }

  /**
   * on custom event
   */
  subscribe(eventName, fn) {
    if (isEmpty(eventName) || !isFunction(fn)) {
      throw new TypeError('param must correct type')
    }
    // register
    this.socketInstance.on(eventName, fn)
  }

  /**
   * off custom event
   */
  unsubscribe(eventName, fn) {
    if (isEmpty(eventName)) {
      throw new TypeError('param must correct type')
    }
    if (SocketIOWrapper.staticEvents.includes(eventName) && !isFunction(fn)) {
      throw new Error('default event remove must has second param')
    }
    this.socketInstance.off(eventName, fn)
  }

  /**
   * 派发事件通知Socket状态
   */
  changeStatus(status) {
    store.commit('ws/SET_STATUS', status)
  }

  /**
   * 默认事件处理
   */
  handleReconnectingEvent() {
    this.changeStatus(SocketStatus.CONNECTING)
  }

  /**
   * 默认事件处理
   */
  handleConnectEvent() {
    this.changeStatus(SocketStatus.CONNECTED)
    // flush queue
    if (this.emitQueue.length > 0) {
      // copy
      const queue = this.emitQueue.slice()
      // clean
      this.emitQueue = []
      for (let i = 0; i < queue.length; i++) {
        this.queueEmit(queue[i])
      }
    }
  }

  /**
   * 默认事件处理
   */
  handleDisconnectEvent() {
    this.changeStatus(SocketStatus.CLOSE)
  }

  /**
   * 默认事件处理
   */
  handleErrorEvent() {
    this.changeStatus(SocketStatus.CLOSE)
  }

  /**
   * client emit
   * The following events are reserved and should not be used as event names by your application:
   * connect、connect_error、connect_timeout、error、disconnect、
   * disconnecting、newListener、reconnect_attempt、reconnecting、reconnect_error、
   * reconnect_failed、removeListener、ping、pong
   */
  emit(eventName, data) {
    // 检查event名称
    if (isEmpty(eventName) || SocketIOWrapper.staticEvents.includes(eventName)) {
      throw new TypeError('event is not allow emit')
    }
    if (!this.isConnected()) {
      // 未连接状态，则缓存，在重新连接时则会执行该队列
      this.emitQueue.push({ eventName, data })
    } else {
      // 连接成功状态
      this.socketInstance.emit(eventName, data)
    }
  }

  /**
   * 重置队列标志状态
   */
  resetState() {
    this.handleIndex = 0
    this.runningQueue = []
    this.waiting = this.flushing = false
  }

  queueEmit(item) {
    if (!this.flushing) {
      this.runningQueue.push(item)
    } else {
      // if flushing
      let i = this.runningQueue.length - 1
      while (i > this.handleIndex) {
        i--
      }
      this.runningQueue.splice(i + 1, 0, item)
    }
    // queue the flush
    if (!this.waiting) {
      this.waiting = true
      setTimeout(this.flushQueue.bind(this), 0)
    }
  }

  flushQueue() {
    this.flushing = true
    let item
    // emit
    for (
      this.handleIndex = 0;
      this.handleIndex < this.runningQueue.length;
      this.handleIndex++
    ) {
      item = this.runningQueue[this.handleIndex]
      // re emit
      this.emit(item.eventName, item.data)
    }

    this.resetState()
  }
}
