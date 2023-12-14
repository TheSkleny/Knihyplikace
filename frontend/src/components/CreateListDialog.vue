<style scoped lang="scss">
 @import "@/assets/main.scss";
</style>
<script setup>
import {ref, defineProps, defineEmits} from 'vue'
import {supabase} from "@/lib/supabaseClient";
import {isRequired} from "@/utils/inputRules";


const newListName = ref(null)

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
          <v-form ref="numberForm">
            <v-text-field
              label="List name"
              type="text"
              v-model="newPagesRead"
              :rules="[requiredRule, pagesLimitRule]"
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn
            text="Create list"
            color="blue"
            @click="finishReading(isActive)"
          />
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>
