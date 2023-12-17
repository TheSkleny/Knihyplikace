<style scoped lang="scss">
 @import "@/assets/main.scss";
</style>
<script setup>
import { ref } from 'vue'
import { supabase } from '@/lib/supabaseClient'
import BookCard from "@/components/BookCard.vue";
import CUDListDialog from '@/components/CUDListDialog.vue';
import AddBookDialog from "@/components/AddBookDialog.vue";
import EditListDialog from "@/components/EditListDialog.vue";

/**
 * @type {Ref<UnwrapRef<BookList[]>>}
 */
const lists = ref([])

/**
 * Fetches all book lists
 */
async function getLists() {
  const { data, error } = await supabase
      .from('BookList')
      .select()
      .neq('Name', 'V seznamu přání')
  if (error) {
    console.log('error', error)
  }
  else {
    lists.value = data
      .map(list => ({
        Id: list.Id,
        ListName: list.Name,
        Book: []
      }));
  }
}

/**
 * Fetches all books in the lists
 * @returns {BookList[]} - The lists with books
 */
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
    // Get all custom book lists
    await getLists()
    // Add the books to the lists
    data.forEach(bookInList => {
      const list = lists.value.find(list => list.ListName === bookInList.BookList.Name);
      if (list) {
        list.Book.push(bookInList.Book);
      }
    });
  }
  return lists.value;
}

/**
 * Reloads the books and book lists
 */
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
  <v-expansion-panels>
    <v-expansion-panel v-for="list in lists" :key="list.ListName" :value="list.ListName">
      <v-expansion-panel-title>
        <h2>{{ list.ListName }}</h2>
        <p class="book_counter--bookshelf">{{ list.Book.length }}</p>
        <v-spacer/>
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
                :selectedList="list.ListName"
                @on-reload="onReload"
            />
          <v-spacer/>
          <EditListDialog :list="list" @on-reload="onReload">
            <template v-slot:trigger="{ openDialog }">
              <v-btn
                  class="margin-20"
                  size="50"
                  color="secondary"
                  icon="mdi-pencil"
                  @click="openDialog"
              />
            </template>
          </EditListDialog>
          <v-spacer/>
        </v-row>
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
  <div class="bottom-div"/>
</template>