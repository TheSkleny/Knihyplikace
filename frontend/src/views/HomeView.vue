<script setup>
import {ref} from 'vue'
import {supabase} from '@/lib/supabaseClient'
import BookCard from "@/components/BookCard.vue";


const books = ref([])


async function getBooks() {
  const {data, error} = await supabase.from('Books').select()
  if (error) console.log('error', error)
  else books.value = data
}

getBooks()
</script>

<template>
  <BookCard v-for="book in books" :key="book.id" :book="book" @onReload="getBooks"/>
  <div style="display: block; height: 100px;"/>
</template>
