<style scoped lang="scss">
@import "@/assets/main.scss";
</style>
<script setup>
import { ref, defineEmits, defineProps } from 'vue'
import { supabase } from "@/lib/supabaseClient";
import { isRequired } from "@/utils/inputRules";
import DeleteConfirmDialog from "@/components/DeleteConfirmDialog.vue";

const props = defineProps({
  selectedList: {
    type: String,
    required: false,
    default: ''
  }
})

const newListName = ref(props.selectedList)
const addListForm = ref(null)
const dialog = ref(false);

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
    closeDialog()  }
}

async function updateList() {
  const {valid} = await addListForm.value.validate()
  if (!valid) {
    return
  }
  if (await addListForm.value.validate()) {
    await supabase
        .from('BookList')
        .update({Name: newListName.value})
        .eq('Name', props.selectedList)
    emit('onReload')
    closeDialog()  }
}

async function deleteList() {
  const {data: bookListData, error: bookListError} = await supabase
      .from('BookList')
      .select('Id')
      .eq('Name', props.selectedList)
  if (bookListError) {
    console.log('error', bookListError)
    return
  }
  const listIds = bookListData.map(item => item.Id)
  await supabase
      .from('BookInBookList')
      .delete()
      .in('ListId', listIds)
  await supabase
      .from('BookList')
      .delete()
      .eq('Name', props.selectedList)

  emit('onReload')
  closeDialog()
}

const openDialog = () => {
  dialog.value = true;
};

const closeDialog = () => {
  dialog.value = false;
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
          :title="selectedList === '' ? 'Create list' : 'Update List: ' + selectedList"
      >
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
          <DeleteConfirmDialog :title="props.selectedList" delete-from="e Svých seznamů" @on-delete="deleteList">
            <template v-slot:trigger="{ openDialog }">
              <v-btn v-if="selectedList !== ''"
                     text="Smazat seznam"
                     color="error"
                     @click.prevent="openDialog"
              />
            </template>
          </DeleteConfirmDialog>
          <v-spacer/>
          <v-btn v-if="selectedList !== ''"
                 text="Přejmenovat"
                 color="primary"
                 @click="updateList"
          />
          <v-btn v-if="selectedList === ''"
                 text="Vytvořit"
                 color="primary"
                 @click="insertList"
          />
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
