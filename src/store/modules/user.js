import { login, permmenu, person, logout } from '@/api/comm'
import { aesEncrypt } from '@/utils/crypto'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const state = {
  token: getToken(),
  name: '',
  avatar: '',
  perms: []
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  // SET_INTRODUCTION: (state, introduction) => {
  //   state.introduction = introduction
  // },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  // SET_ROLES: (state, roles) => {
  //   state.roles = roles
  // },
  SET_PERMS: (state, perms) => {
    state.perms = perms
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password, captchaId, verifyCode } = userInfo
    return new Promise((resolve, reject) => {
      const encryptUsername = aesEncrypt(username.trim())
      const encryptPassword = aesEncrypt(password.trim())
      login({ username: encryptUsername, password: encryptPassword, captchaId: captchaId.trim(), verifyCode: verifyCode.trim() })
        .then(response => {
          const { data } = response
          commit('SET_TOKEN', data.token)
          setToken(data.token)
          resolve()
        }).catch(error => {
          reject(error)
        })
    })
  },

  // get user info
  getInfo({ commit }) {
    return new Promise((resolve, reject) => {
      Promise.all([permmenu(), person()]).then((results) => {
        const pm = results[0].data
        const info = results[1].data
        if (!pm || !info) {
          reject('Verification failed, please Login again.')
        }
        const { perms } = pm
        commit('SET_PERMS', perms)
        commit('SET_NAME', info.name)
        commit('SET_AVATAR', info.headImg)
        resolve({ ...pm, user: info })
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, dispatch }) {
    return new Promise((resolve, reject) => {
      logout().then(() => {
        commit('SET_TOKEN', '')
        commit('SET_PERMS', [])
        removeToken()

        // clean store routes
        dispatch('permission/resetRoutes', null, { root: true })

        // reset visited views and cached views
        // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
        dispatch('tagsView/delAllViews', null, { root: true })

        // clean vue-router
        resetRouter()
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      removeToken()
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
