<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '@/lib/supabaseClient'


const books = ref([])

async function getBooks() {

    const { data, error } = await supabase
      .from('Book')
      .select()
    if (error) console.log('error', error)
    else books.value = data
    return books.value
  }
onMounted(() => {
    getBooks()
  })
</script>

<template>
  <main>
    <div>
      <h1>Home Screen</h1>

      <ul>
        <li v-for="book in books" :key="book.Id">{{ book.Name }}: {{ book.Author }} <v-btn @click="$router.push({name: 'book-detail', params: {id: book.Id}})">See detail</v-btn></li>
      </ul>
      <v-btn @click="$router.push({name: 'add-book'})">Add book</v-btn>
    </div>
  </main>
</template>

