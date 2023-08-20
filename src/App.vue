<template>
  <div id="app">
    <home />
    <!--<frontend/>-->
  </div>
</template>

<script>
import Home from './views/Home.vue'
import SocketioService from './services/socketio.service.js';
import repo from '@/db/repo.js'

export default {
  name: "App",
  components: {
    Home
  },
  mounted() {
    SocketioService.setupSocketConnection();
    repo.loadAllProducts();
    repo.loadVariants();
  },
};
</script>

<style>

@font-face {
  font-family: "Gilroy";
  src: url(./fonts/Gilroy-Regular.ttf) format("truetype");
  font-display: fallback;
  font-style: normal;
  font-weight: normal;
}
@font-face {
  font-family: "Gilroy";
  src: url(./fonts/Gilroy-Bold.ttf) format("truetype");
  font-display: fallback;
  font-style: normal;
  font-weight: bold;
}
@font-face {
  font-family: "Gilroy";
  src: url(./fonts/Gilroy-Black.ttf) format("truetype");
  font-display: fallback;
  font-style: normal;
  font-weight: 900;
}
@font-face {
  font-family: "Gilroy";
  src: url(./fonts/Gilroy-SemiBold.ttf) format("truetype");
  font-display: fallback;
  font-style: normal;
  font-weight: 500;
}

body,
html {
  margin: 0;
  padding: 0;
}

#app {
  font-size: 15px;
  font-family: "Gilroy", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  color: var(--primary-color);
  background: #f2f2f7;
  /*background: #fff5e3;*/
}
:root{
  --primary-color: #376897!important;
  --primary-light-color: #37689740!important;
  --secondary-color: #55bde5!important;
  --secondary-light-color: #55bde540!important;
  --tertiary-color: #ff9933!important;
  --tertiary-light-color: #ffe6cf;
  --success-color: #5dcc9d!important;
  --warning-color: #ffe342!important;
  --error-color: #b2110f!important;
  --danger-color: #b2110f!important;
  --info-color: #6f788d!important;
  --info2-color: #f38383!important;
  --gray1-color: #8e8e93;
  --gray2-color: #aeaeb2;
  --gray3-color: #c7c7cc;
  --gray4-color: #d1d1d6;
  --gray5-color: #e5e5ea;
  --gray6-color: #f2f2f7;
}
.title {
  font-size: 3.0em;
  margin-left: 20px;
  letter-spacing: -0.04em;
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
  border: 1px solid var(--gray5-color);
  border-radius: 8px;
  box-shadow: 3px 8px 8px -4px rgb(151, 114, 114, 0.4);
  padding: 10px;
  margin-bottom: 5px;
  margin-top: 5px;
}
.flat-card {
  border: 1px solid var(--gray5-color);
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
  font-family: "Gilroy";
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
form-label {
  font-size: 14px;
  margin: 5px;
}
.search-input {
  border-radius: 25px;
  height: 30px;
  padding-left: 10px;
  padding-right: 10px;
}
.text-area {
  font-family: "Gilroy";
  font-size: 14px;
  background-color: #F9F7F3;
  color: #616161;
  border: none;
  border-radius: 8px;
  padding: 10px;
  word-break: break-all;
}
button {
  font-family: "Gilroy";
}
input {
  font-family: "Gilroy";
}
.indicator-red {
  background-color: var(--danger-color);
}
.indicator-orange {
  background-color: #F57C00;
}
.indicator-green {
  background-color: #009688;
}
.indicator-purple {
  background-color: #E1BEE7;
}
.indicator-yellow {
  background-color: var(--warning-color);
}
.indicator-gray {
  background-color: var(--info-color);
}
.simple-list {
  list-style-type: none;
	list-style: none;
	padding: 0;
	width: 100%;

}
.simple-list li {
  margin: 10px;
  padding: 0 0;
  text-align: left;
}

button {
  background:none;
  outline: none;
  border:none;
  font-weight: bold;
  margin-left: 10px;
  margin-right: 10px;
  padding: 2px 16px;
  min-height: 30px;
  color: var(--primary-color);
}

button:active {
  background-color: var(--primary-light-color);
  border-radius: 8px;
}

button.lg {
  font-size: 1.1em;
}

button.selected {
  background-color: var(--tertiary-light-color);
  border-radius: 20px;
}

button.action {
  color: var(--secondary-color);
}

button.danger {
  color: var(--danger-color);
}

button.radio {
  color: var(--tertiary-color);
}
.divider {
  background-color: var(--gray4-color);
  height: 1px;
  width: 95%;
  margin-top:10px;
  margin-bottom:10px;
}

</style>
