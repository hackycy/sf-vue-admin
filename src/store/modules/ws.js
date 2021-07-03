import { SocketIOWrapper, SocketStatus } from '@/core/socket/socket-io'

const state = {
  client: null
}

const mutations = {
  SET_CLIENT(state, client) {
    state.client = client
  }
}

const actions = {
  initSocket({ commit, state }) {
    // check is init
    if (state.client && state.client.getStatus() === SocketStatus.CONNECTING) {
      return
    }
    const ws = new SocketIOWrapper()
    commit('SET_CLIENT', ws)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
