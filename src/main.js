// import './assets/main.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './styles/theme.css'

import 'vuetify/styles' // Vuetify CSS
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import './assets/main.css'
import 'flowbite'

import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'

const vuetify = createVuetify({
  components,
  directives,
})

createApp(App)
  .use(vuetify)
  .use(router)
  .use(Toast, {
    position: 'bottom-right', // sağ alt
    timeout: 4000,            // 4 saniye sonra kaybolur
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  })
  .mount('#app')


