import { createApp } from 'vue'
import App from './App.vue'
import installElementPlus from './plugins/element'
import router from './router'
import i18n from "./i18n"
import $bus from './event.js';
import VueQRCodeComponent from 'vue-qrcode-component'
  
const app = createApp(App)
installElementPlus(app)
app.use(router);
app.use(i18n);
app.component('qr-code', VueQRCodeComponent);
app.config.globalProperties.$bus = $bus;

app.mount('#app')