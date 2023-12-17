<style scoped lang="scss">
@import "@/assets/main.scss";
</style>
<script setup>
import { ref, defineProps, defineEmits } from "vue";
import DeleteConfirmDialog from "@/components/DeleteConfirmDialog.vue";
import { isRequired } from "@/utils/inputRules";
import { supabase } from "@/lib/supabaseClient";

/**
 * @type {Prettify<Readonly<ExtractPropTypes<{list: {default: (function(): BookList), type: ObjectConstructor, required: boolean}}>>>}
 */
const props = defineProps({
  list: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['onReload'])

const dialog = ref(false);
const listNameForm = ref(null)
const newListName = ref(props.list.ListName)

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
    if (value === props.list.ListName) {
      return true
    } else {
      return data.length === 0 || 'Seznam s tímto jménem již existuje'
    }
  }
}

/**
 * Save the book list name
 */
async function saveListName() {
  const {valid} = await listNameForm.value.validate()
  if (!valid) {
    return
  }
  if (newListName.value === props.list.ListName) {
    return
  }
  await supabase
      .from('BookList')
      .update({Name: newListName.value})
      .eq('Id', props.list.Id)
  emit('onReload')
}

/**
 * Remove the book from the book list
 * @param {Book} book - The book data
 */
async function removeBookFromList(book) {
  await supabase
      .from('BookInBookList')
      .delete()
      .eq('BookId', book.Id)
      .eq('ListId', props.list.Id)
  emit('onReload')
}

/**
 * Delete the book list
 */
async function deleteList() {
  const {data: bookListData, error: bookListError} = await supabase
      .from('BookList')
      .select('Id')
      .eq('Id', props.list.Id)
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
      .eq('Id', props.list.Id)
  emit('onReload')
  closeDialog()
}

/**
 * Open the dialog
 */
const openDialog = () => {
  newListName.value = props.list.ListName
  dialog.value = true;
};

/**
 * Close the dialog
 */
const closeDialog = () => {
  dialog.value = false;
};
</script>

<template>
  <slot name="trigger" :openDialog="openDialog"/>
  <v-dialog
      class="max-height-85"
      v-model="dialog"
      max-width="500px"
  >
    <v-card title="Upravit seznam"
    >
      <v-card-text>
        <h2>
          Název:
        </h2>
        <v-row>
          <v-form ref="listNameForm">
            <v-text-field
                style="margin-left: 20px; width: 180px"
                type="text"
                clearable
                variant="underlined"
                v-model="newListName"
                :rules="[requiredRule, listUniqueNameRule]"
            />
          </v-form>
          <v-btn
              color="primary"
              style="margin-left: 20px; margin-top: 10px"
              @click="saveListName"
          >
            Uložit
          </v-btn>
        </v-row>

        <h2
            v-if="props.list.Book.length !== 0"
            style="margin-top: 20px"
        >
          Knihy v seznamu:
        </h2>
        <v-table v-if="props.list.Book.length !== 0">
          <thead>
          <tr>
            <th>
              Název
            </th>
            <th>
              Autor
            </th>
            <th style="width: 90px">
              Akce
            </th>
          </tr>
          </thead>
          <tbody>
          <tr
              v-for="book in props.list.Book"
              :key="book.Id"
          >
            <td>
              {{ book.Name }}
            </td>
            <td>
              {{ book.Author }}
            </td>
            <td>
              <DeleteConfirmDialog :title="book.Name" :delete-from=" 'e seznamu ' + list.ListName"
                                   @on-delete="removeBookFromList(book)">
                <template v-slot:trigger="{ openDialog }">
                  <v-btn
                      icon="mdi-delete"
                      color="error"
                      size="30"
                      variant="text"
                      @click.prevent="openDialog"
                  />
                </template>
              </DeleteConfirmDialog>
            </td>
          </tr>
          </tbody>
        </v-table>
      </v-card-text>
      <v-card-actions>
        <DeleteConfirmDialog :title="props.list.ListName" delete-from=" vlastních seznamů"
                             @on-delete="deleteList">
          <template v-slot:trigger="{ openDialog }">
            <v-btn
                color="error"
                @click="openDialog"
            >
              Smazat seznam
            </v-btn>
          </template>
        </DeleteConfirmDialog>

        <v-spacer/>
        <v-btn
            color="primary"
            @click="closeDialog"
        >
          Hotovo
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>