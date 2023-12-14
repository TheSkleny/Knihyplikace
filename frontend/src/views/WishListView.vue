<style scoped lang="scss">
 @import "@/assets/main.scss";
</style>
<script setup>
import {ref} from 'vue'
import {supabase} from '@/lib/supabaseClient'
import WishListBookCard from "@/components/WishListBookCard.vue";

const books = ref([])

async function getWishListBooks() {
  books.value = []
  const { data, error } = await supabase
      .from('vWishListBooks')
      .select('Id, Name, Author, CoverImageLink')
  if (error) {
    console.log('error', error)
  }
  else {
    books.value = data
  }
}

getWishListBooks()
</script>

<template>
  <WishListBookCard 
      v-for="book in books" 
      :key="book.Id" 
      :book="book" 
      @on-reload="getWishListBooks"
  />
  <div class="bottom-div"/>
</template>
