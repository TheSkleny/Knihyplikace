<style scoped lang="scss">
@import "@/assets/main.scss";
</style>
<script setup>
import { ref, defineProps, defineEmits } from 'vue';

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  deleteFrom: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['onDelete']);
const dialog = ref(false);

const openDialog = () => {
  dialog.value = true;
};

const closeDialog = () => {
  dialog.value = false;
};

const deleteItem = () => {
  emit('onDelete');
  closeDialog();
};

</script>

<template>
  <div>
    <slot name="trigger" :openDialog="openDialog" />
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title class="headline">Odebrat {{props.deleteFrom === 'e Svých seznamů' ? 'seznam' : 'knihu'}} {{ props.title }}?</v-card-title>
        <v-card-text>Opravdu odebrat {{props.deleteFrom === 'e Svých seznamů' ? 'seznam' : 'knihu'}} '{{ props.title }}' z{{ props.deleteFrom }}?</v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn text @click="closeDialog">Zrušit</v-btn>
          <v-btn color="error" text @click="deleteItem">Odebrat</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>