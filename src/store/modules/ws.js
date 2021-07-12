import { EVENT_KICK } from '@/core/socket/event-type'
import { SocketIOWrapper, SocketStatus } from '@/core/socket/socket-io'
import { MessageBox } from 'element-ui'

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
  initSocket({ commit, state, dispatch }) {
    // check is init
    if (state.client && state.client.isConnected()) {
      return
    }
    const ws = new SocketIOWrapper()
    ws.subscribe(EVENT_KICK, async(data) => {
      // reset token
      await dispatch('user/resetToken', null, { root: true })
      MessageBox.confirm(`您已被管理员${data.operater}踢下线！`, '警告', {
        confirmButtonText: '重新登录',
        cancelButtonText: '取消',
        type: 'warning'
      }).finally(() => {
        // 刷新页面
        window.location.reload()
      })
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
