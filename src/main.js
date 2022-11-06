import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import "bootstrap-icons/font/bootstrap-icons.css"
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"

//import './assets/main.css'

const app = createApp(App)
app.config.unwrapInjectedRef = true
app.use(createPinia())
app.use(router)

app.mount('#app')
