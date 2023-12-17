<!-- Filename: AchievementCard.vue -->
<!-- Author:   Lukáš Zavadil       -->
<!-- Login:    xzavad20            -->
<style scoped lang="scss">
@import "@/assets/main.scss";
</style>
<script setup>
import { defineProps } from 'vue'

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

// Placeholder cover image if the achievement doesn't have one
const DEFAULT_COVER = 'https://cdn.vuetifyjs.com/images/parallax/material.jpg'
const image = props.achievement.ImageUri ?? DEFAULT_COVER

// Progress of the achievement
const progress = props.achievement.Current / props.achievement.Goal * 100
</script>

<template>
  <v-card class="achievement_card">
    <v-row>
      <v-col cols="4">
        <v-img :src="image" class="achievement_card_img" :style="{ filter: progress !== 100 ? 'grayscale(100%)' : 'none' }" cover />
      </v-col>
      <v-col>
        <v-row >
          <h1>{{ props.achievement.Name }}</h1>
        </v-row>
        <v-row class="margin-top-20 margin-bottom-10">
          <p class="achievement_card_text">{{ props.achievement.Description }}</p>
        </v-row>
        <v-row class="margin-top-40">
          <v-col>
          <p class="text-align-right">
            {{ progress === 100 ? 'Dokončeno' : progress.toPrecision(2) + '%'}}
          </p>
          <v-progress-linear
              :model-value="progress"
              :height="10"
              :color="progress === 100 ? 'primary_light' : 'primary'"
              class="border-radius-5"
          />
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-card>
</template>