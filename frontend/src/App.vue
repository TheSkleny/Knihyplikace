<script setup>
import { RouterLink, RouterView } from 'vue-router'
import NavBar from './components/NavBar.vue'

</script>

<template>
  <v-app>
  <RouterView />
  <NavBar/>
</v-app>
</template>