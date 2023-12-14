<style scoped lang="scss">
 @import "@/assets/main.scss";
</style>
<script setup>
import { defineProps, computed } from 'vue'

const DEFAULT_COVER = 'https://cdn.vuetifyjs.com/images/parallax/material.jpg'
const cover = computed(() => props.book.CoverImageLink ?? DEFAULT_COVER)

const props = defineProps({
  book: {
    type: Object,
    required: true
  }
})

async function removeBook() {
  // TODO: remove book from wishlist
}

async function moveToLibrary() {
  // TODO: move book from wishlist to library
}

</script>

<template>
  <v-card class="book_card--wishlist" :to="`/book-detail/${ props.book.Id }`">
    <v-row>
      <v-col class="max-width-150px">
        <v-img class="book_card_img"
               :src="cover"
               cover
        />
      </v-col>
      <v-col class="book_card_content">
        <v-row>
          <h1 class="h1-card">
            {{ props.book.Name }}
          </h1>
        </v-row>
        <v-row>
          <h2>
            {{ props.book.Author }}
          </h2>
        </v-row>
        <v-row>
          <v-col>
            <v-btn @click.prevent="removeBook" color="red" size="40px" icon="mdi-trash-can"/>
          </v-col>
          <v-col>
            <v-btn class="margin-top-5" @click.prevent="moveToLibrary">Bought</v-btn>
          </v-col>

        </v-row>
      </v-col>
    </v-row>
  </v-card>
</template>
