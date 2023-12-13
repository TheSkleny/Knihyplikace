<script setup>
import {ref} from 'vue'
import {supabase} from '@/lib/supabaseClient'
import WishListBookCard from "@/components/WishListBookCard.vue";

const books = ref([])

async function getWishListBooks() {
  const {data, error} = await supabase
      .from('BookInBookList')
      .select(`
        Book (
          Id,
          Name,
          Author,
          CoverImageLink
        ),
        BookList (
          Name
        )
      `)
      .eq('BookList.Name', 'V seznamu přání')

  if (error) {
    console.log('error', error)
  }
  else {
    books.value = data
  }
}

getWishListBooks()
</script>

<template>
  <!--  <div>-->
  <!--    <v-container>-->
  <!--      <v-row>-->
  <!--        <v-col>-->
  <!--          <h1 class="wishlist-header">Wish list</h1>-->
  <!--        </v-col>-->
  <!--      </v-row>-->
  <!--      <v-row>-->
  <!--        <v-col>-->
  <!--          <v-list>-->
  <!--            <v-list-item v-for="book in books" :key="book.id">-->
  <!--                <v-list-item-title class="text-h5">{{ book.Name }}</v-list-item-title>-->
  <!--                <v-list-item-subtitle class="text-body-1">{{ book.Author }}</v-list-item-subtitle>-->
  <!--                <v-list-item-subtitle class="text-body-1">{{-->
  <!--                  book.BookList?.Name || ''-->
  <!--                }}</v-list-item-subtitle>-->
  <!--            </v-list-item>-->
  <!--          </v-list>-->
  <!--        </v-col>-->
  <!--      </v-row>-->
  <!--    </v-container>-->
  <!--  </div>-->



 <WishListBookCard v-for="book in books" :key="book.Id" :book="book" />
  <div style="display: block; height: 100px;"/>


</template>


<style scoped>
</style>
