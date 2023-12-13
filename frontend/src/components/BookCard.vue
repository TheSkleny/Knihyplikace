<script setup>
import { computed, defineProps, defineEmits } from 'vue'
import AddPagesDialog from "@/components/AddPagesDialog.vue";
import "@/assets/styles/BookCard.scss";

const DEFAULT_COVER = 'https://cdn.vuetifyjs.com/images/parallax/material.jpg'
const cover = computed(() => props.book.CoverImageLink ?? DEFAULT_COVER)

/**
 * @type {Prettify<Readonly<ExtractPropTypes<{book: {default: (function(): Book), type: ObjectConstructor, required: boolean}}>>>}
 */
const props = defineProps({
  book: {
    type: Object,
    required: true
  }
})
const emit = defineEmits(['onReload'])

const pagesRead = computed(() => props.book.PagesRead ?? 0)
const pages = computed(() => props.book.Pages ?? 0)
const pagesPercent = computed(() => (pagesRead.value / pages.value * 100) ?? 0)

function getBook() {
  emit('onReload')
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
            <AddPagesDialog :book="props.book" @on-reload="getBook"/>
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

