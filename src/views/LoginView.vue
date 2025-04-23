<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6">
        <v-card>
          <v-card-title class="headline">Login</v-card-title>
          <v-card-text>
            <v-text-field
              v-model="email"
              label="Email"
              prepend-inner-icon="mdi-email"
              type="email"
              required
            />
            <v-text-field
              v-model="password"
              label="Password"
              prepend-inner-icon="mdi-lock"
              type="password"
              required
            />
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" @click="login">Login</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase'; 
import { useRouter } from 'vue-router';

const email = ref('');
const password = ref('');
const router = useRouter();

const login = async () => {
  try {
    console.log('Logging in with:', email.value, password.value);
    const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value);
    console.log('User logged in:', userCredential.user);

    router.push('/');
  } catch (error) {
    console.error('Error logging in:', error);
    alert('Login failed. Please check your email and password.');
  }
};
</script>
