<script setup></script>

<template>
  <v-bottom-navigation active="true" color="secondary">
    <v-btn icon @click="$router.push({ name: 'wish-list' })">
      <v-icon>mdi-heart</v-icon>
      <span> Wish list </span>
    </v-btn>
    <v-btn icon @click="$router.push({ name: 'home' })">
      <v-icon>mdi-home</v-icon>
      <span> Home </span>
    </v-btn>
    <v-btn icon @click="$router.push({ name: 'achievements' })">
      <v-icon>mdi-trophy</v-icon>
      Achievements
    </v-btn>
  </v-bottom-navigation>
</template>
