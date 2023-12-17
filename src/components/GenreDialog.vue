<script setup>
import {ref, defineProps, defineEmits} from "vue";
import {isRequired} from "@/utils/inputRules";
import {supabase} from "@/lib/supabaseClient";

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

const openDialog = () => {
  dialog.value = true;
};

const closeDialog = () => {
  dialog.value = false;
};

const requiredRule = (value) => isRequired(value);

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
