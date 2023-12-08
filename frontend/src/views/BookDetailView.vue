<script setup>
import {ref, defineEmits, computed} from 'vue'
import {supabase} from '@/lib/supabaseClient'
import {useRoute} from 'vue-router'

const emit = defineEmits(['onReload'])


const route = useRoute()
const bookData = ref(null)

async function getBook() {
  const {data, error} = await supabase
      .from('Books')
      .select(
          'Name, Author, GenreId (Name), PublishDate, Publisher, Language, Pages, PagesRead, Description, CoverImageLink'
      )
      .eq('Id', route.params.id)
  if (error) {
    console.log('error', error)
  }
  else {
    console.log('data')
    console.log(data[0])
    bookData.value = data[0]
    console.log(bookData.value.Name)
  }
}

const pagesRead = computed(() => bookData.value.PagesRead ?? 0)


const newPagesRead = ref(0)

const pages = computed(() => bookData.value.Pages ?? 0)
const pagesPercent = computed(() => (pagesRead.value / pages.value * 100) ?? 0)


async function addPages(num, isActive) {
  const {data, error} = await supabase
      .from('Books')
      .update({PagesRead: num})
      .eq('Id', route.params.id)
  if (error) console.log('error', error)
  else console.log(data)
  // refresh page
  // location.reload()
  emit('onReload')
  isActive.value = false
}
console.log("bookData")
console.log(bookData)

function onShowDialog() {
  newPagesRead.value = bookData.value.PagesRead ?? 0
}

//const percent = bookData.PagesRead / bookData.Pages * 100 ?? 0

getBook()
</script>

<template>
  <main>
    <div v-if="!bookData">Loading ...</div>
    <div v-else>
      <v-container>
        <v-row>
          <v-col cols="4">
            <v-img :src="bookData.CoverImageLink" class="book_card_img"/>
          </v-col>
          <v-col>
            <h1>{{ bookData.Name }}</h1>
            <h2>{{ bookData.Author }}</h2>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-dialog width="500">
              <template v-slot:activator="{ props }" >
                <v-btn style="margin-left: -15px"
                       color="secondary"
                       v-bind="props"
                       @click.prevent="onShowDialog"
                >
                  Read
                </v-btn>
              </template>
              <template #default="{isActive}">
                <v-card title="Add read pages">
                  <v-card-text>
                    <v-text-field
                        label="Pages read"
                        type="number"
                        min="0"
                        max="1000"
                        v-model="newPagesRead"
                    />
                  </v-card-text>

                  <v-card-actions>
                    <v-spacer/>

                    <v-btn
                        text="Add pages"
                        @click="addPages(newPagesRead, isActive)"
                    ></v-btn>
                    <v-btn
                        text="Finished reading"
                        color="blue"
                        @click="addPages(pages, isActive)"
                    ></v-btn>
                  </v-card-actions>
                </v-card>
              </template>
            </v-dialog>
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
        <v-row>
          <v-col>
            <h2>Details</h2>
            <h3>Genre: {{ bookData.GenreId.Name }}</h3>
            <h3>Publisher: {{ bookData.Publisher }}</h3>
            <h3>Published: {{ bookData.PublishDate }}</h3>
            <h3>Language: {{ bookData.Language }}</h3>
          </v-col>
        </v-row>
        <v-row>
          <h2>Rating</h2>
        </v-row>
        <v-row>
          <v-rating
              hover
              :length="5"
              :size="32"
              :model-value="3"
              active-color="primary"
          />
        </v-row>
        <v-row>
          <h2>Description</h2>
        </v-row>
        <v-row>
          <v-card class="book_card">
            <v-card-text>
              {{ bookData.Description }}
            </v-card-text>
          </v-card>
        </v-row>
      </v-container>
    </div>
  </main>
</template>

<style scoped>

.book_card {
  width: 90%;
  max-height: 14rem;
  display: block;
  margin-left: auto;
  margin-right: auto;
  padding: 10px;
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
</style>
