<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

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
];

const activeItem = ref('');

const isActive = (itemName) => activeItem.value === itemName;

const navigateTo = (itemName) => {
  if (!isActive(itemName)) {
    activeItem.value = itemName;
    router.push({ name: itemName });
  }
};
</script>

<template>
  <div class="custom-navbar">
    <div
      v-for="item in navItems"
      :key="item.name"
      @click="navigateTo(item.name)"
      :color="item.color"
      :style="{ color: isActive(item.name) ? item.color : '#000' }"
    >
      <v-icon>{{ item.icon }}</v-icon>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import '@/assets/main.scss';
.custom-navbar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-around;
  padding: 20px;
  background-color: #fff; /* Background color for the navbar */
  box-shadow: 0px -5px 15px rgba(0, 0, 0, 0.1); /* Optional shadow effect */
  z-index: 9999;
}
</style>
