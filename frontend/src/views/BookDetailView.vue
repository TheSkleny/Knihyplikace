<script setup>
import { ref } from 'vue'
import { supabase } from '@/lib/supabaseClient'
import { useRoute } from 'vue-router'

const route = useRoute()
const bookData = ref(null)

async function getBook() {
  const { data, error } = await supabase
    .from('Books')
    .select(
      'Name, Author, GenreId (Name), PublishDate, Publisher, Language, Pages, PagesRead, Description, CoverImageLink'
    )
    .eq('Id', route.params.id)
  if (error) console.log('error', error)
  else bookData.value = data[0]
}

getBook()
</script>

<template>
  <main>
    <div v-if="!bookData">Loading ...</div>
    <div v-else class="wish-list">
      <h1>Book detail {{ $route.params.id }}</h1>
      <p v-for="(value, key) in bookData" :key="key">{{ key }}: {{ value }}</p>
    </div>
  </main>
</template>
