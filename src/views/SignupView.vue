<template>
  <v-container>
    <h1>Sign Up</h1>
    <v-form @submit.prevent="signUp">
      <v-text-field v-model="email" label="Email" required></v-text-field>
      <v-text-field v-model="password" label="Password" type="password" required></v-text-field>
      <v-text-field v-model="name" label="Name" required></v-text-field> 
      <v-btn type="submit" color="primary">Sign Up</v-btn>
    </v-form>
  </v-container>
</template>

<script>
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth } from '../firebase';
import { db } from '../firebase'; 

export default {
  data() {
    return {
      email: '',
      password: '',
      name: '' 
    };
  },
  methods: {
    async signUp() {
      try {
        // Create user with email and password
        const userCredential = await createUserWithEmailAndPassword(auth, this.email, this.password);
        const user = userCredential.user;

        await setDoc(doc(db, 'users', user.uid), {
          email: user.email,
          name: this.name,
          createdAt: new Date()
        });

        console.log('User signed up and data saved:', user);
        this.$router.push('/'); //  home page
      } catch (error) {
        console.error('Error signing up:', error);
      }
    }
  }
};
</script>