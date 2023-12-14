<style scoped lang="scss">
 @import "@/assets/main.scss";
</style>
<script setup>
import {ref, defineEmits} from 'vue'
import {supabase} from "@/lib/supabaseClient";
import {isRequired} from "@/utils/inputRules";


const newListName = ref(null)

const addListForm = ref(null)

const requiredRule = (value) => isRequired(value);

const listUniqueNameRule = async (value) => {
  const {data, error} = await supabase
      .from('BookList')
      .select()
      .eq('Name', value)
  if (error) console.log('error', error)
  else {
    return data.length === 0 || 'List with this name already exists'
  }
}



const emit = defineEmits(['onReload'])

async function insertList(isActive) {
  console.log(newListName.value)
  if (await addListForm.value.validate()) {
    await supabase
        .from('BookList')
        .insert([
          {Name: newListName.value}
        ])
    emit('onReload')
    isActive.value = false
  }
}

function opedDialog() {
  newListName.value = null
}



</script>

<template>
  <v-dialog class="max-height-85">
    <template v-slot:activator="{ props }">
      <v-btn
          class="btn-bottom-right"
          icon="mdi-plus"
          color="primary"
          elevation="24"
          size="50"
          v-bind="props"
          @click.prevent="opedDialog"
      />
    </template>
    <template #default="{ isActive }">
      <v-card title="Create list">
        <v-card-text>
          <v-form ref="addListForm">
            <v-text-field
              label="List name"
              type="text"
              v-model="newListName"
              :rules="[requiredRule, listUniqueNameRule]"
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn
            text="Create list"
            color="blue"
            @click="insertList(isActive)"
          />
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>
