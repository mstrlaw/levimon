<template>
  <div :class="{ 'loading': isLoading, 'app-loading': appLoading }" class="shutter-wrapper"
    :style="{
      'height': `${ shutterHeight }`
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
    <img id="imgLoader" src="" >
  </div>
</template>

<script>
  export default {
    name: 'Shutter',
    props:{
      isLoading:{
        type: Boolean,
        default: true
      },
      appLoading: {
        type: Boolean,
        default: true
      },
      shutterHeight:{
        type: String,
        default: '100vh'
      }
    },
    data(){
      return {
        shutterFill: '#F50057',
      }
    },
    methods:{
      processImage(event){
        this.$emit('imageData', event.target.files[0])
      },
    }
  }
</script>
