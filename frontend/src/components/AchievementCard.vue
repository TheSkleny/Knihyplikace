<script setup>
import { defineProps } from 'vue'


const DEFAULT_COVER = 'https://cdn.vuetifyjs.com/images/parallax/material.jpg'

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
          <h3>{{props.achievement.Description}}</h3>
        </v-row>

        <v-row style="margin-top: 40px">
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

<style scoped>
.achievement_card {
  width: 90%;
  max-height: 14rem;
  display: block;
  margin-left: auto;
  margin-right: auto;
  padding: 20px;
  margin-bottom: 20px;
  background: lightgray;
}

.achievement_card_img {
  height: 140px;
  width: 100px;
  display: block;
  margin-top: auto;
  margin-bottom: auto

}


</style>