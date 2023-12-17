<style scoped lang="scss">
@import "@/assets/main.scss";
</style>
<script setup>
import { defineProps, ref, defineEmits } from 'vue'
import { supabase } from "@/lib/supabaseClient";
import BookForm from "@/components/BookForm.vue";
import { isRequired } from "@/utils/inputRules";

const props = defineProps({
  // Whether the book is owned
  isOwned: {
    type: Boolean,
    required: false,
    default: false
  },
  // Whether the book is in the wish list
  isWish: {
    type: Boolean,
    required: false,
    default: false
  },
  // Whether the book is in the gift list
  isGift: {
    type: Boolean,
    required: false,
    default: false
  },
  // The persons in the gift list
  giftPersons: {
    type: Array,
    required: false,
    default: () => []
  },
  // Whether the book is in the bookshelf
  isBookshelf: {
    type: Boolean,
    required: false,
    default: false
  },
  // The selected custom book list
  selectedList: {
    type: String,
    required: false
  }
})

const emit = defineEmits(['onReload'])

/**
 * @type {Ref<UnwrapRef<Book[]>>}
 */
const existingBooks = ref([]);

/**
 * Required rule
 * @param {string} value - The value
 * @returns {boolean} - True if the value is required
 */
 const requiredRule = (value) => isRequired(value);

/**
 * Fetches books for various screens (owned, wish, gift, bookshelf)
 */
async function fetchExistingBooks() {
  let tableName = 'Book';
  if (props.isOwned || props.isWish) {
    // Get books that are not owned and not assigned to any custom book list
    tableName = 'vUnassignedBooks';
  }
  else if (props.isBookshelf) {
    // Get the custom book list id
    const bookList = await supabase
        .from('BookList')
        .select('Name')
        .eq('Name', props.selectedList);
    // Get books that are owned and not in the selected custom book list
    let { data, error } = await supabase
        .rpc('its_over', {
          list_name: bookList.data[0].Name
        })
    if (error) {
      console.error('error', error);
      return;
    }
    // Map the books to fit the v-select component
    existingBooks.value = data.map((book) => ({
      title: book.Name,
      value: book.Id,
    }));
    return;
  }
  // Get all books
  const { data, error } = await supabase
    .from(tableName)
    .select('Name, Id');
  if (error) {
    console.error('error', error);
    return;
  }
  // Map the books to fit the v-select component
  existingBooks.value = data.map((book) => ({
    title: book.Name,
    value: book.Id,
  }));
}
fetchExistingBooks()

const showBookForm = ref(false)
const giftPerson = ref(null)
const selectExistingBook = ref(null)
const addBookForm = ref(null)

/**
 * Opens the dialog
 */
function opedDialog() {
  showBookForm.value = false
}

/**
 * Changes the dialog to create book
 */
function changeDialog() {
  showBookForm.value = true
}

/**
 * Cancels the dialog
 * @param {Ref<boolean>} isActive - Whether the dialog is active
 */
function cancelDialog(isActive) {
  showBookForm.value = false
  isActive.value = false
}

/**
 * Adds the book to the library
 * @param {number} bookId - The book id
 */
async function addBookToOwned(bookId) {
  await supabase
      .from('Book')
      .update({IsOwned: true})
      .eq('Id', bookId)
}

/**
 * Adds the book to the wish list
 * @param {number} bookId - The book id
 */
async function addBookToWishList(bookId) {
  const { data, error } = await supabase
      .from('BookList')
      .select('Id')
      .eq('Name', 'V seznamu přání')

  if (error) {
    console.log('error', error)
  } 
  else {
    const wishListId = data[0].Id
    await supabase
        .from('BookInBookList')
        .insert({BookId: bookId, ListId: wishListId})
  }
}

/**
 * Adds the book to the gift list
 * @param {number} bookId - The book id
 */
async function addBookToGiftList(bookId) {
  await supabase
      .from('GiftList')
      .insert({BookId: bookId, Person: giftPerson.value})
  // Achievement: Uhh.. thanks?
  await supabase
      .rpc('increment_achievement', {
        name_param: 'Uhh.. thanks?'
      })
}

/**
 * Adds the book to the custom book list
 * @param {number} bookId - The book id
 */
async function addBookToBooklist(bookId) {
  const bookList = await supabase
      .from('BookList')
      .select('Id')
      .eq('Name', props.selectedList)
  await supabase
      .from('BookInBookList')
      .insert({BookId: bookId, ListId: bookList.data[0].Id})
  emit('onReload')
}

/**
 * General function for adding a book
 * @param {Ref<boolean>} isActive - Whether the dialog is active
 * @param {Book} formData - The book data
 */
async function addBook(isActive, bookId) {
  const {valid} = await addBookForm.value.validate()
  if (!valid) {
    return
  }
  if (props.isOwned) {
    await addBookToOwned(bookId)
  } 
  else if (props.isWish) {
    await addBookToWishList(bookId)
  } 
  else if (props.isGift) {
    await addBookToGiftList(bookId)
  } 
  else if (props.isBookshelf) {
    await addBookToBooklist(bookId)
  }
  // Reload the books
  fetchExistingBooks()
  selectExistingBook.value = null
  emit('onReload')
  isActive.value = false
}

/**
 * Creates a new book
 * @param {Ref<boolean>} isActive - Whether the dialog is active
 * @param {Book} formData - The book data
 */
async function createBook(isActive, formData) {
  const {valid} = await addBookForm.value.validate()
  if (!valid) {
    return
  }
  formData.IsOwned = !!props.isOwned;
  if (formData.Pages === null) {
    formData.Pages = 0
  }
  // Add new book to the database
  const {data, error} = await supabase
      .from('Book')
      .insert({...formData, PagesRead: 0})
      .select()
  if (error) {
    console.log('error', error)
  } 
  else {
    const bookId = data[0].Id
    if (props.isWish) {
      await addBookToWishList(bookId)
    } 
    else if (props.isGift) {
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
          :class="isBookshelf ? 'margin-20' : 'btn-bottom-right'"
          icon="mdi-plus"
          :color="isBookshelf ? 'primary_dark' : 'primary'"
          size="50"
          v-bind="props"
          @click.prevent="opedDialog"
      />
    </template>
    <template #default="{ isActive }">
      <v-card :title="showBookForm ? 'Vytvořit novou knihu' : 'Přidat knihu'">
        <v-card-text>
          <v-form ref="addBookForm">
            <v-combobox
                v-if="props.isGift"
                label="Osoba"
                :items="props.giftPersons"
                :rules="[requiredRule]"
                v-model="giftPerson"
            />
            <v-select
                v-if="!showBookForm"
                label="Existující knihy"
                :items="existingBooks"
                :rules="[requiredRule]"
                v-model="selectExistingBook"
            />
            <BookForm
                v-if="showBookForm"
                :is-create="true"
                @on-cancel="cancelDialog(isActive)"
                @on-save="createBook(isActive, $event)"
            />
          </v-form>
        </v-card-text>
        <v-card-actions v-if="!showBookForm">
          <v-btn
                  v-if="!props.isBookshelf"
                  text="Vytvořit novou knihu"
                  @click="changeDialog"
                />
                <v-spacer/>
          <v-btn
              text="Přidat knihu"
              color="primary"
              @click="addBook(isActive, selectExistingBook)"
          />
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>