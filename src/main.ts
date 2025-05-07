import './assets/main.css'

import '@mdi/font/css/materialdesignicons.css'

import '@fontsource/roboto/500.css'
import '@fontsource/roboto-mono/500.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import { mdi, aliases } from 'vuetify/iconsets/mdi'
import { md3 } from 'vuetify/blueprints'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import App from './App.vue'
import router from './router'

const app = createApp(App)
const vuetify = createVuetify({
  components,
  directives,
  blueprint: md3,
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: { mdi },
  },
})

app.use(createPinia())
app.use(router)
app.use(vuetify)

app.mount('#app')
