<script setup>
import { ref, onMounted, defineProps, defineEmits, computed } from 'vue'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'vue-router'
import AddPagesDialog from "@/components/AddPagesDialog.vue";
import cloneDeep from 'lodash/cloneDeep'

const DEFAULT_COVER = 'https://cdn.vuetifyjs.com/images/parallax/material.jpg'
const cover = computed(() => props.bookData.CoverImageLink ?? DEFAULT_COVER)

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
  CoverImageLink: null
}

/**
 * @type {Prettify<Readonly<ExtractPropTypes<{isCreate: {default: boolean, type: BooleanConstructor, required: boolean},
 *        bookData: {default: (function(): Book), type: ObjectConstructor, required: boolean}}>>>}
 */
const props = defineProps({
  bookData: {
    type: Object,
    required: false,
    default: () => { return {} }
  },
  isCreate: {
    type: Boolean,
    required: false,
    default: false
  }
})
const emit = defineEmits(['onSave', 'onDelete', 'onReload'])

const newBookData = ref(cloneDeep({ ...formDataBase, ...props.bookData }))

const formType = {
  EDIT: 1,
  ADD: 2,
  READ: 3
}
const router = useRouter()
const genre_list = ref([])

async function getGenre() {
  const { data, error } = await supabase.from('BookGenre').select('Name, Id')
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

function save() {
  emit('onSave', newBookData.value)
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
    router.push({ name: 'home' })
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
const isReadonly = ref(selectedFormType.value === formType.READ)
</script>

<template>
  <v-container>
    <v-form>
      <v-row>
        <v-col cols="4">
          <v-img :src="cover" class="book_card_img" cover/>
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
