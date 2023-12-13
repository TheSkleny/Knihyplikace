<script setup>
import {ref, computed} from 'vue'
import {supabase} from '@/lib/supabaseClient'
import {useRoute, useRouter} from 'vue-router'
import BookForm from "@/components/BookForm.vue";



const route = useRoute()
const router = useRouter()
const bookData = ref(null)

async function getBook() {
  console.log("route.params.id")
  console.log(route.params.id)
  const {data, error} = await supabase
      .from('Books')
      .select(
          `
          Id,
          Name,
          Author,
          GenreId,
          PublishDate,
          Publisher,
          Language,
          Rating,
          Pages,
          PagesRead,
          Description,
          CoverImageLink`
      )
      .eq('Id', route.params.id)
  if (error) {
    console.log('error', error)
  } else {
    console.log('data')
    console.log(data[0])
    bookData.value = data[0]
    console.log(bookData.value.Name)
  }
}

console.log("bookData")
console.log(bookData)

async function onSave(newData) {
  console.log("newData")
  console.log(newData)
  const {data, error} = await supabase
      .from('Books')
      .update(newData)
      .eq('Id', route.params.id)
  if (error) console.log('error', error)
  else console.log(data)
  // refresh page
  // location.reload()
  await getBook()
}

async function onDelete() {
  console.log("delete")
  await supabase
      .from('Books')
      .delete()
      .eq('Id', route.params.id)
      .then(() => {
        console.log("deleted")
        router.push({name: 'home'})
      })
}
getBook()
</script>

<template>
  <BookForm v-if="bookData" :book-data="bookData" @on-reload="getBook" @on-save="(newData) => onSave(newData)" @on-delete="onDelete"/>
<!--    <div v-if="!bookData">Loading ...</div>-->
<!--    <div v-else>-->
<!--      <v-container>-->
<!--        <v-row>-->
<!--          <v-col cols="4">-->
<!--            <v-img :src="cover" class="book_card_img" cover/>-->
<!--          </v-col>-->
<!--          <v-col>-->
<!--            <h1>{{ bookData.Name }}</h1>-->
<!--            <h2>{{ bookData.Author }}</h2>-->
<!--          </v-col>-->
<!--        </v-row>-->
<!--        <v-row>-->
<!--          <v-col>-->
<!--            <v-dialog width="500">-->
<!--              <template v-slot:activator="{ props }">-->
<!--                <v-btn style="margin-left: 15px"-->
<!--                       color="secondary"-->
<!--                       v-bind="props"-->
<!--                       @click.prevent="onShowDialog"-->
<!--                >-->
<!--                  Read-->
<!--                </v-btn>-->
<!--              </template>-->
<!--              <template #default="{isActive}">-->
<!--                <v-card title="Add read pages">-->
<!--                  <v-card-text>-->
<!--                    <v-text-field-->
<!--                        label="Pages read"-->
<!--                        type="number"-->
<!--                        min="0"-->
<!--                        max="1000"-->
<!--                        v-model="newPagesRead"-->
<!--                    />-->
<!--                  </v-card-text>-->

<!--                  <v-card-actions>-->
<!--                    <v-spacer/>-->

<!--                    <v-btn-->
<!--                        text="Add pages"-->
<!--                        @click="addPages(newPagesRead, isActive)"-->
<!--                    ></v-btn>-->
<!--                    <v-btn-->
<!--                        text="Finished reading"-->
<!--                        color="blue"-->
<!--                        @click="addPages(pages, isActive)"-->
<!--                    ></v-btn>-->
<!--                  </v-card-actions>-->
<!--                </v-card>-->
<!--              </template>-->
<!--            </v-dialog>-->
<!--          </v-col>-->
<!--          <v-col>-->
<!--            <p style="text-align: right">{{ pagesRead }} / {{ pages }} stránek </p>-->
<!--            <v-progress-linear-->
<!--                :model-value="pagesPercent"-->
<!--                :height="10"-->
<!--                color="secondary"-->
<!--                style="border-radius: 5px"-->
<!--            />-->
<!--          </v-col>-->
<!--        </v-row>-->
<!--        <v-row>-->
<!--          <v-col>-->
<!--            <h2>Details</h2>-->
<!--            <h3>Genre: {{ bookData.GenreId?.Name ?? "" }}</h3>-->
<!--            <h3>Publisher: {{ bookData.Publisher }}</h3>-->
<!--            <h3>Published: {{ bookData.PublishDate }}</h3>-->
<!--            <h3>Language: {{ bookData.Language }}</h3>-->
<!--          </v-col>-->
<!--        </v-row>-->
<!--        <v-row>-->
<!--          <v-col>-->
<!--            <h2>Rating</h2>-->
<!--          </v-col>-->
<!--        </v-row>-->
<!--        <v-row>-->
<!--          <v-rating style="display: block; margin-left: auto; margin-right: auto"-->
<!--                    readonly-->
<!--                    :length="5"-->
<!--                    :size="40"-->
<!--                    :model-value="bookData.Rating"-->
<!--                    active-color="primary"-->
<!--          />-->
<!--        </v-row>-->
<!--        <v-row>-->
<!--          <v-col>-->
<!--            <h2>Description</h2>-->
<!--          </v-col>-->
<!--        </v-row>-->
<!--        <v-row>-->
<!--          <v-card class="book_card">-->
<!--            <v-card-text>-->
<!--              {{ bookData.Description }}-->
<!--            </v-card-text>-->
<!--          </v-card>-->
<!--        </v-row>-->

<!--      </v-container>-->
<!--      <v-btn icon="mdi-plus"-->
<!--             class="btn-bottom-right"-->
<!--             color="primary"-->
<!--             elevation="24"-->
<!--             size="50"-->
<!--             @click="$router.push({ name: 'book-edit', params: { id: route.params.id } })"-->
<!--      />-->
<!--      <div style="display: block; height: 100px;"/>-->

<!--    </div>-->

</template>

<style scoped>

.btn-bottom-right {
  position: fixed;
  bottom: 70px;
  right: 20px;
}

.book_card {
  width: 90%;
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
