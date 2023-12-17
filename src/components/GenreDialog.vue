<!-- Filename: GenreDialog.vue -->
<!-- Author:   Lukáš Zavadil   -->
<!-- Login:    xzavad20        -->
<style scoped lang="scss">
@import "@/assets/main.scss";
</style>
<script setup>
import { ref, defineProps, defineEmits } from "vue";
import { isRequired } from "@/utils/inputRules";
import { supabase } from "@/lib/supabaseClient";

/**
 * @type {Prettify<Readonly<ExtractPropTypes<{genre: {default: (function(): Genre), type: ObjectConstructor, required: boolean}}>>>}
 */
const props = defineProps({
  genre: {
    type: Object,
    required: false,
    default: null
  }
});

const emit = defineEmits(['onReload']);

const genre = ref(props.genre?.Name);
const dialog = ref(false);
const genreForm = ref(null);

/**
 * Shows the dialog
 */
const openDialog = () => {
  dialog.value = true;
};

/**
 * Closes the dialog
 */
const closeDialog = () => {
  dialog.value = false;
};

/**
 * Required rule
 * @param {string} value - The value
 * @returns {boolean} - True if the value is required
 */
const requiredRule = (value) => isRequired(value);

/**
 * Genre unique name rule
 * @param {string} value - The value
 * @returns {boolean} - True if the value is unique
 */
const genreUniqueNameRule = async (value) => {
  const {data, error} = await supabase
      .from('BookGenre')
      .select()
      .eq('Name', value)
  if (error) console.log('error', error)
  else {
    if (value === props.genre?.Name) {
      return true
    } else {
      return data.length === 0 || 'Žánr s tímto jménem již existuje'
    }
  }
}

/**
 * Create new genre
 */
async function addGenre() {
  const {valid} = await genreForm.value.validate()
  if (!valid) {
    return
  }
  await supabase
      .from('BookGenre')
      .insert([{Name: genre.value}])
  emit('onReload')
  genre.value = null
  closeDialog()
}

/**
 * Update genre
 */
async function updateGenre() {
  const {valid} = await genreForm.value.validate()
  if (!valid) {
    return
  }
  if (genre.value === props.genre.Name) {
    closeDialog()
    return
  }
  await supabase
      .from('BookGenre')
      .update({Name: genre.value})
      .eq('Id', props.genre.Id)
  emit('onReload')
  closeDialog()
}
</script>

<template>
  <slot name="trigger" :openDialog="openDialog"/>
  <v-dialog v-model="dialog" width="350">
    <v-card :title="props.genre ? 'Přejmenovat žánr' :'Přidat žánr'">
      <v-card-text>
        <v-form ref="genreForm">
          <v-text-field
              label="Název žánru"
              clearable
              v-model="genre"
              :rules="[requiredRule, genreUniqueNameRule]"
          />
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer/>
        <v-btn
            text="Zrušit"
            @click="closeDialog"
        />
        <v-btn
            v-if="props.genre"
            text="Změnit"
            color="primary"
            @click="updateGenre"
        />
        <v-btn
            v-else
            text="Přidat"
            color="primary"
            @click="addGenre"
        />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>