<template>
    <v-container>
      <v-row class="text-center">
        <v-col cols="12">
          <v-img
            class="my-3"
            contain
            height="200"
          />
        </v-col>
  
        <v-col class="mb-4">
          <h1 class="display-2 font-weight-bold mb-3">
            Welcome to Rate My College
          </h1>
  
          <p class="subheading font-weight-regular">
            Find honest reviews from students about colleges across the country
            <br>or share your own experience to help others.
          </p>
        </v-col>
  
        <v-col class="mb-5" cols="12">
          <v-btn color="primary" large to="/colleges">
            Browse Colleges
            <v-icon right>mdi-school</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script>
  export default {
    name: 'Home'
  }
  </script>