import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { useUserState } from './store/userState'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

app.mount('#app')

// Load user data into Pinia store
pinia.use(() => {
  const userStore = useUserState()
  userStore.loadUser()
})
