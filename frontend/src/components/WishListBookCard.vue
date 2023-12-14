<style scoped lang="scss">
 @import "@/assets/main.scss";
</style>
<script setup>
import { defineProps, computed, defineEmits } from 'vue'
import { supabase } from '@/lib/supabaseClient'

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

const emit = defineEmits(['onDelete'])

const DEFAULT_COVER = 'https://cdn.vuetifyjs.com/images/parallax/material.jpg'
const cover = computed(() => props.book.CoverImageLink ?? DEFAULT_COVER)

async function removeBook() {
  const wishList = await supabase
    .from('BookList')
    .select('Id')
    .eq('Name', 'V seznamu přání')
    .single()

  if (wishList.error) {
    console.log('error', wishList.error)
    return
  }

  const wishListId =  wishList.data.Id

  await supabase
    .from('BookInBookList')
    .delete()
    .eq('BookId', props.book.Id)
    .eq('ListId', wishListId)
  emit('onDelete')
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
                class="margin-top-5"
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