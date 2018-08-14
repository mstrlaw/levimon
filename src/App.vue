<template>
  <div id="app">

    <Navigation />
    
    <div :class="{ 'visible': visibleFeedback  }" class="feedback-message">
      <div class="square">
        <i :class="feedbackIcon" class="twa"></i>
        <h2 v-html="feedbackMsg" />
      </div>
    </div>

    <div class="leaderboard-wrapper">
      <div class="leaderboard">
        <h2>Your catches</h2>
        <h1>{{ captured }}</h1>
        <textarea style="width:100px; word-wrap:break-word;">
          {{ baseString }}
        </textarea>
      </div>
    </div>

    <Shutter
      :is-loading="isLoading"
      :app-loading="appLoading"
      :shutter-height="shutterHeight"
      @imageData="identifyBrand"
    />

  </div>
</template>

<script>
import Navigation from './components/Navigation'
import Shutter from './components/Shutter'

const Clarifai = require('clarifai')

const clarifai = new Clarifai.App({ apiKey: process.env.VUE_APP_CLARIFAI_KEY })

let reader = new FileReader()

const generateSuccessMsg = () => {
  let sentences = [
    'Wow, nice catch!',
    'Such rarity discovered!',
    'Another original Levimon caught!',
    'Another rare Levimon captured!',
    'Damn! Much original!',
    'Another one!',
    'Damn! Another rare one!',
    'Another Levimon? Wow..'
  ]

  let icons = [
    'twa-thumbsup',
    'twa-ok-hand',
    'twa-tada',
    'twa-trophy',
    'twa-monkey',
    'twa-speak-no-evil'
  ]

  let sentence = sentences[Math.floor(Math.random() * (sentences.length - 1))]

  let icon = icons[Math.floor(Math.random() * (icons.length - 1))]

  return {
    sentence: sentence,
    icon: icon
  }
}

const generateErrorMsg = () => {
  let sentences = [
    'Sorry, no Levimons found..',
    'Hm, nothing found.. Try again!',
  ]

  let icons = [
    'twa-question-mark',
  ]

  let sentence = sentences[Math.floor(Math.random() * (sentences.length - 1 ))]

  let icon = icons[Math.floor(Math.random() * (icons.length - 1))]

  return {
    sentence: sentence,
    icon: icon
  }
}


export default {
  name: 'app',
  components:{
    Navigation,
    Shutter
  },
  data(){
    return {
      computedWidth: 0,
      computedHeight: 0,
      isLoading: false,
      appLoading: true,
      shutterHeight: '100vh',
      hasMatch: null,
      visibleFeedback: false,
      feedbackMsg: '',
      feedbackIcon: '',
      baseString: ''

    }
  },
  computed:{
    userid(){
      return this.$store.getters.user
    },
    captured(){
      return this.$store.getters.capturedCount
    }
  },
  watch:{
    hasMatch(){

      let d

      if (this.hasMatch) {
        d = generateSuccessMsg()
        this.$store.dispatch('increaseCapture')
        // this.$store.dispatch('queryTest')
      } else if (!this.hasMatch && typeof this.hasMatch == 'boolean') {
        d = generateErrorMsg()
      }

      if (typeof this.hasMatch == 'boolean') {
        this.feedbackMsg = d.sentence
        this.feedbackIcon = d.icon
        this.visibleFeedback = true
        
        setTimeout(()=>{
          this.visibleFeedback = false
          this.feedbackMsg = ''
          this.feedbackIcon = ''
          this.hasMatch = null
        }, 3000)

      }

      

    }
  },
  
  mounted(){
    window.addEventListener('load', () => {
      this.computedWidth = window.innerWidth
      this.computedHeight = window.innerHeight

      setTimeout(()=>{
        this.appLoading = false
        this.shutterHeight = '80px'
      }, 1000)
    })
  },
  methods:{
    identifyBrand(imageData){
      this.isLoading = true
      this.shutterHeight = this.computedHeight+'px'
      
      this.hasMatch = null
      let foundBrand = false

      reader.onload = (e) => {

        this.baseString = e.target.result

        let img = e.target.result.replace(/^data:image\/[a-z]+;base64,/, '')
        
        clarifai.models
          .predict(process.env.VUE_APP_PREDICT_MODEL, { base64: img })
          .then((r) => {
            if (r.status.code === 10000) {
              
              this.isLoading = false
              this.shutterHeight = 80+'px'

              if (r.outputs.length > 0) {
                if (Object.keys(r.outputs[0].data).length > 0) {
                  r.outputs[0].data.regions.map( el => {
                    if (el.data.concepts[0].name.toLowerCase().match('levi') !== null) {
                      if (el.data.concepts[0].value >= 0.9) {
                        foundBrand = true
                      }
                    }
                  })
                  if (foundBrand) {
                    this.hasMatch = true
                  } else {
                    this.hasMatch = false
                  }
                }
                else {
                  this.hasMatch = false
                }
              }
            }
          },
          (err) => {
            alert(err)
          })
          .catch(err => {
            console.log(err)
          })
      }

      reader.readAsDataURL(imageData)
    },
  }
}
</script>

