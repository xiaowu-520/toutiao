import Vue from 'vue'
import Vuex from 'vuex'
import { getToken, setToken } from '@/utils'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 声明token
    user: getToken() || {}
  },
  getters: {
  },
  mutations: {
    // 修改token
    setUser(state, payload) {
      state.user = payload
      // 存储token
      setToken(payload)
    }
  },
  actions: {
  },
  modules: {
  }
})
