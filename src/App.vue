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
  font-family: "Montserrat";
  src: local("Montserrat"),   url(./fonts/Montserrat-Black.ttf) format("truetype");
  font-weight: 900;
}
@font-face {
  font-family: "Montserrat";
  src: local("Montserrat"),   url(./fonts/Montserrat-Bold.ttf) format("truetype");
  font-weight: bold;
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
  color: var(--primary-color);
  background: #EFEBE9;
}
:root{
  --primary-color: #102A68!important;
  --secondary-color: #FE9D34!important;
  --light-secondary-color: #ffe2c3!important;
  --tertiary-color: rgb(201, 219, 251)!important;
  --light-main-color: rgba(148, 163, 236, 0.2)!important;
  --success-color: #FF5621!important;
  --warning-color: #FFC108!important;
  --error-color: #ef4d4d!important;
  --danger-color: #ff6b6b!important;
  --info-color: #6f788d!important;
  --info2-color: #f38383!important;
  --background-color: rgb(250, 250, 250);
}
.title {
  font-size: 3.0em;
  margin-left: 20px;
  letter-spacing: -0.05em;
  font-weight: bold;
  color: var(--primary-color);
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
.form-input {
  font-family: "Montserrat";
  font-size: 14px;
  background-color: #F9F7F3;
  color: #616161;
  border: none;
  border-radius: 8px;
  padding: 0px 10px 0px 10px;
  height: 36px;
}
.form-input:disabled {
  background-color: #FAFAFC;
  color: #b8b1b1;
}
.text-area {
  font-family: "Montserrat";
  font-size: 14px;
  background-color: #F9F7F3;
  color: #616161;
  border: none;
  border-radius: 8px;
  padding: 10px;
}
button {
  font-family: "Montserrat";
}
input {
  font-family: "Montserrat";
}
</style>
