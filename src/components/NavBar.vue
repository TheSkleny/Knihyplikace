<style lang="scss">
@import "@/assets/main.scss";
</style>
<script setup>
import { computed } from 'vue'
import { useRouter } from "vue-router";

const router = useRouter()

// Navigation items
const navItems = [
  {
    name: 'wish-list',
    icon: 'mdi-book-heart',
    text: 'Přání',
  },
  {
    name: 'bookshelf',
    icon: 'mdi-bookshelf',
    text: 'Knihovny',
  },
  {
    name: 'home',
    icon: 'mdi-home',
    text: 'Domů',
  },
  {
    name: 'gifts',
    icon: 'mdi-gift',
    text: 'Dárky',
  },
  {
    name: 'achievements',
    icon: 'mdi-trophy',
    text: 'Ocenění',
  },
]

// Compute the current active item
const activeItem = computed(() => {
  switch (router.currentRoute.value.name) {
    case 'wish-list':
      return 0
    case 'bookshelf':
      return 1
    case 'home':
      return 2
    case 'gifts':
      return 3
    case 'achievements':
      return 4
    default:
      return null
  }
})
</script>

<template>
  <v-bottom-navigation mode="shift" :model-value="activeItem">
    <v-btn
        style="width: 20%"
        color="primary"
        v-for="item in navItems"
        :key="item.name"
        @click="router.push({ name: item.name })"
    >
      <v-icon>{{ item.icon }}</v-icon>
      <span> {{ item.text }} </span>
    </v-btn>
  </v-bottom-navigation>
</template>