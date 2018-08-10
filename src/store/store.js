import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state:{
    captured: 0,
    db: null,
    user: null,
  },
  mutations:{
    setCapture(state, value) {
      state.captured = state.captured + parseInt(value)
    },
    saveUser(state, value) {
      state.user = value
    },
    storeDb(state, value){
      state.db = value
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
      // let user = getters.user
      // let db = getters.db


      // let scoreRef = db.ref(`scores/${ getters.user }/score`)

      // let userRef = scoreRef.child(user)

      // scoreRef.transaction(function(value) {
      //   return (value || 0) += 1
      // });

      // userRef.set({
      //   score: 1
      // },
      // function(err){
      //   console.log('saved data!')
      // })

      // userRef.on('value', function(snapshot) {
      //   console.log(snapshot.val())
      // });


      

      // var scoreDocRef = db.collection('scores').doc(user)
      // var getDoc = cityRef.get()
      //     .then(doc => {
      //       if (!doc.exists) {
      //         console.log('No such document!')
      //       } else {
      //         console.log('Document data:', doc.data())
      //       }
      //     })
      //     .catch(err => {
      //       console.log('Error getting document', err)
      //     })
      // scoreDocRef.set({
      //   user: user,
      //   born: 1815
      // })

    },
    saveUserId({ commit }, value){
      commit('saveUser', value)
    }
  },
  getters:{
    capturedCount: state => { return state.captured },
    db: state => { return state.db },
    user: state => { return state.user }
  }
})
