<script setup>
import {ref} from 'vue'
import {supabase} from '@/lib/supabaseClient'
import BookCard from "@/components/BookCard.vue";
import BookCategoryHeader from "@/components/BookCategoryHeader.vue";
import {useRouter} from 'vue-router'


const router = useRouter()

const booksRead = ref([])
const booksUnread = ref([])
const booksReading = ref([])

async function getBooks() {
  booksRead.value = []
  booksUnread.value = []
  booksReading.value = []
  const {data, error} = await supabase
      .from('Book')
      .select()
      .eq('IsOwned', true)
      .order('LastPageUpdate', {ascending: false})
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

async function routeToAddBook() {
  await router.push({name: 'add-book'})
}

getBooks()
</script>

<template>
  <v-btn
      class="btn-bottom-right"
      icon="mdi-plus"
      color="primary"
      elevation="24"
      size="50"
      @click="routeToAddBook"
  />
  <v-expansion-panels :model-value="[0]">
    <v-expansion-panel>
      <v-expansion-panel-title>
        <h2>Reading</h2>
      </v-expansion-panel-title>
      <v-expansion-panel-text>
        <div v-if="booksReading.length === 0">
          <h2 style="margin-top: 10px">No books in this category</h2>
        </div>
        <div v-else>
          <BookCard
              v-for="book in booksReading"
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
        <div v-if="booksUnread.length === 0">
          <h2 style="margin-top: 10px">No books in this category</h2>
        </div>
        <div v-else>
          <BookCard
              v-for="book in booksUnread"
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
        <div v-if="booksRead.length === 0">
          <h2 style="margin-top: 10px">No books in this category</h2>
        </div>
        <div v-else>
          <BookCard
              v-for="book in booksRead"
              :key="book.Id"
              :book="book"
              @on-reload="getBooks"
          />
        </div>
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
  <div style="display: block; height: 100px;"/>


</template>
<style scoped>
  .btn-bottom-right {
    position: fixed;
    bottom: 70px;
    right: 20px;
    z-index: 9999;
  }
</style>