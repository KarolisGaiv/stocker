import './assets/main.css'
import 'vue-toastification/dist/index.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import Toast from 'vue-toastification'
import type { PluginOptions } from 'vue-toastification'
import { useUserState } from './store/userState'

const app = createApp(App)
const pinia = createPinia()

const options: PluginOptions = {
  closeOnClick: true
}

app.use(pinia)
app.use(router)
app.use(Toast, options)

app.mount('#app')

// Load user data into Pinia store
pinia.use(() => {
  const userStore = useUserState()
  userStore.loadUser()
})
