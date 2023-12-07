<script setup>

import {computed, defineProps, ref, defineEmits} from 'vue'
import {supabase} from '@/lib/supabaseClient'

const props = defineProps({
  book: {
    type: Object,
    required: true
  }
})

const pagesRead = computed(() => props.book.PagesRead ?? 0)


const newPagesRead = ref(0)

const emit = defineEmits(['onReload'])

const pages = computed(() => props.book.Pages ?? 0)
const pagesPercent = computed(() => (pagesRead.value / pages.value * 100) ?? 0)

const DEFAULT_COVER = 'https://cdn.vuetifyjs.com/images/parallax/material.jpg'

const cover = computed(() => props.book.CoverImageLink ?? DEFAULT_COVER)


async function addPages(num, isActive) {
  const {data, error} = await supabase
      .from('Books')
      .update({PagesRead: num})
      .eq('Id', props.book.Id)
  if (error) console.log('error', error)
  else console.log(data)
  // refresh page
  // location.reload()
  emit('onReload')
  isActive.value = false
}

function onShowDialog() {
  newPagesRead.value = props.book.PagesRead ?? 0
}

</script>

<template>



  <v-card class="book_card" :to="`/book-detail/${props.book.Id}`">
    <v-row>
      <v-col style="max-width: 150px">
        <v-img class="book_card_img"
               :src="cover"
               cover
        />
      </v-col>
      <v-col class="book_card_content">
        <v-row>
          <h1 style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap">
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
          <v-col
              class="book_card_content"
          >
            <p style="text-align: right">{{ pagesRead }}/{{ pages }}</p>
            <v-progress-linear
                :model-value="pagesPercent"
                :height="10"
                color="secondary"
                style="border-radius: 5px"
            />
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-card>
</template>

<style scoped lang="scss">
.book_card {
  width: 90%;
  max-height: 14rem;
  display: block;
  margin-left: auto;
  margin-right: auto;
  padding: 20px;
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

.book_card_content {
  width: 50%;
  display: block;
  margin-top: auto;
  margin-bottom: auto
}


</style>