import { logout } from '@/api/user'
import { login, permmenu } from '@/api/comm'
import { aesEncrypt } from '@/utils/crypto'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const state = {
  token: getToken(),
  name: '',
  avatar: '',
  introduction: '',
  // roles: [],
  perms: []
  // routes: []
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
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
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      // getInfo(state.token).then(response => {
      //   const { data } = response

      //   if (!data) {
      //     reject('Verification failed, please Login again.')
      //   }

      //   // const { roles, name, avatar, introduction } = data

      //   // roles must be a non-empty array
      //   // if (!roles || roles.length <= 0) {
      //   //   reject('getInfo: roles must be a non-null array!')
      //   // }

      //   // commit('SET_ROLES', roles)
      //   // commit('SET_NAME', name)
      //   // commit('SET_AVATAR', avatar)
      //   // commit('SET_INTRODUCTION', introduction)
      //   resolve(data)
      // }).catch(error => {
      //   reject(error)
      // })
      permmenu().then(res => {
        const { data } = res
        if (!data) {
          reject('Verification failed, please Login again.')
        }
        const { perms } = data
        commit('SET_PERMS', perms)
        commit('SET_NAME', '超级管理员')
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        removeToken()
        resetRouter()

        // reset visited views and cached views
        // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
        dispatch('tagsView/delAllViews', null, { root: true })

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
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },

  // dynamically modify permissions
  async changeRoles({ commit, dispatch }, role) {
    const token = role + '-token'

    commit('SET_TOKEN', token)
    setToken(token)

    // const { roles } = await dispatch('getInfo')

    resetRouter()

    // generate accessible routes map based on roles
    // const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })
    // dynamically add accessible routes
    // router.addRoutes(accessRoutes)

    // reset visited views and cached views
    dispatch('tagsView/delAllViews', null, { root: true })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