<style lang="scss">
@import './twemoji.scss';
@import url('https://fonts.googleapis.com/css?family=Exo+2');

html, body{
  font-family: 'Exo 2', sans-serif;
}

body{
  padding: 0;
  margin: 0;
  max-height: 100vh;
  max-width: 100vw;
  overflow: hidden;
  background: #8E24AA;
}

.feedback-message{
  display: flex;
  position: absolute;
  align-items: center;
  justify-content: space-around;
  height: 100vh;
  width: 100%;
  z-index: -1;
  
  .square{
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 50px 15px;
    background: rgba(255,255,255, 1);
    border-radius: 4px;
    width: 60vw;
    opacity: 0;
    transform: translateY(-100px);
    transition: .5s opacity, .5s transform;

    .twa{
      height: 4em;
      width: 4em;
      background-size: 4em 4em;
    }
    h2{
      text-align: center;
    }
  }

  &.visible{
    display: flex;
    z-index: 100;
    .square{
      opacity: 1;
      transform: translateY(-50px);
      transition: 1s opacity, 1s transform;
    }
  }
}

.leaderboard-wrapper{
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100%;
  overflow: hidden;
  
  &:after, &:before{
    position: absolute;
    content: '';
    display: block;
    width: 100vw;
    height: 100vh;
    background: red;
    z-index: -1;
  }
  &:before{
    background: #4A148C;
    transform: rotate(10deg);
    left: -70vw;
    top: -10vh;
    height: 110vh;
  }
  &:after{
    background: #AB47BC;
    transform: rotate(30deg);
    bottom: -30vh;
    right: -50vw;
  }

  .leaderboard{
    padding: 15px;
    background: #F50057;
    color: #FFF;
    border-radius: 4px;
    margin-bottom: 15px;
    margin-top: -50px;
    text-align: center;
    -webkit-box-shadow: 0px 0px 36px -8px rgba(0,0,0,0.75);
    -moz-box-shadow: 0px 0px 36px -8px rgba(0,0,0,0.75);
    box-shadow: 0px 0px 36px -8px rgba(0,0,0,0.75);
    animation-name: float; 
    animation-duration: 4s;
    animation-iteration-count: infinite;
    animation-timing-function: linear;
  }
}

#imgLoader{
  visibility: hidden;
  height: 0;
  width: 0;
}

.preview{
  position: absolute;
  top: 0;
  z-index: 10;
  background-repeat: no-repeat;
  background-position: center center;
  background-attachment: fixed;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
}

.shutter-wrapper{
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 8px;
  transition: height .5s;
  z-index: 20;

  .shutter{
    display: flex;
    justify-content: space-around;
    align-items: center;
    height: 100%;

    .image-input{
      width: 0.1px;
      height: 0.1px;
      opacity: 0;
      overflow: hidden;
      position: absolute;
      z-index: -1;
    }

    .image-input + label {
      display: inline-block;
      font-size: 1.25em;
      font-weight: 700;
      background-color: #EEEEEE;
      height: 60px;
      width: 60px;
      border-radius: 50%;
      -webkit-box-shadow: 0px 0px 36px -8px rgba(0,0,0,0.75);
      -moz-box-shadow: 0px 0px 36px -8px rgba(0,0,0,0.75);
      box-shadow: 0px 0px 36px -8px rgba(0,0,0,0.75);
      transition: height .5s, width .5s;
      animation-name: rotate; 
      animation-duration: 20s;
      animation-iteration-count: infinite;
      animation-timing-function: linear;
    }

    .image-input:focus + label,
    .image-input + label:hover{
      cursor: pointer;
    }
  }

  .caption{
    display: flex;
    justify-content: space-around;
    h3,h4{
      margin: 4px auto;
    }
  }

  &.loading{
    .shutter{
      .image-input + label {
        height: 120px;
        width: 120px;
      }
    }
  }
  &.app-loading{
    z-index: 600;
    .shutter{
      background: #FFF;
      .image-input + label {
        height: 120px;
        width: 120px;
      }
    }
  }
}

@keyframes float {
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(10px);
  }
  100% {
    transform: translateY(0);
  }
  
}

@keyframes rotate {
  from {transform: rotate(0deg);}
  to {transform: rotate(-360deg);}
}

</style>
