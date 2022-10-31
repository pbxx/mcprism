<script setup>
import { RouterLink, RouterView } from 'vue-router'
import mcHeader from './components/mcHeader.vue'
import mcFooter from './components/mcFooter.vue'
</script>

<script>

export default {
  created(){
    this.$router.push('/')
  }
}
</script>

<!--
<template>
  <header>
    <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />

    <div class="wrapper">
      <HelloWorld msg="You did it!" />

      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
    </div>
  </header>

  <RouterView />
</template>
-->
<template>
  <mcHeader />
  <RouterView />
  <mcFooter />
</template>

<style>
@font-face {
  font-family: "Open Sans Regular";
  src: local("Open Sans Regular"),
   url(./fonts/Open_Sans/OpenSans-VariableFont_wdth,wght.ttf) format("truetype");
}

:root {
  --d-navH: 110px;
  --d-footerH: 98px;

  --logoH: 68px;

  --desktop-footerbutton-icon-height: 38px;
  --desktop-footerbutton-font-size: 16px;
  --desktop-footerbutton-caret-height: 11px;

  --body-bg: #c0c0c0;

  --nav-dark-gradient: #1d3d31;
  --nav-light-gradient: #31745e;

  --card-dark-gradient: #8a8a8a;
  --card-light-gradient: #d1d1d1;

  --footer-dark-gradient: #232323;
  --footer-light-gradient: #2e2e2e;
}

body {
  background-color: var(--body-bg)!important;
  margin: 0;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}

#app {
  width: 100vw!important;
  height: 100vh!important;
  overflow: hidden!important;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

@media (max-width: 600px) {

}
</style>
