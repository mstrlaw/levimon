<template>
  <div id="app">

    <div class="preview"
      :style="{
        'background-image': `url(${ previewImage })`,
        'visibility': previewVisibility,
        'height': `${ previewHeight }`,
        'width': `${ previewWidth }`
      }"
    />

    <div class="shutter-wrapper">
      <div class="shutter">
        <input id="cameraInput" type="file" name="camera" accept="image/*" class="image-input" capture @change="addImage($event)">
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
      <div class="caption">
        <h4>CAPTURE</h4>
      </div>
    </div>
  
    <img id="imgLoader" src="" >

  </div>
</template>

<script>

import tracking from 'jstracking'
// import fabric from 'fabric'

const Clarifai = require('clarifai')

const app = new Clarifai.App({
 apiKey: process.env.VUE_APP_CLARIFAI_KEY
})


export default {
  name: 'app',
  data(){
    return {
      computedWidth: 640,
      computedHeight: 480,
      previewVisibility: 'hidden',
      previewHeight: 0,
      previewWidth: '100%',
      previewImage: '',
      shutterFill: '#D500F9',
      canvas: null
    }
  },
  mounted(){
    window.addEventListener('load', () => {
      this.computedWidth = window.innerWidth
      this.computedHeight = window.innerHeight
    })
  },
  methods:{
    addImage(event){

      var reader = new FileReader()
      let prev = document.getElementById('imgLoader')

      reader.onload = (e) => {
        prev.setAttribute('src', e.target.result)

        this.previewHeight = this.computedHeight + 'px'
        this.previewVisibility = 'visible'

        this.previewImage = e.target.result

        let img = e.target.result.replace(/^data:image\/[a-z]+;base64,/, '')

        app.models
          .predict(process.env.VUE_APP_PREDICT_MODEL, { base64: img })
          .then((r) => {
            if(r.status.code === 10000){
              console.log(response)
              alert('got response from clarifai')
            }
          },
          (err) => {
            alert(err)
          }
        )
      }

      reader.readAsDataURL(event.target.files[0])
    }
  }
}
</script>

<style lang="scss">
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
}

.shutter-wrapper{
  position: absolute;
  bottom: 15px;
  width: 100%;
  .shutter{
    display: flex;
    justify-content: space-around;
  }

  .caption{
    display: flex;
    justify-content: space-around;
    h3,h4{
      margin: 4px auto;
    }
  }
}


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
  animation-name: rotate; 
  animation-duration: 20s; 
  animation-iteration-count: infinite;
  animation-timing-function: linear;
  -webkit-box-shadow: 0px 0px 36px -8px rgba(0,0,0,0.75);
  -moz-box-shadow: 0px 0px 36px -8px rgba(0,0,0,0.75);
  box-shadow: 0px 0px 36px -8px rgba(0,0,0,0.75);
}

.image-input:focus + label,
.image-input + label:hover{
  cursor: pointer;
  /*transform: rotate(180deg);*/
}

@keyframes rotate {
  from {transform: rotate(0deg);}
  to {transform: rotate(-360deg);}
}

#imagePreview{
  visibility: hidden;
  height: 0;
  width: 0;
}
.preview{
  background-repeat: no-repeat;
  background-position: center center;
  background-attachment: fixed;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
}
</style>
