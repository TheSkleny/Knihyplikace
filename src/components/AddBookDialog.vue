<style scoped lang="scss">
@import "@/assets/main.scss";
</style>
<script setup>
import {defineProps, ref, defineEmits} from 'vue'
import {supabase} from "@/lib/supabaseClient";
import BookForm from "@/components/BookForm.vue";
import {isRequired} from "@/utils/inputRules";


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
  },
  isBookshelf: {
    type: Boolean,
    required: false,
    default: false
  },
  selectedList: {
    type: String,
    required: false
  }
})

const emit = defineEmits(['onReload'])

const existingBooks = ref([]);


async function fetchExistingBooks() {
  let tableName = 'Book';
  if (props.isOwned || props.isWish) {
    tableName = 'vUnassignedBooks';
  } 
  else if (props.isBookshelf) {
    const bookList = await supabase
        .from('BookList')
        .select('Name')
        .eq('Name', props.selectedList);
      
    let { data, error } = await supabase
        .rpc('its_over', {
          list_name: bookList.data[0].Name
        })
    if (error) {
      console.error('error', error);
      return;
    }

    existingBooks.value = data.map((book) => ({
      title: book.Name,
      value: book.Id,
    }));
    return;
  }

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
const addBookForm = ref(null)

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
  await supabase
      .rpc('increment_achievement', {
        name_param: 'Uhh.. thanks?'
      })
}

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

async function addBook(isActive, bookId) {
  const {valid} = await addBookForm.value.validate()
  if (!valid) {
    return
  }
  if (props.isOwned) {
    await addBookToOwned(bookId)
  } else if (props.isWish) {
    await addBookToWishList(bookId)
  } else if (props.isGift) {
    await addBookToGiftList(bookId)
  } else if (props.isBookshelf) {
    await addBookToBooklist(bookId)
  }
  fetchExistingBooks()
  selectExistingBook.value = null
  emit('onReload')
  isActive.value = false
}

async function createBook(isActive, formData) {
  const {valid} = await addBookForm.value.validate()
  if (!valid) {
    return
  }
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

const requiredRule = (value) => isRequired(value);


</script>

<template>
  <v-dialog class="max-height-85">
    <template v-slot:activator="{ props }">
      <v-btn
          :class="isBookshelf ? 'margin-20' : 'btn-bottom-right'"
          icon="mdi-plus"
          :color="isBookshelf ? 'primary_dark' : 'primary'"
          elevation="24"
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