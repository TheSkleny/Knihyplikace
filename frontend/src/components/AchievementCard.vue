<style scoped lang="scss">
 @import "@/assets/main.scss";
</style>
<script setup>
import { defineProps } from 'vue'

const DEFAULT_COVER = 'https://cdn.vuetifyjs.com/images/parallax/material.jpg'

/**
 * @type {Prettify<Readonly<ExtractPropTypes<{achievement: {default: (function(): Achievement), type: ObjectConstructor,
 *        required: boolean}}>>>}
 */
const props = defineProps({
  achievement: {
    type: Object,
    required: true
  }
})
const image = props.achievement.ImageUri ?? DEFAULT_COVER
const progress = props.achievement.Current / props.achievement.Goal * 100
</script>

<template>
  <v-card class="achievement_card">
    <v-row>
      <v-col cols="4">
        <v-img :src="image" class="achievement_card_img" :style="{ filter: progress !== 100 ? 'grayscale(100%)' : 'none' }" cover />
      </v-col>
      <v-col>
        <v-row class="margin-top-10">
          <h1>{{ props.achievement.Name }}</h1>
        </v-row>
        <v-row class="margin-top-20">
          <p>{{props.achievement.Description}}</p>
        </v-row>
        <v-row class="margin-top-40">
          <p>
            {{ progress === 100 ? 'Completed' : progress.toPrecision(2) + '%'}}
          </p>
          <v-progress-linear
              :model-value="progress"
              :height="10"
              color="secondary"
              class="border-radius-5"
          />
        </v-row>
      </v-col>
    </v-row>
  </v-card>
</template>
