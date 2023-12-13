<script setup>
import {ref, onMounted, defineProps, defineEmits, computed} from 'vue'
import {supabase} from '@/lib/supabaseClient'
import {isNumberOrNull, isRequired} from '@/utils/inputRules'
import {useRouter} from 'vue-router'
import AddPagesDialog from "@/components/AddPagesDialog.vue";

import cloneDeep from 'lodash/cloneDeep'

const props = defineProps({
  bookData: {
    type: Object,
    required: true
  },
  isCreate: {
    type: Boolean,
    default: false
  }
})
console.log('DATA')
console.log(props.bookData)
const emit = defineEmits(['onSave', 'onDelete', 'onReload'])

const newBookData = ref(null)
newBookData.value = cloneDeep(props.bookData)
console.log('newBookData')
console.log(newBookData.value.Name)

const formType = {
  EDIT: 1,
  ADD: 2,
  READ: 3
}


const router = useRouter()
const formData = ref({
  Name: null,
  Author: null,
  GenreId: null,
  PublishDate: null,
  Publisher: null,
  Language: null,
  Pages: null,
  PagesRead: null,
  Description: null,
  CoverImageLink: null
})

const genre_list = ref([])

/**
 * @function getGenre
 * @async
 *
 * Gets a list of genres from a database.
 *
 * @returns {Promise<void>}
 */
async function getGenre() {
  const {data, error} = await supabase.from('BookGenre').select('Name, Id')
  if (error) {
    console.log('error', error)
  } else {
    genre_list.value = data.map((genre) => {
      return {
        title: genre.Name,
        value: genre.Id
      }
    })
    console.log('genre_list', genre_list)
  }
}

/**
 * @function AddBook
 * @async
 *
 * Adds a book to a database and performs navigation.
 *
 * @throws {Error} If there is an error during the Supabase operation.
 *
 * @returns {Promise<void>} A Promise that resolves after successful addition and navigation.
 */
async function AddBook() {
  console.log('formData.newBookData')
  console.log({newBookData})
  const {data, error} = await supabase
      .from('Book')
      .insert([{...formData.value}])
      .select()
  if (error) {
    console.log('error', error)
  } else {
    console.log('data', data)
    Object.keys(formData.value).forEach((key) => {
      formData.value[key] = null
    })
    const bookId = data[0].Id
    await router.push({name: 'book-detail', params: {id: bookId}})
    return bookId
  }
}

const pagesRead = computed(() => props.bookData.PagesRead ?? 0)



const pages = computed(() => props.bookData.Pages ?? 0)
const pagesPercent = computed(() => (pagesRead.value / pages.value * 100) ?? 0)


const DEFAULT_COVER = 'https://cdn.vuetifyjs.com/images/parallax/material.jpg'

const cover = computed(() => props.bookData.CoverImageLink ?? DEFAULT_COVER)

function save() {
  if (props.isCreate) {
    const bookId = AddBook()
    router.push({name: 'book-detail', params: {id: bookId}})
  }
  else {
    emit('onSave', newBookData.value)
    selectedFormType.value = formType.READ
  }
}

onMounted(async () => {
  await getGenre()
})

function edit() {
  selectedFormType.value = formType.EDIT
  isReadonly.value = false
}

function cancel() {
  if (props.isCreate) {
    router.push({name: 'home'})
  }
  else {
    newBookData.value = cloneDeep(props.bookData)
    selectedFormType.value = formType.READ
    isReadonly.value = true

  }
}

function deleteBook() {
  emit('onDelete')
}

function getBook() {
  emit('onReload')
}

const selectedFormType = ref(props.isCreate ? formType.ADD : formType.READ)
console.log('selectedFormType')
console.log(selectedFormType.value)
const isReadonly = ref(selectedFormType.value === formType.READ)
</script>

