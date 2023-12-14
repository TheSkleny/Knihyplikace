<style scoped lang="scss">
 @import "@/assets/main.scss";
</style>
<script setup>
import BookForm from '@/components/BookForm.vue'
import {supabase} from "@/lib/supabaseClient";
import {useRouter} from 'vue-router'

const router = useRouter()

async function AddBook(formData) {
  const {data, error} = await supabase
      .from('Book')
      .insert({...formData, IsOwned: true})
      .select()
  if (error) console.log('error', error)
  else {
    const bookId = data[0].Id
    await router.push({name: 'book-detail', params: {id: bookId}})
  }
}
</script>

<template>
  <BookForm @on-save="AddBook" :is-create="true"/>
</template>
