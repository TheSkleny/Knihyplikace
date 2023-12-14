<style scoped lang="scss">
 @import "@/assets/main.scss";
</style>
<script setup>
import { ref } from 'vue'
import { supabase } from '@/lib/supabaseClient'
import BookCard from "@/components/BookCard.vue";
import { useRouter } from 'vue-router'
import AddBookDialog from "@/components/AddBookDialog.vue";

const router = useRouter()

const books = ref({
  reading: [],
  unread: [],
  read: []
})

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
  } else {
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
      :is-owned="true"
      @on-reload="getBooks"
  />
<!--  <v-btn-->
<!--      class="btn-bottom-right"-->
<!--      icon="mdi-plus"-->
<!--      color="primary"-->
<!--      elevation="24"-->
<!--      size="50"-->
<!--      @click="routeToAddBook"-->
<!--  />-->
  <v-expansion-panels :model-value="[0]">
    <v-expansion-panel>
      <v-expansion-panel-title>
        <h2>Reading</h2>
      </v-expansion-panel-title>
      <v-expansion-panel-text>
        <div v-if="books.reading.length === 0">
          <h2 class="margin-top-10">No books in this category</h2>
        </div>
        <div v-else>
          <BookCard
            v-for="book in books.reading"
            :key="book.Id"
            :book="book"
            @on-reload="getBooks"
          />
        </div>
      </v-expansion-panel-text>
    </v-expansion-panel>
    <v-expansion-panel>
      <v-expansion-panel-title>
        <h2>Unread</h2>
      </v-expansion-panel-title>
      <v-expansion-panel-text>
        <div v-if="books.unread.length === 0">
          <h2 class="margin-top-10">No books in this category</h2>
        </div>
        <div v-else>
          <BookCard
            v-for="book in books.unread"
            :key="book.Id"
            :book="book"
            @on-reload="getBooks"
          />
        </div>
      </v-expansion-panel-text>
    </v-expansion-panel>
    <v-expansion-panel>
      <v-expansion-panel-title>
        <h2>Read</h2>
      </v-expansion-panel-title>
      <v-expansion-panel-text>
        <div v-if="books.read.length === 0">
          <h2 class="margin-top-10">No books in this category</h2>
        </div>
        <div v-else>
          <BookCard
            v-for="book in books.read"
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
