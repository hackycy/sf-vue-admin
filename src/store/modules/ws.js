import { EVENT_KICK, EVETN_ONLINE } from '@/core/socket/event-type'
import { SocketIOWrapper, SocketStatus } from '@/core/socket/socket-io'
import { Notification } from 'element-ui'

const state = {
  // socket wrapper 实例
  client: null,
  // socket 连接状态
  status: SocketStatus.CLOSE
}

const mutations = {
  SET_CLIENT(state, client) {
    state.client = client
  },
  SET_STATUS(state, status) {
    if (state.status === status) {
      return
    }
    state.status = status
  }
}

const actions = {
  // 初始化Socket
  initSocket({ commit, state }) {
    // check is init
    if (state.client && state.client.isConnected()) {
      return
    }
    const ws = new SocketIOWrapper()
    // register global event
    ws.subscribe(EVETN_ONLINE, (result) => {
      const { data } = result
      Notification.success(`管理员${data.account}已上线`)
    })
    ws.subscribe(EVENT_KICK, () => {
      Notification.warning('您已被强制下线！')
    })
    commit('SET_CLIENT', ws)
  },

  // 关闭Socket连接
  closeSocket({ commit, state }) {
    state.client && state.client.close()
    commit('SET_CLIENT', null)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
