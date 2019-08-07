import Vue from 'vue'
import Vuex from 'vuex'
import axiosAuth from './axios-auth'
import router from './router'
import globalAxios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    idToken: null,
    userId: null,
    error: '',
    user: null
  },
  mutations: {
    // userData is object, token userId etc. are properties
    AUTH_USER (state, userData) {
      state.idToken = userData.token
      state.userId = userData.userId
    },
    SET_ERROR (state, errorMessage) {
      state.error = errorMessage
    },
    EMPTY_ERROR (state) {
      state.error = ''
    },
    CLEAR_DATA (state) {
      state.idToken = null
      state.userId = null
    },
    STORE_USER (state, user) {
      state.user = user
    }

  },
  actions: {
    // step1:
    signUp ({ commit, dispatch }, authData) {
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
          //  Save the auth info in the state
          commit('AUTH_USER', {
            token: res.data.idToken,
            userId: res.data.localId
          })

          // Local Storage
          const now = new Date()
          const expirationDate = new Date(
            now.getTime() + res.data.expiresIn * 1000
          )

          localStorage.setItem('token', res.data.idToken)
          localStorage.setItem('userId', res.data.localId)
          localStorage.setItem('expirationDate', expirationDate)

          localStorage.setItem('userEmail', authData.email)

          dispatch('storeUser', authData)

          router.push({ name: 'dashboard' })
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
          // Local Storage
          const now = new Date()
          const expirationDate = new Date(
            now.getTime() + res.data.expiresIn * 1000
          )

          localStorage.setItem('token', res.data.idToken)
          localStorage.setItem('userId', res.data.localId)
          localStorage.setItem('expirationDate', expirationDate)

          localStorage.setItem('userEmail', authData.email)

          router.push({ name: 'dashboard' })
        })
        .catch(error => {
          if (error.response) {
            // response整个console里面的response
            console.log(error.response.data.error.message)
            commit('SET_ERROR', error.response.data.error.message)
          }
        })
    }, // closing signIn
    clearError ({commit}) {
      commit('EMPTY_ERROR')
    },
    logout ({commit}) {
      localStorage.removeItem('token')
      localStorage.removeItem('expirationDate')
      localStorage.removeItem('userId')

      // commit mutation to clear the state
      commit('CLEAR_DATA')
      // send user to signin route
      router.push({name: 'signin'})
    },
    // add action for auto login
    autoLogin ({commit}) {
      const token = localStorage.getItem('token')
      const expirationDate = localStorage.getItem('expirationDate')
      const userId = localStorage.getItem('userId')

      const now = new Date()
      if (now >= expirationDate) {
        return
      }
      commit('AUTH_USER', {
        token: token,
        userId: userId
      })
    },
    storeUser ({state}, userData) {
      if (!state.idToken) {
        return
      }
      globalAxios
        .post('https://lin00146-week-12-auth-2.firebaseio.com/users.json' + '?auth=' + state.idToken,
          userData)
        .then(res => console.log(res))
        .catch(error => console.log(error.message))
    },
    fetchUser ({commit, state}, userEmail) {
      if (!state.idToken) {
        return
      }
      globalAxios.get('https://lin00146-week-12-auth-2.firebaseio.com/users.json' + '?auth=' + state.idToken)
        .then(res => {
          const data = res.data
          // use js to look for the user we want
          for (let key in data) {
            const user = data[key]
            if (user.email == userEmail) {
              console.log(user)
              user.id = key
              commit('STORE_USER', user)
            }
          }
        })
    },

    updateUser ({ state }) {
      globalAxios
        .patch(
          'https://lin00146-week-12-auth-2.firebaseio.com/users/' +
         state.user.id +
         '.json' +
         '?auth=' +
         state.idToken,
          { name: state.user.name }
        )
        .then(res => console.log(res))
        .catch(error => console.log(error.response))
    }
  },

  getters: {
    isAuthenticated (state) {
      return state.idToken !== null
    },
    getUser (state) {
      return state.user
    }
  }
})

// API_KEY: AIzaSyCq8hTz3Ba_pC1YC8WiOEfnD1uQM8Fmrdc
