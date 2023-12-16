<style scoped lang="scss">
@import "@/assets/main.scss";
</style>
<script setup>
import {ref, defineEmits, defineProps, watch} from 'vue'
import {isRequired} from "@/utils/inputRules";

const props = defineProps({
  coverImage: {
    type: String,
    required: false,
    default: null
  }
})

const emit = defineEmits(['onAddCover', 'onRemoveCover'])

const coverForm = ref(null)
const dialog = ref(false);
const coverImageLink = ref(props.coverImage)

const requiredRule = (value) => isRequired(value);

const openDialog = () => {
  dialog.value = true;
};

const closeDialog = () => {
  dialog.value = false;
};

async function addCover() {
  const {valid} = await coverForm.value.validate()
  if (!valid) {
    return
  }
  emit('onAddCover', coverImageLink.value)
  CoverImage.value = coverImageLink.value
  closeDialog()
}

function removeCover() {
  coverImageLink.value = null
  emit('onAddCover', coverImageLink.value)
  closeDialog()
}


const CoverImage = ref(props.coverImage)

watch(() => props.coverImage, (newValue) => {
  CoverImage.value = newValue
  coverImageLink.value = newValue
})

</script>

<template>
  <slot name="trigger" :openDialog="openDialog"/>
  <v-dialog v-model="dialog" width="350">
    <v-card title="Změnit obrázek">
      <v-card-text>
        <v-form ref="coverForm">
          <v-text-field
              label="Odkaz na obrázek"
              clearable
              v-model="coverImageLink"
              :rules="[requiredRule]"
          />
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn
            text="Odebrat"
            color="error"
            @click="removeCover"
        />
        <v-spacer/>
        <v-btn
            text="Zrušit"
            @click="closeDialog"
        />
        <v-btn
            text="Změnit"
            color="primary"
            @click="addCover"
        />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>