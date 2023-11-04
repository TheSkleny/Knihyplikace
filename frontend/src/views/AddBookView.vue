<script setup>
import {ref, onMounted} from 'vue'
import {supabase} from '@/lib/supabaseClient'
import { isNumberOrNull, isRequired } from "@/utils/inputRules";
import { useRouter } from "vue-router";

const router = useRouter()
const formData = ref({
  Name: null,
  Author: null,
  GenreId: null,
  PublishDate: null,
  Publisher: null,
  Language: null,
  Pages: null,
  PagesRead: null,
  Description: null,
  CoverImageLink: null,
})

const genre_list = ref([])

async function getGenre() {
  const {data, error} = await supabase.from('BookGenre').select('Name, Id')
  if (error) {
    console.log('error', error)
  } else {
    genre_list.value = data
    console.log('data', data)
  }
}

async function AddBook() {
  console.log({...formData.value})
  const {data, error} = await supabase.from('Book').insert([
    {...formData.value}]).select()
  if (error) {
    console.log('error', error)
  } else {
    console.log('data', data)
    Object.keys(formData.value).forEach(key => {
      formData.value[key] = null
    })
    const bookId = data[0].Id
    await router.push({name: 'book-detail', params: {id: bookId}})
  }


}

onMounted(async () => {
  await getGenre()
})
</script>

<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>
            <h1>Add Book</h1>
          </v-card-title>
          <v-spacer/>
          <v-card-text>
            <v-form @submit.prevent="AddBook">
              <v-container>
                <v-text-field
                    v-model="formData.Name"
                    label="Name"
                    :rules="[isRequired]"
                />

                <v-text-field
                    v-model="formData.Author"
                    label="Author"
                    :rules="[isRequired]"
                />
                <v-select
                    v-model="formData.GenreId"
                    :items="genre_list"
                    label="Genre"
                    item-title="Name"
                    item-value="Id"
                />

                <v-text-field
                    v-model="formData.PublishDate"
                    label="Publish Year"
                />

                <v-text-field
                    v-model="formData.Publisher"
                    label="Publisher"
                />

                <v-text-field
                    v-model="formData.Language"
                    label="Language"
                />

                <v-text-field
                    v-model="formData.Pages"
                    label="Pages"
                    :rules="[isNumberOrNull]"
                />

                <v-text-field
                    v-model="formData.PagesRead"
                    label="Pages read"
                    :rules="[isNumberOrNull]"
                />

                <v-text-field
                    v-model="formData.Description"
                    label="Description"
                />

                <v-text-field
                    v-model="formData.CoverImageLink"
                    label="Link to image"
                />

                <v-btn type="submit">Add Book</v-btn>
                <v-spacer/>
              </v-container>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>


