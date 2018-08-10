import Vue from 'vue'
import App from './App.vue'
import store from './store/store'

let firebase = require('firebase')

Vue.config.productionTip = false

var config = {
  apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
  authDomain: process.env.VUE_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.VUE_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID,
  storageBucket: "",
  messagingSenderId: process.env.VUE_APP_FIREBASE_MESSAGING_ID
}

firebase.initializeApp(config)

// let db = firebase.database()
// store.commit('storeDb', db)

firebase.auth().signInAnonymously().catch(function(error) {
  console.log(error)
  alert('Error signing anonymously')
})

firebase.auth().onAuthStateChanged((user) => {
  store.dispatch('saveUserId', user.uid)
})

new Vue({
  store,
  render: h => h(App)
}).$mount('#app')

