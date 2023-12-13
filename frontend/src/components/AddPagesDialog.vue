<script setup>
import {ref, defineProps, defineEmits} from 'vue'
import {supabase} from "@/lib/supabaseClient";
import {isRequired} from "@/utils/inputRules";

const props = defineProps({
  book: {
    type: Object,
    required: true
  }
})

const newPagesRead = ref(0)

const emit = defineEmits(['onReload'])

const numberForm = ref(null)

const requiredRule = (value) => isRequired(value);
const pagesLimitRule = (value) => value <= props.book.Pages || 'Pages read cannot be more than total pages';

function onShowDialog() {
  newPagesRead.value = props.book.PagesRead ?? 0
}


async function updatePages(num, isActive) {
  console.log('addPagesPAPAPA')
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

async function finishReading(isActive) {
  await updatePages(props.book.Pages, isActive)
}

async function addPages(num, isActive) {
  const {valid} = await numberForm.value.validate()
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
        Read
      </v-btn>
    </template>
    <template #default="{isActive}">
      <v-card title="Add read pages">
        <v-card-text>
          <v-form ref="numberForm">
            <v-text-field
                label="Pages read"
                type="number"
                v-model="newPagesRead"
                :rules="[requiredRule, pagesLimitRule]"
            />
          </v-form>

        </v-card-text>
        <v-card-actions>
          <v-spacer/>

          <v-btn
              text="Add pages"
              @click="addPages(newPagesRead, isActive)"
          ></v-btn>
          <v-btn
              text="Finished reading"
              color="blue"
              @click="finishReading(isActive)"
          ></v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<style scoped>

</style>