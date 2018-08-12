import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state:{
    captured: 0,
  },
  mutations:{
    setCapture(state, value) {
      state.captured = state.captured + parseInt(value)
    }
  },
  actions:{
    queryTest({ getters }){
      console.log('queryTest!')
      let user = getters.user
      let db = getters.db
      let scoreRef = db.ref('scores')
      scoreRef.once('value', function(snapshot){
        console.log(snapshot.val())
      })
    },
    increaseCapture({ commit }){
      commit('setCapture', '+1')
    }
  },
  getters:{
    capturedCount: state => { return state.captured }
  }
})
