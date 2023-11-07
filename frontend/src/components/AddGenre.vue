<script setup>
import { ref } from 'vue'
import { supabase } from '@/lib/supabaseClient'

const genre = ref([])
const name = ref('')

/**
 * Add a new genre to the database
 *
 * @returns {Promise<void>}
 */
async function addGenre() {
  try {
    const { data, error } = await supabase.from('BookGenre').insert([{ Name: name.value }])
    if (error) {
      console.log('error', error)
    } else {
      console.log('data', data)
      genre.value = data
    }
  } catch (error) {
    console.log('error', error)
  }
}
</script>

<template>
  <div>
    <v-sheet width="300" class="mx-auto">
      <v-form @submit="addGenre">
        <v-text-field v-model="name" label="First name"></v-text-field>
        <v-btn type="submit" class="mt-2">Submit</v-btn>
      </v-form>
    </v-sheet>
  </div>
</template>

<style scoped></style>
