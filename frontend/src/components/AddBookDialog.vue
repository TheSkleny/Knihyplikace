<style scoped lang="scss">
 @import "@/assets/main.scss";
</style>
<script setup>
import { defineProps, ref } from 'vue'
import {supabase} from "@/lib/supabaseClient";
import BookForm from "@/components/BookForm.vue";


const props = defineProps({
  isOwned: {
    type: Boolean,
    required: false,
    default: false
  },
  isWish: {
    type: Boolean,
    required: false,
    default: false
  },
  GiftPerson: {
    type: String,
    required: false,
    default: null
  },
})


// TODO: get books from database
const existingBooks = [
  {
    title: 'The Hobbit',
    value: 'Id1'
  },
  {
    title: 'The Lord of the Rings',
    value: 'Id2'
  },
  {
    title: 'The Silmarillion',
    value: 'Id3'
  }
]

const showBookForm = ref(false)

function opedDialog() {
  showBookForm.value = false
}

function changeDialog() {
  showBookForm.value = true
}

function cancelDialog(isActive) {
  showBookForm.value = false
  isActive.value = false
}

// TODO: remove this
const WishListId = 'ed585e2b-d278-491f-ab15-c34d67f12fd4'

async function addBook(isActive, bookId) {
  // TODO: add book to parent chosen list

  // if homeview
  // update book where bookId isOwned == true
  // else if wishlist
  // insert into wishlist
  // else if gift
  // insert into GiftList according to Person

  if (props.isOwned) {
    await supabase
        .from('Book')
        .update({IsOwned: true})
        .eq('Id', bookId)
  }
  else if (props.isWish) {
    await supabase
        .from('BookInBookList')
        .insert({BookId: bookId})
        .eq('ListId', WishListId)

  }
  else if (props.GiftPerson) {
    await supabase
        .from('GiftList')
        .insert({BookId: bookId, Person: props.GiftPerson})
  }

  isActive.value = false
}

async function createBook(isActive, formData) {
  // TODO: create book and add to parent chosen list

  const {data, error} = await supabase
      .from('Book')
      .insert({...formData, IsOwned: false})
      .select()
  if (error) console.log('error', error)
  else {
    const bookId = data[0].Id
    await addBook(isActive, bookId)
  }
}

const selectExistingBook = ref(null)

</script>

<template>
  <v-dialog style="max-height: 85%">
    <template v-slot:activator="{ props }">
      <v-btn
          class="btn-bottom-right"
          icon="mdi-plus"
          color="primary"
          elevation="24"
          size="50"
          v-bind="props"
          @click.prevent="opedDialog"
      />
    </template>
    <template #default="{ isActive }">
      <v-card :title="showBookForm ? 'Create new book' : 'Add book'">
        <v-card-text>
          <v-form v-if="!showBookForm">
            <v-select
                label="Existing books"
                :items="existingBooks"
                v-model="selectExistingBook"
            />
          </v-form>
          <BookForm
              v-if="showBookForm"
              :is-create="true"
              @on-cancel="cancelDialog(isActive)"
              @on-save="createBook(isActive)"
          />
        </v-card-text>
        <v-card-actions v-if="!showBookForm">
          <v-btn
              text="Create new book"
              @click="changeDialog"
          />
          <v-spacer/>
          <v-btn
              text="Add book"
              color="blue"
              @click="addBook(isActive, selectExistingBook)"
          />

        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>