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
        <li v-for="book in books" :key="book.id">{{ book.name }}</li>
      </ul>
    </div>
  </main>
</template>

