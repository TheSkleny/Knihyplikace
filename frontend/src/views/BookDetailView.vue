<script setup>
import {ref} from 'vue'
import {supabase} from '@/lib/supabaseClient'
import {useRoute, useRouter} from 'vue-router'
import BookForm from "@/components/BookForm.vue";



const route = useRoute()
const router = useRouter()
const bookData = ref(null)

async function getBook() {
  console.log("route.params.id")
  console.log(route.params.id)
  const {data, error} = await supabase
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
  } else {
    console.log('data')
    console.log(data[0])
    bookData.value = data[0]
    console.log(bookData.value.Name)
  }
}

async function onSave(newData) {
  const {data, error} = await supabase
      .from('Book')
      .update(newData)
      .eq('Id', route.params.id)
  if (error) console.log('error', error)
  else console.log(data)
  await getBook()
}

async function onDelete() {
  await supabase
      .from('Book')
      .delete()
      .eq('Id', route.params.id)
      .then(() => {
        router.push({name: 'home'})
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

<style scoped>

</style>
