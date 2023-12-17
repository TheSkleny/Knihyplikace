<!-- Filename: SettingsView.vue -->
<!-- Author:   Lukáš Zavadil    -->
<!-- Login:    xzavad20         -->
<style scoped lang="scss">
@import "@/assets/main.scss";
</style>
<script setup>
import { ref } from "vue";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "vue-router";
import DeleteConfirmDialog from "@/components/DeleteConfirmDialog.vue";
import GenreDialog from "@/components/GenreDialog.vue";

const router = useRouter()
/**
 * @type {Ref<UnwrapRef<Book[]>>}
 */
const books = ref([])
/**
 * @type {Ref<UnwrapRef<Genre[]>>}
 */
const genres = ref([])

/**
 * Fetches all books in the database
 */
async function getBooks() {
  books.value = []
  const {data, error} = await supabase
      .from('Book')
      .select()
  if (error) {
    console.log('error', error)
  }
  else {
    books.value = data
  }
}

/**
 * Fetches all genres in the database
 */
async function getGenres() {
  genres.value = []
  const {data, error} = await supabase
      .from('BookGenre')
      .select()
  if (error) {
    console.log('error', error)
  }
  else {
    genres.value = data
  }
}

/**
 * Routes to the book detail page
 * @param {number} id - The book id
 */
async function routeToDetail(id) {
  await router.push({name: 'book-detail', params: {id}})
}

/**
 * Deletes the book from the database
 * @param {number} id - The book id
 */
async function deleteBook(id) {
  // Delete all references to the book
  await supabase
    .from('BookInBookList')
    .delete()
    .eq('BookId', id)
  await supabase
    .from('GiftList')
    .delete()
    .eq('BookId', id)
  await supabase
    .from('Book')
    .delete()
    .eq('Id', id)
  // Reload the books
  await getBooks()
}

/**
 * Deletes the genre from the database
 * @param {number} id - The genre id
 */
async function deleteGenre(id) {
  await supabase
    .from('BookGenre')
    .delete()
    .eq('Id', id)
  // Reload the genres
  await getGenres()
}
getBooks()
getGenres()
</script>

<template>
  <v-expansion-panels>
    <v-expansion-panel>
      <v-expansion-panel-title>
        <h2>Knihy v databázi</h2>
        <v-spacer/>
        <p class="book_counter">{{ books.length }}</p>
      </v-expansion-panel-title>
      <v-expansion-panel-text>
        <v-table>
          <thead>
          <tr>
            <th>
              Název
            </th>
            <th>
              Autor
            </th>
            <th style="width: 90px">
              Akce
            </th>
          </tr>
          </thead>
          <tbody>
          <tr
              v-for="book in books"
              :key="book.Id"
          >
            <td>
              {{ book.Name }}
            </td>
            <td>
              {{ book.Author }}
            </td>
            <td>
              <v-row>
                <v-btn
                    icon="mdi-pencil"
                    size="30"
                    variant="text"
                    style="margin-right: 15px"
                    @click.prevent="routeToDetail(book.Id)"
                />
                <DeleteConfirmDialog :title="book.Name" delete-from=" Databáze knih" @on-delete="deleteBook(book.Id)">
                  <template v-slot:trigger="{ openDialog }">
                    <v-btn
                        icon="mdi-delete"
                        color="error"
                        size="30"
                        variant="text"
                        @click.prevent="openDialog"
                    />
                  </template>
                </DeleteConfirmDialog>
              </v-row>
            </td>
          </tr>
          </tbody>
        </v-table>
      </v-expansion-panel-text>
    </v-expansion-panel>
    <v-expansion-panel>
      <v-expansion-panel-title>
        <h2>Žánry</h2>
        <v-spacer/>
        <p class="book_counter">{{ genres.length }}</p>
      </v-expansion-panel-title>
      <v-expansion-panel-text>
        <v-table>
          <thead>
          <tr>
            <th>
              Název
            </th>
            <th>
              Akce
            </th>
          </tr>
          </thead>
          <tbody>
          <tr
              v-for="genre in genres"
              :key="genre.Id"
          >
            <td>
              {{ genre.Name }}
            </td>
            <td>
              <v-row>
                <GenreDialog :genre="genre" @on-reload="getGenres">
                  <template v-slot:trigger="{ openDialog }">
                    <v-btn
                        icon="mdi-pencil"
                        size="30"
                        variant="text"
                        style="margin-right: 15px"
                        @click.prevent="openDialog"
                    />
                  </template>
                </GenreDialog>
                <DeleteConfirmDialog :title="genre.Name" delete-from=" Databáze žánrů" @on-delete="deleteGenre(genre.Id)">
                  <template v-slot:trigger="{ openDialog }">
                    <v-btn
                        icon="mdi-delete"
                        color="error"
                        size="30"
                        variant="text"
                        @click.prevent="openDialog"
                    />
                  </template>
                </DeleteConfirmDialog>
              </v-row>
            </td>
          </tr>
          </tbody>
        </v-table>
            <GenreDialog @on-reload="getGenres">
            <template v-slot:trigger="{ openDialog }">
              <v-btn
                  style="display: block; margin-left: auto; margin-right: auto; margin-top: 10px;"
                  color="primary"
                  icon="mdi-plus"
                  size="40"
                  @click.prevent="openDialog"
              />
            </template>
          </GenreDialog>
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
  <div class="bottom-div"/>
</template>