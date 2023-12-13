<style lang="scss">
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
        <v-img :src="image" class="achievement_card_img" cover />
      </v-col>
      <v-col>
        <v-row style="margin-top: 10px">
          <h1>{{ props.achievement.Name }}</h1>
        </v-row>
        <v-row style="margin-top: 20px">
          <p>{{props.achievement.Description}}</p>
        </v-row>
        <v-row style="margin-top: 40px">
          <p> // TODO: @sklynar: this is not working - make this 'text-aling right'
            {{ progress === 100 ? 'Completed' : progress.toPrecision(2) + '%'}}
          </p>
          <v-progress-linear
              :model-value="progress"
              :height="10"
              color="secondary"
              style="border-radius: 5px"
          />
        </v-row>
      </v-col>
    </v-row>
  </v-card>
</template>
