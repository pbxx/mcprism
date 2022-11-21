<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { ref, computed } from 'vue'
import mcHeader from './components/mcHeader.vue'
import mcFooter from './components/mcFooter.vue'
</script>

<script>

export default {
  data: function() {
    var serverList = []
    var interfaceList = []
    var activeServerIndex = -1
    return {
        serverList,
        interfaceList,
        activeServerIndex,
        platform : ""
    }
  },
  mounted() {
    //request an initial state update
    window.ipcRenderer.send('toMain', { command: 'requestStateUpdate' })
    //handle state updates
    window.ipcRenderer.receive('fromMain', (arg) => {
      console.log(arg) // prints "pong" in the DevTools console
      if (arg.command == 'updateState') {
        //this is a server list update
        console.log(this.serverListLength)
        console.log(this.activeServerIndex)

        this.serverList = arg.state.serverList
        this.interfaceList = arg.state.interfaceList
        this.activeServerIndex = arg.state.activeServerIndex
        this.platform = arg.state.platform
      }
    })
  },
  created() {
    this.$router.push('/')
  },
  provide() {
    return {
      activeServerIndex: computed(() => this.activeServerIndex),
      serverList: computed(() => this.serverList),
      interfaceList: computed(() => this.interfaceList),
      platform: computed(() => this.platform),
    }
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
  --d-navH: 130px;
  --d-footerH: 72px;

  --logoH: 112px;

  --bodytext-color: #201f1f;
  --bodytext-lightcolor: #454343;

  --desktop-footerbutton-icon-height: 24px;
  --desktop-footerbutton-font-size: 16px;
  --desktop-footerbutton-caret-height: 11px;

  --bottomlink-inactive-color: #ffffff7f;
  --bottomlink-active-color: #ffffff;

  --body-bg: #e3e3e3;
/*
  --nav-dark-gradient: #110d28;
  --nav-light-gradient: #231759;

  --nav-dark-gradient: #201f1f;
  --nav-light-gradient: #454343;
*/
  --nav-light-gradient: #454343;
  --nav-dark-gradient: #201f1f;
  --footer-light-gradient: #454343;

  --card-dark-gradient: #8a8a8a;
  --card-light-gradient: #d1d1d1;

  --footer-dark-gradient: #121212;
  

/*
  --online-color: #50c989;
  --online-shadow-color: #50c989;
*/

  --online-color: #5de698;
  --online-shadow-color: #50c9b5;

  --offline-color: #585858;
  --offline-shadow-color: #313131;
}

body {
  background-color: var(--nav-dark-gradient)!important;
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
  align-items: center;
}

@media (max-width: 600px) {

}
</style>
