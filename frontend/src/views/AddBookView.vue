<script setup>
import BookForm from '@/components/BookForm.vue'
import {supabase} from "@/lib/supabaseClient";
import {useRouter} from 'vue-router'

const router = useRouter()


/**
 * @function AddBook
 * @async
 *
 * Adds a book to a database and performs navigation.
 *
 * @throws {Error} If there is an error during the Supabase operation.
 *
 * @returns {Promise<void>} A Promise that resolves after successful addition and navigation.
 */
async function AddBook(formData) {
  console.log('formData', formData)
  const {data, error} = await supabase
      .from('Book')
      .insert({...formData, IsOwned: true})
      .select()
  if (error) {
    console.log('error', error)
  }
  else {
    const bookId = data[0].Id
    await router.push({name: 'book-detail', params: {id: bookId}})
  }
}

</script>

<template>
  <BookForm @on-save="AddBook" :is-create="true"/>
</template>
