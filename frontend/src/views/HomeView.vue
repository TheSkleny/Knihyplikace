<script setup>
import {ref} from 'vue'
import {supabase} from '@/lib/supabaseClient'
import BookCard from "@/components/BookCard.vue";
import BookCategoryHeader from "@/components/BookCategoryHeader.vue";

const booksRead = ref([])
const booksUnread = ref([])
const booksReading = ref([])

async function getBooks() {
  booksRead.value = []
  booksUnread.value = []
  booksReading.value = []
  const {data, error} = await supabase.from('Books').select().eq('IsOwned', true)
  if (error) console.log('error', error)
  else {
    console.log(data)
    data.forEach((book) => {
      if (book.PagesRead === book.Pages) {
        booksRead.value.push(book)
      }
      else if (book.PagesRead === 0) {
        booksUnread.value.push(book)
      }
      else {
        booksReading.value.push(book)
      }
    })
  }
}
getBooks()
</script>

<template>
  <BookCategoryHeader title="Reading" />
  <div v-if="booksReading.length === 0">
    <v-card class="book_card">
      <v-card-title>
        <h2>No books in this category</h2>
      </v-card-title>
    </v-card>
  </div>
  <div v-else>
    <BookCard  v-for="book in booksReading" :key="book.id" :book="book" @onReload="getBooks"/>
  </div>
  <BookCategoryHeader title="Unread" />
  <div v-if="booksUnread.length === 0">
    <v-card class="book_card">
      <v-card-title>
        <h2>No books in this category</h2>
      </v-card-title>
    </v-card>
  </div>
  <div v-else>
    <BookCard  v-for="book in booksUnread" :key="book.id" :book="book" @onReload="getBooks"/>
  </div>  <BookCategoryHeader title="Read" />
  <div v-if="booksRead.length === 0">
    <v-card class="book_card">
      <v-card-title>
        <h2>No books in this category</h2>
      </v-card-title>
    </v-card>
  </div>
  <div v-else>
    <BookCard  v-for="book in booksRead" :key="book.id" :book="book" @onReload="getBooks"/>
  </div>
  <div style="display: block; height: 100px;"/>
</template>
<style scoped>
  .book_card {
    width: 90%;
    display: block;
    padding-left: 10px;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 20px;
  }
</style>