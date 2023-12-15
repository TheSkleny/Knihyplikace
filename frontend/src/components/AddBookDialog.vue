<style scoped lang="scss">
@import "@/assets/main.scss";
</style>
<script setup>
import {defineProps, ref, defineEmits} from 'vue'
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
  isGift: {
    type: Boolean,
    required: false,
    default: false
  },
  giftPersons: {
    type: Array,
    required: false,
    default: () => []
  }
})

const emit = defineEmits(['onReload'])

const existingBooks = ref([]);

async function fetchExistingBooks() {
  const tableName = props.isOwned || props.isWish ? 'vUnassignedBooks' : 'Book';
  const { data, error } = await supabase
      .from(tableName)
      .select('Name, Id');
  if (error) {
    console.error('error', error);
    return;
  }

  existingBooks.value = data.map((book) => ({
    title: book.Name,
    value: book.Id,
  }));
}


fetchExistingBooks()

const showBookForm = ref(false)
const giftPerson = ref(null)
const selectExistingBook = ref(null)

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

async function addBookToOwned(bookId) {
  await supabase
      .from('Book')
      .update({IsOwned: true})
      .eq('Id', bookId)
}

async function addBookToWishList(bookId) {
  const {data: bookListData, error: bookListError} = await supabase
      .from('BookList')
      .select('Id')
      .eq('Name', 'V seznamu přání')

  if (bookListError) {
    console.log('error', bookListError)
  } else {
    const wishListId = bookListData[0].Id
    await supabase
        .from('BookInBookList')
        .insert({BookId: bookId, ListId: wishListId})
  }
}

async function addBookToGiftList(bookId) {
  await supabase
      .from('GiftList')
      .insert({BookId: bookId, Person: giftPerson.value})
}

async function addBook(isActive, bookId) {
  if (props.isOwned) {
    await addBookToOwned(bookId)
  } else if (props.isWish) {
    await addBookToWishList(bookId)
  } else if (props.isGift) {
    await addBookToGiftList(bookId)
  }
  emit('onReload')
  isActive.value = false
}

async function createBook(isActive, formData) {
  formData.IsOwned = !!props.isOwned;
  if (formData.Pages === null) {
    formData.Pages = 0
  }
  const {data, error} = await supabase
      .from('Book')
      .insert({...formData, PagesRead: 0})
      .select()
  if (error) {
    console.log('error', error)
  } else {
    const bookId = data[0].Id
    if (props.isWish) {
      await addBookToWishList(bookId)
    } else if (props.isGift) {
      await addBookToGiftList(bookId)
    }
    emit('onReload')
    isActive.value = false
  }
}


</script>

<template>
  <v-dialog class="max-height-85">
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
          <v-combobox
              v-if="props.isGift"
              label="Person"
              :items="props.giftPersons"
              v-model="giftPerson"
          />
          <v-select
              v-if="!showBookForm"
              label="Existing books"
              :items="existingBooks"
              v-model="selectExistingBook"
          />
          <BookForm
              v-if="showBookForm"
              :is-create="true"
              @on-cancel="cancelDialog(isActive)"
              @on-save="createBook(isActive, $event)"
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
              color="primary"
              @click="addBook(isActive, selectExistingBook)"
          />

        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>