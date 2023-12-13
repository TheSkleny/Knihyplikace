<script setup>
import {ref, defineProps, defineEmits} from 'vue'
import {supabase} from "@/lib/supabaseClient";

const props = defineProps({
  book: {
    type: Object,
    required: true
  }
})

const newPagesRead = ref(0)

const emit = defineEmits(['onReload'])

function onShowDialog() {
  newPagesRead.value = props.book.PagesRead ?? 0
}


async function addPages(num, isActive) {
  if (num != null && (requiredRule || pagesLimitRule)) {
    console.log('num')
    console.log(num)
    console.log('props.book.PagesRead')
    console.log(props.book.PagesRead)
    console.log(requiredRule)
    console.log(pagesLimitRule)
    return
  }
  if (num === null) {
    num = props.book.Pages
  }
  console.log('addPagesPAPAPA')
  console.log(props.book.Id)
  const {data, error} = await supabase
      .from('Books')
      .update({PagesRead: num, LastPageUpdate: 'now()'})
      .eq('Id', props.book.Id)
  if (error) console.log('error', error)
  else console.log(data)
  emit('onReload')
  isActive.value = false
}


const requiredRule = (value) => !!value || 'Field is required';
const pagesLimitRule = (value) => value <= props.book.Pages || 'Pages read cannot be more than total pages';

</script>

<template>
  <v-dialog width="500">
    <template v-slot:activator="{ props }" >
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
          <v-text-field
              label="Pages read"
              type="number"
              v-model="newPagesRead"
              :rules="[requiredRule, pagesLimitRule]"
          />
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
              @click="addPages(null, isActive)"
          ></v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<style scoped>

</style>