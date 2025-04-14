<!-- src/components/Layout/Navbar.vue -->
<template>
    <nav>
      <div class="logo">
        <router-link to="/">EduRanks</router-link>
      </div>
      <div class="nav-links">
        <router-link to="/browse">Browse</router-link>
        <router-link to="/dashboard">Dashboard</router-link>
        <router-link to="/login">Login</router-link>
      </div>
    </nav>
  </template>
  
  <script>
  export default {
    name: 'Navbar',
  }
  </script>
  