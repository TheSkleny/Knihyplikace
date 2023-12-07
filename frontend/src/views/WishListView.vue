<script setup>
import {ref, onMounted} from 'vue'
import {supabase} from '@/lib/supabaseClient'
import BookCard from "@/components/BookCard.vue";
import WishListBookCard from "@/components/WishListBookCard.vue";

const books = ref([])

async function getWishListBooks() {
  const {data, error} = await supabase
      .from('BookInList')
      .select(`
        Books (
          Id,
          Name,
          Author,
          CoverImageLink
        ),
        Lists (
          Name
        )
      `)
      .eq('Lists.Name', 'V seznamu přání')

  if (error) {
    console.log('error', error)
  }
  else {
    console.log(data)
    books.value = data
  }
  return books.value
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




 <WishListBookCard v-for="book in books" :key="book.id" :book="book" />


</template>


<style scoped>
.wishlist-header {
  font-size: 2rem;
  margin-bottom: 2rem;
}
</style>
