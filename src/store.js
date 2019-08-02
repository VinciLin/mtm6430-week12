import Vue from 'vue'
import Vuex from 'vuex'
import axiosAuth from './axios-auth'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    idToken: null,
    userId: null,
    error: ''
  },
  mutations: {
    // userData is object, token userId etc. are properties
    AUTH_USER (state, userData) {
      state.idToken = userData.token
      state.userId = userData.userId
    },
    SET_ERROR (state, errorMessage) {
      state.error = errorMessage
    }
  },
  actions: {
    // step1:
    signUp ({commit}, authData) {
      // 来自于axios-auth.js 文件的后半部分，分开写的原因是分别不同的功能
      axiosAuth
        .post('accounts:signUp?key=AIzaSyCq8hTz3Ba_pC1YC8WiOEfnD1uQM8Fmrdc',
          {
            email: authData.email,
            password: authData.password,
            returnSecureToken: true
          })
        .then(res => {
          console.log(res)
          commit('AUTH_USER', {
            token: res.data.idToken,
            userId: res.data.localId
          })
        })
        .catch(error => {
          if (error.response) {
            // response整个console里面的response
            console.log(error.response.data.error.message)
            commit('SET_ERROR', error.response.data.error.message)
          }
        })
    },
    signIn ({commit}, authData) {
      axiosAuth
        .post('accounts:signInWithPassword?key=AIzaSyCq8hTz3Ba_pC1YC8WiOEfnD1uQM8Fmrdc',
          {
            email: authData.email,
            password: authData.password,
            returnSecureToken: true
          })
        .then(res => {
          console.log(res)
          commit('AUTH_USER', {
            token: res.data.idToken,
            userId: res.data.localId
          })
        })
        .catch(error => {
          if (error.response) {
            // response整个console里面的response
            console.log(error.response.data.error.message)
            commit('SET_ERROR', error.response.data.error.message)
          }
        })
    }
  }
})

// API_KEY: AIzaSyCq8hTz3Ba_pC1YC8WiOEfnD1uQM8Fmrdc