<template>
  <v-container>
    <v-form>
      <v-row>
        <v-col cols="4">
          <v-img :src="cover" class="book_card_img"
                 cover/>
        </v-col>
        <v-col>
          <div v-if="selectedFormType === formType.ADD || selectedFormType === formType.EDIT">
            <v-text-field variant="underlined" label="Name" v-model="newBookData.Name"/>
            <v-text-field variant="underlined" label="Author" v-model="newBookData.Author"/>
          </div>
          <div v-if="selectedFormType === formType.READ">
            <h1>{{ newBookData.Name }}</h1>
            <h2>{{ newBookData.Author }}</h2>
          </div>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <h2>Pages:</h2>
        </v-col>
      </v-row>
      <!-- switch between edit max pages and display progress and add read pages button -->
      <div v-if="selectedFormType === formType.ADD || selectedFormType === formType.EDIT">
        <v-row>
          <v-col cols="4">
            <h3>Max pages:</h3>
          </v-col>
          <v-spacer/>
          <v-col cols="7">
            <v-text-field
                class="details_text_field"
                variant="underlined"
                v-model="newBookData.Pages"
            />
          </v-col>
          <v-spacer/>
        </v-row>
      </div>
      <div v-if="selectedFormType === formType.READ">
        <v-row>
          <v-col>
            <AddPagesDialog
                :book="bookData"
                @on-reload="getBook"
            />
          </v-col>
          <v-col>
            <p style="text-align: right">{{ pagesRead }} / {{ pages }} stránek </p>
            <v-progress-linear
                :model-value="pagesPercent"
                :height="10"
                color="secondary"
                style="border-radius: 5px"
            />
          </v-col>
        </v-row>

      </div>
      <!--  -->
      <v-row>
        <v-col>
          <h2>Details:</h2>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="4">
          <h3>Genre:</h3>
        </v-col>
        <v-spacer/>
        <v-col cols="7">
          <v-select
              class="details_text_field"
              variant="underlined"
              :items="genre_list"
              :readonly="isReadonly"
              v-model="newBookData.GenreId"
          />
        </v-col>
        <v-spacer/>
      </v-row>
      <v-row>
        <v-col cols="4">
          <h3>Publisher:</h3>
        </v-col>
        <v-spacer/>
        <v-col cols="7">
          <v-text-field
              class="details_text_field"
              variant="underlined"
              :readonly="isReadonly"
              v-model="newBookData.Publisher"
          />
        </v-col>
        <v-spacer/>
      </v-row>
      <v-row>
        <v-col cols="4">
          <h3>Published:</h3>
        </v-col>
        <v-spacer/>
        <v-col cols="7">
          <v-text-field
              class="details_text_field"
              variant="underlined"
              :readonly="isReadonly"
              v-model="newBookData.PublishDate"
          />
        </v-col>
        <v-spacer/>
      </v-row>
      <v-row>
        <v-col cols="4">
          <h3>Language:</h3>
        </v-col>
        <v-spacer/>
        <v-col cols="7">
          <v-text-field
              class="details_text_field"
              variant="underlined"
              :readonly="isReadonly"
              v-model="newBookData.Language"
          />
        </v-col>
        <v-spacer/>
      </v-row>
      <v-row>
        <v-col>
          <h2>Rating:</h2>
        </v-col>
      </v-row>
      <v-row>
        <v-rating style="display: block; margin-left: auto; margin-right: auto"
                  :length="5"
                  :size="40"
                  active-color="primary"
                  :readonly="isReadonly"
                  v-model="newBookData.Rating"
        />
      </v-row>
      <v-row>
        <v-col>
          <h2>Description:</h2>
        </v-col>
      </v-row>
      <v-row>
        <v-textarea
            class="details_textarea"
            auto-grow
            rounded="lg"
            :readonly="isReadonly"
            v-model="newBookData.Description"
        />
      </v-row>
    </v-form>
  </v-container>
  <div class="btn-bottom-right">
    <v-btn
        v-if="selectedFormType === formType.EDIT"
        @click="deleteBook"
        icon="mdi-trash-can-outline"
        color="red"
        elevation="24"
        size="50"
    />
    <v-btn
        v-if="selectedFormType === formType.ADD || selectedFormType === formType.EDIT"
        @click="cancel"
        icon="mdi-close"
        elevation="24"
        size="50"
    />
    <v-btn
        v-if="selectedFormType === formType.ADD || selectedFormType === formType.EDIT"
        @click="save"
        icon="mdi-check"
        color="teal"
        elevation="24"
        size="50"
    />
    <v-btn
        v-if="selectedFormType === formType.READ"
        @click="edit"
        icon="mdi-pencil"
        color="primary"
        elevation="24"
        size="50"
    />
  </div>
  <div style="display: block; height: 80px;"/>

</template>


<style scoped>

.btn_menu {
  display: block;
  margin-left: auto;
  margin-right: auto;
}

.details_textarea {
  width: 90%;
  display: block;
  margin-left: auto;
  margin-right: auto;
  padding: 10px;

}

.details_text_field {
  margin-top: -20px
}

h3 {
  text-align: right;
}

.book_card_img {
  height: 140px;
  width: 100px;
  display: block;
  margin-top: auto;
  margin-bottom: auto

}

.btn-bottom-right {
  position: fixed;
  bottom: 70px;
  right: 20px;

  button {
    margin-left: 10px;
  }
}
</style>
