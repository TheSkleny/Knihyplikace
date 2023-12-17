<style scoped lang="scss">
 @import "@/assets/main.scss";
</style>
<script setup>
import { defineProps, computed, defineEmits } from 'vue'
import { supabase } from '@/lib/supabaseClient'
import DeleteConfirmDialog from "@/components/DeleteConfirmDialog.vue";

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
  },
  person: {
    type: String,
    required: false,
    default: ''
  }
})

const emit = defineEmits(['onReload'])

// Placeholder cover image if the book doesn't have one
const DEFAULT_COVER = 'https://cdn.vuetifyjs.com/images/parallax/material.jpg'
const cover = computed(() => props.book.CoverImageLink ?? DEFAULT_COVER)

/**
 * Remove the book from the wishlist
 */
async function removeFromWishlist() {
  const wishList = await supabase
    .from('BookList')
    .select('Id')
    .eq('Name', 'V seznamu přání')
    .single()

  if (wishList.error) {
    console.log('error', wishList.error)
    return
  }
  await supabase
    .from('BookInBookList')
    .delete()
    .eq('BookId', props.book.Id)
    .eq('ListId', wishList.data.Id)
  emit('onReload')
  // Achievement: Where dreams come true
  await supabase
    .rpc('increment_achievement', {
        name_param: 'Where dreams come true'
  })
}

/**
 * Remove the book from the gifts list
 */
async function removeFromGifts() {
  await supabase
    .from('GiftList')
    .delete()
    .eq('BookId', props.book.Id)
    .eq('Person', props.person)
  emit('onReload')
}

/**
 * Move the book from the wishlist to the library
 */
async function moveToLibrary() {
  await supabase
    .from('Book')
    .update({IsOwned: true})
    .eq('Id', props.book.Id)
  await removeFromWishlist()
}
</script>

<template>
  <v-card :class="props.showButton ? 'book_card--wishlist' : 'book_card'" :to="`/book-detail/${ props.book.Id }`">
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
                v-if="props.showButton"
                class="margin-top-5"
                @click.prevent="moveToLibrary"
            >
              Koupeno
            </v-btn>
          </v-col>
          <v-spacer/>
          <v-col>
            <DeleteConfirmDialog
                :title="props.book.Name"
                :delete-from="props.showButton ? 'e Seznamu přání' : (' Dárků pro ' + props.person)"
                @on-delete="props.showButton ? removeFromWishlist() : removeFromGifts()"
            >
              <template v-slot:trigger="{ openDialog }">
                <v-btn
                    style="margin-top: 10px"
                    icon="mdi-delete"
                    color="error"
                    size="30"
                    variant="text"
                    @click.prevent="openDialog"
                />
              </template>
            </DeleteConfirmDialog>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-card>
</template>