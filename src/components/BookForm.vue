<style scoped lang="scss">
@import "@/assets/main.scss";
</style>
<script setup>
import {ref, onMounted, defineProps, defineEmits, computed} from 'vue'
import {supabase} from '@/lib/supabaseClient'
import AddPagesDialog from "@/components/AddPagesDialog.vue";
import AddBookCoverDialog from "@/components/AddBookCoverDialog.vue";
import DeleteConfirmDialog from "@/components/DeleteConfirmDialog.vue";
import cloneDeep from 'lodash/cloneDeep'
import VueEasyLightbox from "vue-easy-lightbox";
import 'vue-easy-lightbox-css'
import {isRequired, isNumberOrNull} from "@/utils/inputRules";

const DEFAULT_COVER = 'https://cdn.vuetifyjs.com/images/parallax/material.jpg'

const formDataBase = {
  Name: null,
  Author: null,
  GenreId: null,
  PublishDate: null,
  Publisher: null,
  Language: null,
  Pages: null,
  PagesRead: null,
  Description: null,
  CoverImageLink: null,
  Rating: null,
  IsOwned: null
}

/**
 * @type {Prettify<Readonly<ExtractPropTypes<{isCreate: {default: boolean, type: BooleanConstructor, required: boolean},
 *        bookData: {default: (function(): Book), type: ObjectConstructor, required: boolean}}>>>}
 */
const props = defineProps({
  bookData: {
    type: Object,
    required: false,
    default: () => {
      return {}
    }
  },
  isCreate: {
    type: Boolean,
    required: false,
    default: false
  }
})
const emit = defineEmits(['onSave', 'onDelete', 'onReload', 'onCancel'])

const newBookData = ref(cloneDeep({...formDataBase, ...props.bookData}))

const formType = {
  EDIT: 1,
  ADD: 2,
  READ: 3
}

const genre_list = ref([])

async function getGenre() {
  const {data, error} = await supabase.from('BookGenre').select('Name, Id')
  if (error) console.log('error', error)
  else {
    genre_list.value = data.map((genre) => {
      return {
        title: genre.Name,
        value: genre.Id
      }
    })
  }
}

const pagesRead = computed(() => props.bookData.PagesRead ?? 0)
const pages = computed(() => props.bookData.Pages ?? 0)
const pagesPercent = computed(() => (pagesRead.value / pages.value * 100) ?? 0)
const cover = ref(props.bookData.CoverImageLink ?? DEFAULT_COVER)

const addBookForm = ref(null)

const requiredRule = (value) => isRequired(value);

const numberRule = (value) => isNumberOrNull(value);


