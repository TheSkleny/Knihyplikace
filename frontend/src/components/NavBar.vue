<style lang="scss">
 @import "@/assets/main.scss";
</style>
<script setup>
import {useRouter} from "vue-router";

const router = useRouter()

const navItems = [
  {
    name: 'wish-list',
    icon: 'mdi-book-heart',
    text: 'Seznam přání',
    color: 'pink',
  },
  {
    name: 'bookshelf',
    icon: 'mdi-bookshelf',
    text: 'Knihovny',
    color: 'blue'
  },
  {
    name: 'home',
    icon: 'mdi-home',
    text: 'Domů',
    color: 'brown'
  },
  {
    name: 'gifts',
    icon: 'mdi-gift',
    text: 'Dárky',
    color: 'red'
  },
  {
    name: 'achievements',
    icon: 'mdi-trophy',
    text: 'Ocenění',
    color: 'green'
  },
]
</script>

<template>
  <v-bottom-navigation mode="shift">
    <v-btn
        style="max-width: 20%"
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