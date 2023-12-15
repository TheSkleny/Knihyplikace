<style scoped lang="scss">
 @import "@/assets/main.scss";
</style>
<script setup>
import { ref, defineProps, defineEmits } from 'vue'
import { supabase } from "@/lib/supabaseClient";
import { isRequired } from "@/utils/inputRules";

/**
 * @type {Prettify<Readonly<ExtractPropTypes<{book: {default: (function(): Book), type: ObjectConstructor, required: boolean}}>>>}
 */
const props = defineProps({
  book: {
    type: Object,
    required: true
  }
})
const emit = defineEmits(['onReload'])

const newPagesRead = ref(0)
const numberForm = ref(null)
const requiredRule = (value) => isRequired(value);
const pagesLimitRule = (value) => value <= props.book.Pages || 'Pages read cannot be more than total pages';

function onShowDialog() {
  newPagesRead.value = props.book.PagesRead ?? 0
}

async function updatePages(num, isActive) {
  await supabase
    .from('Book')
    .update({ PagesRead: num, LastPageUpdate: 'now()' })
    .eq('Id', props.book.Id);
  emit('onReload');
  isActive.value = false;
  if (num != 0 && num != props.book.Pages) {
    await supabase
        .rpc('increment_achievement', {
            name_param: 'The Procrastinator'
        });
  }
  if (num === props.book.Pages) {
    console.log('calling RPC');
    await supabase
        .rpc('increment_achievement', {
            name_param: 'Ten out of ten'
        });
    await supabase
        .rpc('increment_achievement', {
            name_param: 'So it begins'
        });
  }
}

async function finishReading(isActive) {
  await updatePages(props.book.Pages, isActive)
}

async function addPages(num, isActive) {
  const { valid } = await numberForm.value.validate()
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
    <template #default="{ isActive }">
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
          />
          <v-btn
            text="Finished reading"
            color="blue"
            @click="finishReading(isActive)"
          />
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>