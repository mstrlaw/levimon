<template>
  <nav :class="{ 'open':menuOpen }" class="navigation">
    <a href="#" class="nav-toggle" @click.prevent="toggleMenu">
      <span></span>
      <span></span>
      <span></span>
    </a>
    <div class="menu">
      <div class="about">
        <h3>Levimon? What's this?</h3>
        <p>Just a web based game who's purpose is to "capture" as many people wearing the classic Levis t-shirt.</p>
        <h3>How?</h3>
        <p>1) Use the shutter icon on the bottom to launch your camera.</p>
        <p>2) Point at someone wearing a Levis t-shirt.</p>
        <p>3) Take a photo.</p>
        <p>4) Score!</p>
        <h3>Why?</h3>
        <p>Because the amount of people wearing it is too damn high! And it was a fun thing to build and try in the wild.</p>
        <p>Read more about it <a href="#" target="_blank">here</a></p>
        <hr>
        <small>Built by <a href="https://mstrlaw.com" target="_blank">mstrlaw</a> using <a href="https://vuejs.org/" target="_blank">VueJS</a> &amp; <a href="https://clarifai.com/" target="_blank">Clarifai</a>.<br>Hosted on <a href="https://www.netlify.com/" target="_blank">Netlify</a></small>
        <small>
           <div>Shutter icon made by <a href="http://www.freepik.com" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a></div>
        </small>
      </div>
      <!--a href="#" class="nav-link">For</a>
      <a href="#" class="nav-link">future</a>
      <a href="#" class="nav-link">use</a>
      <a href="#" class="nav-link">maybe?</a-->
    </div>
  </nav>
</template>

<script>
  export default {
    name: 'Navigation',
    data(){
      return {
        menuOpen: false
      }
    },
    methods: {
      toggleMenu () {
        this.menuOpen = !this.menuOpen
      }
    }
  }
</script>

<style lang="scss">
.navigation{
  .nav-toggle{
    position: fixed;
    right: 15px;
    top: 15px;
    padding: 6px 4px;
    background: #EEE;
    border-radius: 4px;
    z-index: 510;
    span{
      display: block;
      background: #000;
      width: 24px;
      height: 4px;
      margin-bottom: 4px;
      &:last-child{
        margin-bottom: 0;
      }
    }
  }
  .menu{
    position: fixed;
    right: 0;
    height: 100vh;
    width: 100vw;
    background: white;
    display: flex;
    flex-direction: column;
    z-index: 500;
    transform: translateY(100vh);
    transition: .5s transform;
    .about{
      padding: 15px;
    }
    .nav-link{
      padding: 10px 15px;
      font-size: 1.4em;
    }
  }

  &.open{
    .menu{
      transform: translateY(0);
      transition: .3s transform;
    }
  }
}
</style>
