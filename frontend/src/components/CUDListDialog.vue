<style scoped lang="scss">
 @import "@/assets/main.scss";
</style>
<script setup>
import {ref, defineEmits, defineProps, watch, toRef, toValue} from 'vue'
import {supabase} from "@/lib/supabaseClient";
import {isRequired} from "@/utils/inputRules";

const props = defineProps({
  selectedList: {
    type: String,
    required: true
  }
})

const newListName = ref(null)

const addListForm = ref(null)

const requiredRule = (value) => isRequired(value);

const listUniqueNameRule = async (value) => {
  console.log(value)
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
  const { valid } = await addListForm.value.validate()
  if (!valid) {
    return
  }
  console.log('insert')
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

async function updateList(isActive) {
  const { valid } = await addListForm.value.validate()
  if (!valid) {
    return
  }
  console.log('update')
  console.log(newListName.value)
  if (await addListForm.value.validate()) {
    await supabase
        .from('BookList')
        .update({Name: newListName.value})
        .eq('Name', props.selectedList)
    emit('onReload')
    isActive.value = false
  }
}

async function deleteList(isActive) {
  // console.log('delete')
  // console.log(newListName.value)
  // await supabase
  //     .from('BookList')
  //     .delete()
  //     .eq('Name', props.selectedList)
  // emit('onReload')
  // isActive.value = false
  // TODO - delete list and remove all books from it
  // TODO - show confirmation dialog
  console.log('TODO delete')
}

function opedDialog() {
  newListName.value = null
}



</script>

<template>
  <v-dialog class="max-height-85">
    <template v-slot:activator="{ props }">
      <v-btn v-if="selectedList === ''"
          class="btn-bottom-right"
          icon="mdi-plus"
          color="primary"
          elevation="24"
          size="50"
          v-bind="props"
          @click.prevent="opedDialog"
      />
      <v-btn v-if="selectedList !== ''"
          class="btn-bottom-right"
          icon="mdi-pencil"
          color="teal"
          elevation="24"
          size="50"
          v-bind="props"
          @click.prevent="opedDialog"
      />
    </template>
    <template #default="{ isActive }">
      <v-card :title="selectedList === '' ? 'Create list' : 'Update List: ' + selectedList">
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
          <v-btn v-if="selectedList !== ''"
              text="Delete list"
              color="red"
              @click="deleteList(isActive)"
          />
          <v-spacer/>
          <v-btn v-if="selectedList !== ''"
              text="Change list name"
              color="teal"
              @click="updateList(isActive)"
          />
          <v-btn v-if="selectedList === ''"
            text="Create list"
            color="blue"
            @click="insertList(isActive)"
          />
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>
