import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index.ts'
import vuetify from './plugins/vuetify' // Vuetify plugin
import { auth } from './firebase' // Firebase auth
import { onAuthStateChanged } from 'firebase/auth'

// Create Vue app
const app = createApp(App)

// Initialize Firebase auth state listener
let isAuthInitialized = false

onAuthStateChanged(auth, () => {
  if (!isAuthInitialized) {
    isAuthInitialized = true
    app.use(router)
      .use(vuetify)
      .mount('#app')
  }
})
