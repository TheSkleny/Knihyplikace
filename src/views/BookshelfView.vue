<style scoped lang="scss">
 @import "@/assets/main.scss";
</style>
<script setup>
import { ref } from 'vue'
import { supabase } from '@/lib/supabaseClient'
import BookCard from "@/components/BookCard.vue";
import CUDListDialog from '@/components/CUDListDialog.vue';
import AddBookDialog from "@/components/AddBookDialog.vue";

const result = ref([])
const chosenList = ref('')

async function getLists() {
  const { data, error } = await supabase.from('BookList').select()
  if (error) console.log('error', error)
  else {
    result.value = data
      .filter(list => list.Name !== 'V seznamu přání')
      .map(list => ({
        ListName: list.Name,
        Book: []
      }));
  }
}

async function getBooksInLists() {
  const { data, error } = await supabase
      .from('BookInBookList')
      .select(`
        Book (*),
        BookList (
          Name
        )
      `)

  if (error) console.log('error', error)
  else {
    await getLists()
    data.forEach(bookInList => {
      const list = result.value.find(list => list.ListName === bookInList.BookList.Name);
      if (list) {
        list.Book.push(bookInList.Book);
      }
    });
  }
  return result.value;
}

function onListChange(newValue) {
  if (!newValue) {
    chosenList.value = '';
  }
}

function onReload() {
  getLists();
  getBooksInLists();
}

getBooksInLists()
</script>

<template>
  <CUDListDialog
      @on-reload="onReload"
  >
    <template v-slot:trigger="{ openDialog }">
      <v-btn
          icon="mdi-plus"
          color="primary"
          class="btn-bottom-right"
          @click.prevent="openDialog"
      />
    </template>
  </CUDListDialog>
  <v-expansion-panels v-model="chosenList" @update:model-value="onListChange">
    <v-expansion-panel v-for="list in result" :key="list.ListName" :value="list.ListName">
      <v-expansion-panel-title>
        <h2>{{ list.ListName }}</h2>
        <p class="book_counter--bookshelf">{{ list.Book.length }}</p>
        <v-spacer/>
<!--        <DeleteConfirmDialog :title="book.Name" delete-from=" Databáze knih" @on-delete="deleteBook(book.Id)">-->
<!--          <template v-slot:trigger="{ openDialog }">-->
<!--            <v-btn-->
<!--                icon="mdi-delete"-->
<!--                color="error"-->
<!--                size="30"-->
<!--                variant="text"-->
<!--                @click.prevent="openDialog"-->
<!--            />-->
<!--          </template>-->
<!--        </DeleteConfirmDialog>-->
<!--        -->
        <CUDListDialog
            @on-reload="onReload"
            :selectedList="list.ListName"
        >
          <template v-slot:trigger="{ openDialog }">
            <v-btn
                icon="mdi-pencil"
                variant="text" size="40"
                style="margin-right: 20px"
                @click.prevent="openDialog"
            />
          </template>
        </CUDListDialog>
      </v-expansion-panel-title>
      <v-expansion-panel-text>
        <div v-if="list.Book.length === 0">
              <h2 class="bookshelf_no_books">V této kategorii nejsou žádné knihy</h2>
        </div>
        <div v-else>
          <BookCard
              v-for="book in list.Book"
              :key="book.id"
              :book="book"
              @on-reload="getBooksInLists"
          />
        </div>
        <v-row>
          <v-spacer/>
            <AddBookDialog
                :isBookshelf="true"
                :selectedList="chosenList"
                @on-reload="onReload"
            />
          <v-spacer/>
        </v-row>
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
  <div class="bottom-div"/>
</template>