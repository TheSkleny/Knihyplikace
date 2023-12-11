<script setup>
import {computed, ref} from 'vue'
import router from "@/router";


const navItems = [
  {
    name: 'wish-list',
    icon: 'mdi-book-heart',
    text: 'Wishlist',
    color: 'pink',
  },
  {
    name: 'bookshelf',
    icon: 'mdi-bookshelf',
    text: 'Bookshelfs',
    color: 'blue'
  },
  {
    name: 'home',
    icon: 'mdi-home',
    text: 'Home',
    color: 'brown'
  },
  {
    name: 'gifts',
    icon: 'mdi-gift',
    text: 'Gifts',
    color: 'red'
  },
  {
    name: 'achievements',
    icon: 'mdi-trophy',
    text: 'Achievements',
    color: 'green'
  },
]

// const activeItem = ref(0)
// console.log(router.name)
// activeItem.value = computed(() => {
//   const index = navItems.findIndex((item) => item.name === router.name)
//   return index > -1 ? index : 0
// })
// console.log(activeItem.value)
</script>

<template>
  <v-bottom-navigation mode="shift">
    <v-btn style="max-width: 20%" :color="item.color" v-for="item in navItems" :key="item.name" @click="$router.push({ name: item.name })">
      <v-icon>{{ item.icon }}</v-icon>
      <span> {{ item.text }} </span>
    </v-btn>
  </v-bottom-navigation>
</template>
