<script setup>
import {defineProps} from 'vue'

const props = defineProps({
  title: {
    type: String,
    required: true
  }
})
</script>

<template>
  <v-card class="book_card_header">
    <h1>{{ props.title }}</h1>
  </v-card>
</template>

<style scoped>
.book_card_header {
  width: 90%;
  display: block;
  padding-left: 10px;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 20px;
  background: lightgray;
}
</style>