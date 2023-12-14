<script setup>
import { defineProps, computed } from 'vue'

/**
 *
 * @type {Prettify<Readonly<ExtractPropTypes<{showButton: {default: boolean, type: BooleanConstructor, required: boolean},
 * book: {default: (function(): Book), type: ObjectConstructor, required: boolean}}>>>}
 */
const props = defineProps({
  book: {
    type: Object,
    required: true
  },
  showButton: {
    type: Boolean,
    required: false,
    default: true
  }
})

const DEFAULT_COVER = 'https://cdn.vuetifyjs.com/images/parallax/material.jpg'
const cover = computed(() => props.book.CoverImageLink ?? DEFAULT_COVER)

async function removeBook() {
  // TODO: remove book from wishlist
}

async function moveToLibrary() {
  // TODO: move book from wishlist to library
}

</script>

<template>
  <v-card class="book_card" :to="`/book-detail/${ props.book.Id }`">
    <v-row>
      <v-col style="max-width: 150px">
        <v-img class="book_card_img"
               :src="cover"
               cover
        />
      </v-col>
      <v-col class="book_card_content">
        <v-row>
          <h1 style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap">
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
            <v-btn
                @click.prevent="removeBook"
                color="red"
                size="40px"
                icon="mdi-trash-can"
            />
          </v-col>
          <v-col>
            <v-btn
                v-if="props.showButton"
                style="margin-top: 5px"
                @click.prevent="moveToLibrary"
            >
              Bought
            </v-btn>
          </v-col>

        </v-row>
      </v-col>
    </v-row>
  </v-card>
</template>

<style scoped lang="scss">
.book_card {
  width: 90%;
  max-height: 14rem;
  display: block;
  margin-left: auto;
  margin-right: auto;
  padding: 20px;
  margin-bottom: 20px;
  background: lightgray;
}

.book_card_img {
  height: 140px;
  width: 100px;
  display: block;
  margin-top: auto;
  margin-bottom: auto

}

.book_card_content {
  width: 50%;
  display: block;
  margin-top: auto;
  margin-bottom: auto
}


</style>