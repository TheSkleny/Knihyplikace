<style scoped lang="scss">
 @import "@/assets/main.scss";
</style>
<script setup>
import { ref } from 'vue'
import { supabase } from '@/lib/supabaseClient'
import { useRoute, useRouter } from 'vue-router'
import BookForm from "@/components/BookForm.vue";

const route = useRoute()
const router = useRouter()
/**
 * @type {Book}
 */
const bookData = ref(null)

async function getBook() {
  const { data, error } = await supabase
      .from('Book')
      .select(
          `
          Id,
          Name,
          Author,
          GenreId,
          PublishDate,
          Publisher,
          Language,
          Rating,
          Pages,
          PagesRead,
          Description,
          CoverImageLink`
      )
      .eq('Id', route.params.id)
  if (error) {
    console.log('error', error)
  } 
  else {
    bookData.value = data[0]
  }
}

async function onSave(newData) {
  await supabase
      .from('Book')
      .update(newData)
      .eq('Id', route.params.id)
  await getBook()
}

async function onDelete() {
  await supabase
    .from('Book')
    .update({ IsOwned: false })
    .eq('Id', route.params.id)
    .then(() => {
      router.push({ name: 'home' })
    })
}
getBook()
</script>

<template>
  <BookForm
      v-if="bookData"
      :book-data="bookData"
      @on-reload="getBook"
      @on-save="(newData) => onSave(newData)"
      @on-delete="onDelete"
  />
</template>
