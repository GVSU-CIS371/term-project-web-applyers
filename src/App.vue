<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-toolbar-title>Rate My College</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn to="/" text>Home</v-btn>
      <v-btn to="/colleges" text>Colleges</v-btn>
      <v-btn v-if="!user" to="/login" text>Login</v-btn>
      <v-btn v-else @click="signOut" text>Logout</v-btn>
    </v-app-bar>

    <v-main>
      <router-view></router-view>
    </v-main>

    <v-footer color="primary" app>
      <span class="white--text">&copy; {{ new Date().getFullYear() }} Rate My College</span>
    </v-footer>
  </v-app>
</template>

<script>
import { auth } from './firebase'
import { signOut } from 'firebase/auth'

export default {
  name: 'App',
  data() {
    return {
      user: null
    }
  },
  created() {
    auth.onAuthStateChanged(user => {
      this.user = user
    })
  },
  methods: {
    async signOut() {
      try {
        await signOut(auth)
        this.$router.push('/')
      } catch (error) {
        console.error('Error signing out:', error)
      }
    }
  }
}
</script>