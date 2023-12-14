import './assets/main.scss'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import 'vuetify/dist/vuetify.min.css'
import '@mdi/font/css/materialdesignicons.css'

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    themes: {
      light: {
        dark: true,
        colors: {
          primary: '#009688',
          primary_dark: '#007575',
          primary_light: '#00c5c5',
          secondary: '#666666',
          secondary_dark: '#4d4d4d',
          secondary_light: '#808080',
          black: '#000000',
          white: '#ffffff',
          error: '#d24c41',
        }
      }
    }
  }
})

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(vuetify)

app.mount('#app')
