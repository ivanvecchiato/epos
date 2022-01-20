<template>
  <div id="app">
    <home />
    <!--<frontend/>-->
  </div>
</template>

<script>
import Home from './views/Home.vue'
//const electron = window.require("electron")

export default {
  name: "App",
  components: {
    Home
  },
  mounted() {
    /*
    electron.ipcRenderer.on('goToHome', ()=>{
      this.$router.push('/');
    });
    electron.ipcRenderer.on('goToAbout', ()=>{
      this.$router.push('/about');
    });
    */
  },
};
</script>

<style>

@font-face {
  font-family: "Montserrat";
  src: local("Montserrat"),   url(./fonts/Montserrat-Regular.ttf) format("truetype");
}
@font-face {
  font-family: "Montserrat-Black";
  src: local("Montserrat-Black"),   url(./fonts/Montserrat-Black.ttf) format("truetype");
}
@font-face {
  font-family: "Montserrat-Bold";
  src: local("Montserrat-Bold"),   url(./fonts/Montserrat-Bold.ttf) format("truetype");
}

body,
html {
  margin: 0;
  padding: 0;
}

#app {
  font-size: 15px;
  font-family: "Montserrat", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  color: #1e1d57;
  background: #f6f9ff;
}
:root{
    --primary-color: #667BCC!important;
    --secondary-color: #e98077!important;
    --tertiary-color: #FAF8F6!important;
    --light-secondary-color: #FFE8E6!important;
    --light-main-color: #DFE9FE!important;
    --lightest-main-color: #e2e8ff!important;
    --success-color: #FB8C00!important;
    --warning-color: #FFC108!important;
    --error-color: #ef4d4d!important;
    --danger-color: #ff6b6b!important;
    --info-color: #8a9fad!important;
    --info2-color: #f38383!important;
}
.title {
  font-size: 3.0em;
  margin-left: 20px;
  letter-spacing: -0.05em;
  font-weight: bold;
  color: var(--light-main-color);
  text-align: left;
}
.title-2 {
  font-size: 1.8em;
  margin-left: 10px;
  letter-spacing: -0.05em;
  font-weight: bold;
  color: var(--info-color);
  text-align: left;
 }
.card {
  border: 1px solid lightgray;
  border-radius: 8px;
  box-shadow: 3px 8px 8px -4px rgb(151, 114, 114, 0.4);
  padding: 10px;
  margin-bottom: 5px;
  margin-top: 5px;
}
.flat-card {
  border: 1px solid var(--light-main-color);
  border-radius: 8px;
  padding: 10px;
  margin: 5px;
}
.action-button {

}
.primary-button {
  background: var(--primary-color);
}

</style>
