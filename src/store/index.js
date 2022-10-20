import { createStore } from 'vuex'
import sidebar from './sidebar'
import users from './user'
import createPersistedState from 'vuex-persistedstate'

const store = createStore({
  strict: true,
  plugins: [createPersistedState()],
  modules: {
    sidebar,
    users
  },  
  state: {
    isUserLoggedIn: false,
    token: null,
    user: null
  },
  mutations: {
    setAuthentication(state, token){
      state.token = token
      state.isUserLoggedIn = !!(token)
    },
    setUser(state, user){
      state.user = user
    }
  },
  actions: {
    setAuthentication({commit}, token){
      commit('setAuthentication', token)
    },
    setUser({commit}, user){
      commit('setUser', user)
    }
  },
  getters: {
    isUserLoggedIn: state => state.isUserLoggedIn,
    isAdmin: state => state.isAdmin,
    token: state => state.token,
    user: state => state.user
  }
})

export default store