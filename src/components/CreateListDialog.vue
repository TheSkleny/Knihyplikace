<style scoped lang="scss">
@import "@/assets/main.scss";
</style>
<script setup>
import { ref, defineEmits, defineProps } from 'vue'
import { supabase } from "@/lib/supabaseClient";
import { isRequired } from "@/utils/inputRules";

const props = defineProps({
  list: {
    type: String,
    required: false,
    default: ''
  }
})

const newListName = ref(props.list)
const addListForm = ref(null)
const dialog = ref(false);

/**
 * Required rule
 * @param {string} value - The value
 * @returns {boolean} - True if the value is required
 */
const requiredRule = (value) => isRequired(value);
/**
 * List unique name rule
 * @param {string} value - The value
 * @returns {boolean} - True if the value is unique
 */
const listUniqueNameRule = async (value) => {
  const {data, error} = await supabase
      .from('BookList')
      .select()
      .eq('Name', value)
  if (error) console.log('error', error)
  else {
    return data.length === 0 || 'Seznam s tímto jménem již existuje'
  }
}

const emit = defineEmits(['onReload'])

/**
 * Create new custom list
 */
async function insertList() {
  const {valid} = await addListForm.value.validate()
  if (!valid) {
    return
  }
  if (await addListForm.value.validate()) {
    await supabase
        .from('BookList')
        .insert([
          {Name: newListName.value}
        ])
    emit('onReload')
    closeDialog()
  }
}

/**
 * Open the dialog
 */
const openDialog = () => {
  newListName.value = null
  dialog.value = true
};

/**
 * Close the dialog
 */
const closeDialog = () => {
  dialog.value = false
};
</script>

<template>
  <div>
    <slot name="trigger" :openDialog="openDialog"/>
    <v-dialog
        class="max-height-85"
        v-model="dialog"
        max-width="500px"
    >
      <v-card
          title="Vytvořit seznam"
      >
        <v-card-text>
          <v-form ref="addListForm">
            <v-text-field
                label="Název seznamu"
                type="text"
                v-model="newListName"
                :rules="[requiredRule, listUniqueNameRule]"
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn
              text="Vytvořit"
              color="primary"
              @click="insertList"
          />
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>