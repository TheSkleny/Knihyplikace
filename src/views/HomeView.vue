<!-- Filename: HomeView.vue -->
<!-- Author:   Adam Světlík -->
<!-- Login:    xsvetl07     -->
<style scoped lang="scss">
 @import "@/assets/main.scss";
</style>
<script setup>
import { ref } from 'vue'
import { supabase } from '@/lib/supabaseClient'
import BookCard from "@/components/BookCard.vue";
import AddBookDialog from "@/components/AddBookDialog.vue";

/**
 * @type {Ref<UnwrapRef<BookList[]>>}
 */
const books = ref({
  reading: [],
  unread: [],
  read: []
})

/**
 * Library category mapper
 */
const categoryMapper = {
  'Reading': 'Rozečtené',
  'Unread': 'Nepřečtené',
  'Read': 'Přečtené'
}

/**
 * Fetches all books in the library
 */
async function getBooks() {
  books.value.reading = []
  books.value.unread = []
  books.value.read = []
  const { data, error } = await supabase
    .from('Book')
    .select()
    .eq('IsOwned', true)
    .order('LastPageUpdate', { ascending: false })
  if (error) {
    console.log('error', error)
  } 
  else {
    data.forEach((book) => {
      if (book.PagesRead === book.Pages) {
        if (book.Pages === 0) {
          books.value.unread.push(book)
        }
        else {
          books.value.read.push(book)
        }
      }
      else if (book.PagesRead === 0) {
        books.value.unread.push(book)
      } 
      else {
        books.value.reading.push(book)
      }
    })
  }
}
getBooks()
</script>

<template>
  <AddBookDialog
      :isOwned="true"
      @on-reload="getBooks"
  />
  <v-expansion-panels :model-value="[0]">
    <v-expansion-panel v-for="(category, index) in ['Reading', 'Unread', 'Read']" :key="index">
      <v-expansion-panel-title>
        <h2>{{ categoryMapper[category] }}</h2>
        <v-spacer/>
        <p class="book_counter">{{ books[category.toLowerCase()].length}}</p>
      </v-expansion-panel-title>
      <v-expansion-panel-text>
        <div v-if="books[category.toLowerCase()].length === 0">
          <h2 class="bookshelf_no_books">V této kategorii nejsou žádné knihy</h2>
        </div>
        <div v-else>
          <BookCard
            v-for="book in books[category.toLowerCase()]"
            :key="book.Id"
            :book="book"
            @on-reload="getBooks"
          />
        </div>
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
  <div class="bottom-div"/>
</template>