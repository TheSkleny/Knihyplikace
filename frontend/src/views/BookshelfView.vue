<script setup>
import {ref} from 'vue'
import {supabase} from '@/lib/supabaseClient'
import BookCard from "@/components/BookCard.vue";

const result = ref([])


async function getLists() {
  const {data, error} = await supabase.from('BookList').select()
  if (error) console.log('error', error)
  else {
    result.value = data.map(list => ({ ListName: list.Name, Book: [] }));
    console.log(result.value)
    result.value = result.value.filter(list => list.ListName !== 'V seznamu přání');
  }
}

async function getBooksInLists() {
  const {data, error} = await supabase
      .from('BookInBookList')
      .select(`
        Book (*),
        BookList (
          Name
        )
      `)

  if (error) {
    console.log('error', error)
  }
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

getBooksInLists()
</script>

<template>
  <v-expansion-panels>
    <v-expansion-panel v-for="list in result" :key="list.ListName">
      <v-expansion-panel-title>
        <h2>{{ list.ListName }}</h2>
      </v-expansion-panel-title>
      <v-expansion-panel-text>
        <div v-if="list.Book.length === 0">
              <h2 style="margin-top: 10px">No books in this category</h2>
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
</template>

<style scoped>

</style>