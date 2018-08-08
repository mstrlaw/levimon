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
      </div>
    </div>
  
    <!--div class="preview"
      :style="{
        'background-image': `url(${ previewImageSrc })`,
        'visibility': previewVisibility,
        'height': `${ previewHeight }`,
        'max-width': `${ computedWidth }px`,
        'width': `${ previewWidth }`
      }"
    /-->

    <div :class="{ 'loading': isLoading }" class="shutter-wrapper"
      :style="{
        'height': `${ shutterHeight }px`
      }"
      >
      <div class="shutter">
        <input id="cameraInput" type="file" name="camera" accept="image/*" class="image-input" capture @change="processImage($event)">
        <label for="cameraInput">
          <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve">
            <g>
              <g>
                <path d="M256,60C147.925,60,60,147.925,60,256s87.925,196,196,196s196-87.925,196-196S364.075,60,256,60z M392.856,162.164    L356,226L278.352,91.51C325.777,97.922,366.905,124.433,392.856,162.164z M338.68,256l-41.34,71.602h-82.68v0.001L173.32,256    l41.34-71.602h82.68L338.68,256z M243.125,90.496l36.894,63.902H124.82C152.743,118.428,195.101,94.197,243.125,90.496z     M102.378,318.874C94.408,299.471,90,278.242,90,256c0-25.625,5.84-49.912,16.253-71.603h73.766L102.378,318.874z     M119.144,349.836L156,286l77.648,134.49C186.223,414.078,145.095,387.567,119.144,349.836z M268.875,421.504l-36.894-63.902    H387.18C359.257,393.572,316.899,417.803,268.875,421.504z M331.981,327.603l77.641-134.477C417.592,212.529,422,233.758,422,256    c0,25.625-5.84,49.912-16.253,71.603H331.981z" :style="`fill: ${ shutterFill };`" />
              </g>
            </g>
            <g>
              <g>
                <path d="M437.02,74.981C388.667,26.629,324.38,0,256,0S123.333,26.629,74.98,74.981C26.629,123.333,0,187.62,0,256    s26.629,132.667,74.98,181.019C123.333,485.371,187.62,512,256,512s132.667-26.629,181.02-74.981    C485.371,388.667,512,324.38,512,256S485.371,123.333,437.02,74.981z M256,482C131.383,482,30,380.617,30,256S131.383,30,256,30    s226,101.383,226,226S380.617,482,256,482z" :style="`fill: ${ shutterFill };`" />
              </g>
            </g>
          </svg>
        </label>
      </div>
      <!--div class="caption">
        <h4>CAPTURE</h4>
      </div-->
    </div>
  
    <img id="imgLoader" src="" >

  </div>
</template>

<script>
import Navigation from './components/Navigation.vue'

const Clarifai = require('clarifai')

const app = new Clarifai.App({
 apiKey: process.env.VUE_APP_CLARIFAI_KEY
})

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

  let sentence = sentences[Math.floor(Math.random() * (sentences.length))]

  let icon = icons[Math.floor(Math.random() * (icons.length))]

  return {
    sentence: sentence,
    icon: icon
  }
}


export default {
  name: 'app',
  components:{
    Navigation
  },
  data(){
    return {
      computedWidth: 640,
      computedHeight: 480,
      previewVisibility: 'hidden',
      previewHeight: 0,
      previewWidth: '100%',
      previewImageSrc: '',
      isLoading: false,
      shutterHeight: 80,
      shutterFill: '#F50057',
      previewEl: null,
      hasMatch: null,
      visibleFeedback: false,
      feedbackMsg: '',
      feedbackIcon: ''
    }
  },
  computed:{
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
      } else if (!this.hasMatch && typeof this.hasMatch == 'boolean') {
        d = generateErrorMsg()
      }

      if (typeof this.hasMatch == 'boolean') {
        this.feedbackMsg = d.sentence
        this.feedbackIcon = d.icon
        this.visibleFeedback = true

        // this.fadeOutPreview()
        
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
      this.previewEl = document.getElementById('imgLoader')
    })
  },
  methods:{
    processImage(event){
      this.isLoading = true
      this.shutterHeight = this.computedHeight
      this.identifyBrand(event.target.files[0])
    },
    identifyBrand(imageData){
      this.hasMatch = null
      let foundBrand = false

      reader.onload = (e) => {
        this.previewEl.setAttribute('src', e.target.result)

        this.previewHeight = this.computedHeight + 'px'
        this.previewVisibility = 'visible'

        // this.previewImageSrc = e.target.result

        // Extract base64 string data only, for Clarifai
        let img = e.target.result.replace(/^data:image\/[a-z]+;base64,/, '')
        

        app.models
          .predict(process.env.VUE_APP_PREDICT_MODEL, { base64: img })
          .then((r) => {
            if (r.status.code === 10000) {
              this.isLoading = false
              this.shutterHeight = 80
              console.log(r)
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
    fadeOutPreview(){
      this.previewEl.removeAttribute('src')
      this.previewImageSrc = ''
    }
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
  height: 100vh;
  width: 100%;
  align-items: center;
  justify-content: space-around;
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
    margin-bottom: 150px;
    text-align: center;
    -webkit-box-shadow: 0px 0px 36px -8px rgba(0,0,0,0.75);
    -moz-box-shadow: 0px 0px 36px -8px rgba(0,0,0,0.75);
    box-shadow: 0px 0px 36px -8px rgba(0,0,0,0.75);
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
      svg{
        animation-name: rotate; 
        animation-duration: 20s;
        animation-iteration-count: infinite;
        animation-timing-function: linear;
      }
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
        svg{
          animation-duration: 2s;
        }
      }
    }
  }
}

@keyframes rotate {
  from {transform: rotate(0deg);}
  to {transform: rotate(-360deg);}
}

</style>
