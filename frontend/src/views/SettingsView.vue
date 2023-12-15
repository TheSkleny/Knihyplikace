<script setup>
import {ref} from "vue";
import {supabase} from "@/lib/supabaseClient";
import {useRouter} from "vue-router";
import DeleteConfirmDialog from "@/components/DeleteConfirmDialog.vue";


const router = useRouter()

const books = ref([])
const genres = ref([])

async function getBooks() {
  books.value = []
  const {data, error} = await supabase
      .from('Book')
      .select()
  if (error) {
    console.log('error', error)
  } else {
    books.value = data
  }
}

async function getGenres() {
  genres.value = []
  const {data, error} = await supabase
      .from('BookGenre')
      .select()
  if (error) {
    console.log('error', error)
  } else {
    genres.value = data
  }
}

async function routeToDetail(id) {
  await router.push({name: 'book-detail', params: {id}})
}

async function deleteBook(id) {
  await supabase
      .from('Book')
      .delete()
      .eq('Id', id)
  // TODO: mby cascade delete?
  await getBooks()
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
            <th>
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
                <DeleteConfirmDialog :title="book.Name" delete-from="Databáze knih" @on-delete="deleteBook(book.Id)">
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
        <p>{{genres}}</p>
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
  <div class="bottom-div">

  </div>
</template>

<style scoped lang="scss">
@import "@/assets/main.scss";
</style>