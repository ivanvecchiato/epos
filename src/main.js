import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
import App from './App.vue'
import installElementPlus from './plugins/element'
import router from './router'
import $bus from './event.js';
import VueQRCodeComponent from 'vue-qrcode-component'

function loadLocaleMessages () {
  const locales = require.context('./locales', true, /[A-Za-z0-9-_,\s]+\.json$/i)
  const messages = {}
  locales.keys().forEach(key => {
    const matched = key.match(/([a-z0-9]+)\./i)
    if (matched && matched.length > 1) {
      const locale = matched[1]
      messages[locale] = locales(key)
    }
  })
  return messages
}

const i18n = createI18n({
  locale: process.env.VUE_APP_I18N_LOCALE || 'it',
  fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE || 'it',
  messages: loadLocaleMessages()
})
  
const app = createApp(App)
installElementPlus(app)
app.use(router);
app.use(i18n);
app.component('qr-code', VueQRCodeComponent);
app.config.globalProperties.$bus = $bus;

app.mount('#app')