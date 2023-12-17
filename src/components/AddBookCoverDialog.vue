<!-- Filename: AddBookCoverDialog.vue -->
<!-- Author:   Adam Světlík           -->
<!-- Login:    xsvetl07               -->
<style scoped lang="scss">
@import "@/assets/main.scss";
</style>
<script setup>
import { ref, defineEmits, defineProps, watch } from 'vue'
import { isRequired } from "@/utils/inputRules";

const props = defineProps({
  coverImage: {
    type: String,
    required: false,
    default: null
  }
})

const emit = defineEmits(['onAddCover', 'onRemoveCover'])

const coverForm = ref(null)
const dialog = ref(false);
const coverImageLink = ref(props.coverImage)

/**
 * Required rule
 * @param {string} value - The value
 * @returns {boolean} - True if the value is required
 */
const requiredRule = (value) => isRequired(value);

/**
 * Open the dialog
 */
const openDialog = () => {
  dialog.value = true;
};

/**
 * Close the dialog
 */
const closeDialog = () => {
  dialog.value = false;
};

/**
 * Add the book cover
 */
async function addCover() {
  const {valid} = await coverForm.value.validate()
  if (!valid) {
    return
  }
  emit('onAddCover', coverImageLink.value)
  CoverImage.value = coverImageLink.value
  closeDialog()
}

/**
 * Remove the book cover
 */ 
function removeCover() {
  coverImageLink.value = null
  emit('onAddCover', coverImageLink.value)
  closeDialog()
}

const CoverImage = ref(props.coverImage)

// Watch for changes in the cover image
watch(() => props.coverImage, (newValue) => {
  CoverImage.value = newValue
  coverImageLink.value = newValue
})
</script>

<template>
  <slot name="trigger" :openDialog="openDialog"/>
  <v-dialog v-model="dialog" width="350">
    <v-card title="Změnit obrázek">
      <v-card-text>
        <v-form ref="coverForm">
          <v-text-field
              label="Odkaz na obrázek"
              clearable
              v-model="coverImageLink"
              :rules="[requiredRule]"
          />
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn
            text="Odebrat"
            color="error"
            @click="removeCover"
        />
        <v-spacer/>
        <v-btn
            text="Zrušit"
            @click="closeDialog"
        />
        <v-btn
            text="Změnit"
            color="primary"
            @click="addCover"
        />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>