async function save() {
  const {valid} = await addBookForm.value.validate()
  if (!valid) {
    return
  }
  console.log('newBookData.value', newBookData.value)
  emit('onSave', newBookData.value)
  if (newBookData.value.CoverImageLink) {
    cover.value = newBookData.value.CoverImageLink
  } else {
    cover.value = DEFAULT_COVER
  }
  selectedFormType.value = formType.READ
  isReadonly.value = true
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
    emit('onCancel')
  } else {
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
const isReadonly = ref(selectedFormType.value === formType.READ)

const lightboxImage = [
  cover.value
]
const isLightboxActive = ref(false)
const lightboxIndex = ref(0)
const lightboxToggle = () => {
  isLightboxActive.value = !isLightboxActive.value
}

function onAddCover(coverImageLink) {
  console.log(coverImageLink)
  newBookData.value.CoverImageLink = coverImageLink
}

</script>

<template>
  <vue-easy-lightbox
      :visible="isLightboxActive"
      :imgs="lightboxImage"
      :index="lightboxIndex"
      @hide="lightboxToggle"
      :scroll-disabled="true"
  />
  <v-container>
    <v-form ref="addBookForm">
      <v-row>
        <v-col cols="5">
          <AddBookCoverDialog
              :coverImage="cover"
              @on-add-cover="onAddCover"
          >
            <template v-slot:trigger="{ openDialog }">
              <v-img
                  :src="cover"
                  class="book_card_img"
                  cover
                  @click="selectedFormType === formType.READ ? lightboxToggle() : openDialog()"/>
            </template>
          </AddBookCoverDialog>
        </v-col>
        <v-col>
          <div v-if="selectedFormType === formType.ADD || selectedFormType === formType.EDIT">
            <v-text-field
                :rules="[requiredRule]"
                variant="underlined"
                label="Název"
                v-model="newBookData.Name"
            />
            <v-text-field
                :rules="[requiredRule]"
                variant="underlined"
                label="Autor"
                v-model="newBookData.Author"
            />
          </div>
          <div v-if="selectedFormType === formType.READ">
            <h1>{{ newBookData.Name }}</h1>
            <h2>{{ newBookData.Author }}</h2>
          </div>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <h2>Stránky:</h2>
        </v-col>
      </v-row>
      <!-- switch between edit max pages and display progress and add read pages button -->
      <div v-if="selectedFormType === formType.ADD || selectedFormType === formType.EDIT || !newBookData.IsOwned">
        <v-row>
          <v-col cols="5">
            <h3>Max stránek:</h3>
          </v-col>
          <v-spacer/>
          <v-col cols="7">
            <v-text-field
                type="number"
                :rules="[numberRule]"
                :readonly="isReadonly"
                class="details_text_field"
                variant="underlined"
                v-model="newBookData.Pages"
            />
          </v-col>
          <v-spacer/>
        </v-row>
      </div>
      <div v-if="selectedFormType === formType.READ && newBookData.IsOwned">
        <v-row>
          <v-col>
            <AddPagesDialog
                :book="bookData"
                @on-reload="getBook"
            />
          </v-col>
          <v-col>
            <p class="text-align-right">{{ pagesRead }} / {{ pages }} stránek </p>
            <v-progress-linear
                :model-value="pagesPercent"
                :height="10"
                color="primary"
                class="border-radius-5"
            />
          </v-col>
        </v-row>

      </div>
      <v-row>
        <v-col>
          <h2>Detail:</h2>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="5">
          <h3>Žánr:</h3>
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
        <v-col cols="5">
          <h3>Vydavatel:</h3>
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
        <v-col cols="5">
          <h3>Rok vydání:</h3>
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
        <v-col cols="5">
          <h3>Jazyk:</h3>
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
          <h2>Hodnocení:</h2>
        </v-col>
      </v-row>
      <v-row>
        <v-rating
            class="v-rating-form"
            :length="5"
            :size="40"
            active-color="primary_light"
            :readonly="isReadonly"
            v-model="newBookData.Rating"
        />
      </v-row>
      <v-row>
        <v-col>
          <h2>Popis:</h2>
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

  <div class="btn-bottom-right-edit">
    <v-row>
      <DeleteConfirmDialog
          v-if="selectedFormType === formType.EDIT && newBookData.IsOwned"
          :title="newBookData.Name"
          delete-from=" Tvých knih"
          @on-delete="deleteBook">
        <template v-slot:trigger="{ openDialog }">
          <v-btn
              @click="openDialog"
              icon="mdi-trash-can-outline"
              color="error"
              elevation="24"
              size="50"
          />
        </template>
      </DeleteConfirmDialog>

      <v-btn
          v-if="selectedFormType === formType.EDIT"
          @click="cancel"
          color="white"
          icon="mdi-close"
          elevation="24"
          size="50"
      />
      <v-btn class="btn-bottom-right-dialog--close"
             v-if="selectedFormType === formType.ADD"
             @click="cancel"
             color="white"
             icon="mdi-close"
             elevation="24"
             size="50"
      />
      <v-btn
          v-if="selectedFormType === formType.EDIT"
          @click="save"
          icon="mdi-check"
          color="primary"
          elevation="24"
          size="50"
      />
      <v-btn class="btn-bottom-right-dialog"
             v-if="selectedFormType === formType.ADD"
             @click="save"
             icon="mdi-check"
             color="primary"
             elevation="24"
             size="50"
      />
      <v-btn class="btn-read"
             v-if="selectedFormType === formType.READ"
             @click="edit"
             icon="mdi-pencil"
             color="primary"
             elevation="24"
             size="50"
      />
    </v-row>
  </div>

  <div
      class="bottom-div"
  />

</template>