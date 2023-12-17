<style lang="scss">
@import "@/assets/main.scss";
</style>
<script setup>
import {ref, computed} from 'vue'
import {useRouter} from "vue-router";

const router = useRouter()
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

const activeItem = ref(null)

async function routeTo(routeName) {
  await router.push({name: routeName})
  switch (routeName) {
    case 'wish-list':
      activeItem.value = 0
      break
    case 'bookshelf':
      activeItem.value = 1
      break
    case 'home':
      activeItem.value = 2
      break
    case 'gifts':
      activeItem.value = 3
      break
    case 'achievements':
      activeItem.value = 4
      break
    default:
      activeItem.value = null
  }
}
</script>

<template>
  <v-bottom-navigation mode="shift" v-model="activeItem">
    <v-btn
        style="width: 20%"
        color="primary"
        v-for="item in navItems"
        :key="item.name"
        @click="routeTo(item.name)"
    >
      <v-icon>{{ item.icon }}</v-icon>
      <span> {{ item.text }} </span>
    </v-btn>
  </v-bottom-navigation>
</template>