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
  const {data, error} = await supabase
      .from('Books')
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
              min="0"
              max="1000"
              v-model="newPagesRead"
              
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
              @click="addPages(props.book.Pages, isActive)"
          ></v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<style scoped>

</style>