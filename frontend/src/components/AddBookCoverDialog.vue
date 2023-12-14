<script setup>
import {ref, defineEmits} from 'vue'
import { isRequired } from "@/utils/inputRules";

const emit = defineEmits(['onAddCover'])

const CoverImageLink = ref(null)

const requiredRule = (value) => isRequired(value);

function cancelDialog(isActive) {
  emit('onAddCover', null)
  CoverImage.value = addCoverImg
  isActive.value = false
}

function addCover(isActive) {
  emit('onAddCover', CoverImageLink.value)
  CoverImage.value = CoverImageLink.value
  isActive.value = false
}

const addCoverImg = 'https://siddiquibookcompany.com/wp-content/themes/kidsy/images/placeholder.jpg'

const CoverImage = ref(addCoverImg)


function test() {
  console.log('lalalalala')
}
</script>

<template>
  <v-dialog width="350">
    <template v-slot:activator="{ props }">
      <v-img
          class="book_card_img"
          :src="CoverImage"
          cover
          v-bind="props"
          @click.prevent="test"
      />
    </template>
    <template #default="{ isActive }">
      <v-card title="Add book cover">
        <v-card-text>
          <v-form ref="numberForm">
            <v-text-field
                label="Book cover link"
                clearable
                v-model="CoverImageLink"
                :rules="[requiredRule]"
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn
              text="Cancel"
              @click="cancelDialog(isActive)"
          />
          <v-btn
              text="Add cover"
              color="blue"
              @click="addCover(isActive)"
          />
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<style scoped lang="scss">
@import "@/assets/main.scss";
</style>