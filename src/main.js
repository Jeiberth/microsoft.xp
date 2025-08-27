import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { createI18n } from 'vue-i18n'
import en from './locales/en.json'
import fr from './locales/fr.json'
import es from './locales/es.json'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'

const i18n = createI18n({
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en,
    fr,
    es
  }
})

createApp(App).use(store).use(router).use(i18n).mount('#app')
