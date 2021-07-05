import { SocketIOWrapper, SocketStatus } from '@/core/socket/socket-io'

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
    commit('SET_CLIENT', ws)
  },

  // 关闭Socket连接
  closeSocket({ commit, state }) {
    if (state.client && state.client.getStatus() === SocketStatus.CONNECTED) {
      state.client.close()
    }
    commit('SET_CLIENT', null)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
