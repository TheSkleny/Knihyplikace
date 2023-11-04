<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '@/lib/supabaseClient'
import {el} from "vuetify/locale";

const genre = ref([])
const name = ref('')


async function addGenre() {
  try {
    const { data, error } = await supabase.from('BookGenre').insert([
      { Name: name.value }
    ])
    if (error) {
      console.log('error', error)
    }
    else {
      console.log('data', data)
      genre.value = data
    }
  } catch (error) {
    console.log('error', error)
  }
}


</script>

<template>
  <v-btn @click="getGenre">Get Genre</v-btn>
  <main>
    <div>
      <h1>Genre Screen</h1>
      <ul>
        <li v-for="genre in genre" :key="genre.id">{{ genre.Name }}</li>
      </ul>
    </div>
    <div>
      <v-sheet width="300" class="mx-auto">
        <v-form @submit="addGenre">
          <v-text-field
              v-model="name"
              label="First name"
          ></v-text-field>
          <v-btn type="submit" class="mt-2">Submit</v-btn>
        </v-form>
      </v-sheet>
    </div>
  </main>
</template>