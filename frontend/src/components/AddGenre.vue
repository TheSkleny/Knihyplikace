<style lang="scss">
 @import "@/assets/main.scss";
</style>
<script setup>
import { ref } from 'vue'
import { supabase } from '@/lib/supabaseClient'

const name = ref('')

async function addGenre() {
  await supabase
      .from('BookGenre')
      .insert([{ Name: name.value }])
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