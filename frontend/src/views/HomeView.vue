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
  <main style="margin-bottom: 200px;">
    <div>
      <h1>Home Screen</h1>

            <v-list>
              <v-list-item v-for="book in books" :key="book.Id">
                <v-list-item>
                  <v-list-item-title><h3>{{ book.Name }}</h3></v-list-item-title>
                  <v-list-item-subtitle>{{ book.Author }}</v-list-item-subtitle>
                </v-list-item>
                <v-list-item>
                  <v-btn @click="$router.push({name: 'book-detail', params: {id: book.Id}})">See detail</v-btn>
                </v-list-item>
              </v-list-item>
            </v-list>
            <v-btn @click="$router.push({name: 'add-book'})">Add book</v-btn>
    </div>
  </main>
</template>

