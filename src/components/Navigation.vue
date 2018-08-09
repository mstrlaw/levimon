<template>
  <nav :class="{ 'open':menuOpen }" class="navigation">
    <a href="#" class="nav-toggle" @click.prevent="toggleMenu">
      <span></span>
      <span></span>
      <span></span>
    </a>
    <div class="menu">
      <a href="#" class="nav-link">Hello</a>
      <a href="#" class="nav-link">Goodbye</a>
      <a href="#" class="nav-link">Hello</a>
      <a href="#" class="nav-link">Goodbye</a>
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
