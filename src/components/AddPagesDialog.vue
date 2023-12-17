<!-- Filename: AddPagesDialog.vue -->
<!-- Author:   Adam Světlík       -->
<!-- Login:    xsvetl07           -->
<style scoped lang="scss">
 @import "@/assets/main.scss";
</style>
<script setup>
import { ref, defineProps, defineEmits } from 'vue'
import { supabase } from "@/lib/supabaseClient";
import { isRequired } from "@/utils/inputRules";

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

const newPagesRead = ref(0)
const numberForm = ref(null)

/**
 * Required rule
 * @param {string} value - The value
 * @returns {boolean} - True if the value is required
 */
const requiredRule = (value) => isRequired(value);
/**
 * Pages limit rule
 * @param {number} value - The value
 * @returns {boolean} - True if the value is less than or equal to the total pages
 */
const pagesLimitRule = (value) => value <= props.book.Pages || 'Pages read cannot be more than total pages';

/**
 * Shows the page update dialog
 */
function onShowDialog() {
  newPagesRead.value = props.book.PagesRead ?? 0
}

/**
 * Updates the pages read
 * @param {number} num - The number of pages read
 * @param {Ref<boolean>} isActive - Whether the dialog is active
 */
async function updatePages(num, isActive) {
  await supabase
    .from('Book')
    .update({ PagesRead: num, LastPageUpdate: 'now()' })
    .eq('Id', props.book.Id);
  emit('onReload');
  isActive.value = false;
  if (num !== 0 && num !== props.book.Pages) {
    // Achievement: The Procrastinator
    await supabase
        .rpc('increment_achievement', {
            name_param: 'The Procrastinator'
        });
  }
  if (num === props.book.Pages) {
    // Achievement: So it begins
    await supabase
        .rpc('increment_achievement', {
            name_param: 'So it begins'
        });
    // Achievement: Ten out of ten
    await supabase
        .rpc('increment_achievement', {
            name_param: 'Ten out of ten'
        });
  }
}

/**
 * Sets the book as read
 * @param {Ref<boolean>} isActive - Whether the dialog is active
 */
async function finishReading(isActive) {
  await updatePages(props.book.Pages, isActive)
}

/**
 * Adds the pages read
 * @param {number} num - The number of pages read
 * @param {Ref<boolean>} isActive - Whether the dialog is active
 */
async function addPages(num, isActive) {
  const { valid } = await numberForm.value.validate()
  if (!valid) {
    return
  }
  await updatePages(num, isActive)
}
</script>

<template>
  <v-dialog width="500">
    <template v-slot:activator="{ props }">
      <v-btn
        color="secondary"
        v-bind="props"
        @click.prevent="onShowDialog"
      >
        Číst
      </v-btn>
    </template>
    <template #default="{ isActive }">
      <v-card title="Přidat přečtené stránky">
        <v-card-text>
          <v-form ref="numberForm">
            <v-text-field
              type="number"
              v-model="newPagesRead"
              :rules="[requiredRule, pagesLimitRule]"
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn
            text="Přidat stránky"
            @click="addPages(newPagesRead, isActive)"
          />
          <v-btn
            text="Dočteno"
            color="primary"
            @click="finishReading(isActive)"
          />
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>