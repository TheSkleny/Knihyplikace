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

/**
 * Fetches book information based on the route parameter
 */
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
          CoverImageLink,
          IsOwned`
      )
      .eq('Id', route.params.id)
  if (error) {
    console.log('error', error)
  } 
  else {
    bookData.value = data[0]
  }
}

/**
 * Saves the updated book data to the database
 * @param {Book} newData - The updated book data
 */
async function onSave(newData) {
  const isRatingChanged = newData.Rating !== bookData.value.Rating
  const isCoverImageLinkChanged = newData.CoverImageLink !== bookData.value.CoverImageLink

  await supabase
    .from('Book')
    .update(newData)
    .eq('Id', route.params.id)

  // Achievement: Anton Ego
  if (isRatingChanged) {
    await supabase
      .rpc('increment_achievement', {
        name_param: 'Anton Ego'
      })
  }
  // Achievement: Cover Connoisseur
  if (isCoverImageLinkChanged) {
    await supabase
      .rpc('increment_achievement', {
        name_param: 'Cover Connoisseur'
      })
  }
  // Reload the book data
  await getBook()
}

/**
 * Deletes the book from the user's library and custom book lists
 * and navigates back to the home page
 */
async function onDelete() {
  await supabase
    .from('BookInBookList')
    .delete()
    .eq('BookId', route.params.id)
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