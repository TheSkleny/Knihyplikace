<style>
 @import "@/assets/main.scss";
</style>
<script setup>
import {ref, defineProps, defineEmits} from 'vue'
import {supabase} from "@/lib/supabaseClient";
import {isRequired} from "@/utils/inputRules";


const newListName = ref(null)

const emit = defineEmits(['onReload'])

const addListForm = ref(null)

const requiredRule = (value) => isRequired(value);

const listUniqueNameRule = async (value) => {
  const {data, error} = await supabase
      .from('List')
      .select()
      .eq('Name', value)
  if (error) console.log('error', error)
  else {
    console.log(data)
    return data.length === 0 || 'List with this name already exists'
  }
}



async function updatePages(num, isActive) {
  console.log(props.book.Id)
  const {data, error} = await supabase
      .from('Book')
      .update({PagesRead: num, LastPageUpdate: 'now()'})
      .eq('Id', props.book.Id)
  if (error) console.log('error', error)
  else console.log(data)
  emit('onReload')
  isActive.value = false
}



</script>

<template>
  <v-dialog width="500">
    <template v-slot:activator="{ props }">
      <v-btn
          color="secondary"
          v-bind="props"
      >
        Read
      </v-btn>
    </template>
    <template #default="{isActive}">
      <v-card title="Create new list">
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
              @click=""
          ></v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>
