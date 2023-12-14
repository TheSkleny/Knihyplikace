<style scoped lang="scss">
 @import "@/assets/main.scss";
</style>
<script setup>
import {ref} from 'vue'
import {supabase} from '@/lib/supabaseClient'
import BookCard from "@/components/BookCard.vue";
import {useRouter} from 'vue-router'
import CUDListDialog from '@/components/CUDListDialog.vue';

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


getBooksInLists()
</script>

<template>
  <CUDListDialog 
      @on-reload="getLists"
      :selectedList="chosenList"
  />
  <v-expansion-panels v-model="chosenList" @update:model-value="onListChange">
    <v-expansion-panel v-for="list in result" :key="list.ListName" :value="list.ListName">
      <v-expansion-panel-title>
        <h2>{{ list.ListName }}</h2>
      </v-expansion-panel-title>
      <v-expansion-panel-text>
        <div v-if="list.Book.length === 0">
              <h2 class="margin-top-10">No books in this category</h2>
        </div>
        <div v-else>
          <BookCard
              v-for="book in list.Book"
              :key="book.id"
              :book="book"
              @on-reload="getBooksInLists"
          />
        </div>
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
  <div class="bottom-div"/>
</template>
