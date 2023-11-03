<script setup>
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
</script>

<template>
  <header>
    <v-row>
      <v-col cols="4"><router-link :to="{ name: 'home' }">home</router-link></v-col>
      <v-col cols="4"><router-link :to="{ name: 'vuetify' }">fuet</router-link></v-col>
      <v-col cols="4"><router-link :to="{ name: 'about' }">about</router-link></v-col>
    </v-row>
  </header>

  <RouterView />
</template>
