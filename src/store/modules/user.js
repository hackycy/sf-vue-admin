import { login, logout, getInfo, permmenu } from '@/api/login'
import { setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const state = {
  token: '',
  name: '',
  avatar: '',
  // like [ 'sys:user:add', 'sys:user:update' ]
  perms: []
}

const mutations = {
  RESET_STATE: state => {
    state.token = ''
    state.name = ''
    state.avatar = ''
    state.perms = []
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_PERMS: (state, perms) => {
    state.perms = perms
  }
}

const actions = {
  // 管理员登录
  login({ commit }, loginInfo) {
    const { username, password, captchaId, verifyCode } = loginInfo
    return new Promise((resolve, reject) => {
      login({
        username: username.trim(),
        password: password.trim(),
        captchaId: captchaId.trim(),
        verifyCode: verifyCode.trim()
      })
        .then(response => {
          const { data } = response
          commit('SET_TOKEN', data.token)
          setToken(data.token)
          resolve()
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  // get user info
  getInfo({ commit }) {
    return new Promise((resolve, reject) => {
      Promise.all([permmenu(), getInfo()]).then((results) => {
        const pm = results[0].data
        const info = results[1].data
        const { perms, menus } = pm

        // set store
        commit('SET_PERMS', perms)
        commit('SET_NAME', info.name)
        commit('SET_AVATAR', info.headImg)

        resolve({ menus, perms, user: info })
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 管理员退出
  logout({ commit, dispatch }) {
    return new Promise((resolve, reject) => {
      logout()
        .then(() => {
          // 清除localstorage存储的token
          removeToken()

          // 清除store存储的routes
          dispatch('permission/resetRoutes', null, { root: true })

          // clean vue-router
          resetRouter()
          commit('RESET_STATE')
          resolve()
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  // 清除token
  resetToken({ commit, dispatch }) {
    return new Promise(resolve => {
      // 清除localstorage存储的token
      removeToken()

      // 清除store存储的routes
      dispatch('permission/resetRoutes', null, { root: true })

      // clean vue-router
      resetRouter()
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
