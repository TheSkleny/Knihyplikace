<script setup>
import { ref } from 'vue'
import { data } from '@/assets/achievementsData.json'

const achievement = ref(null)
async function getAchievments() {
  await console.log(data)
  achievement.value = data
}

await getAchievments()
</script>

<template>
  <h1>Achievements</h1>
  <v-list>
    <v-list-item-group>
      <v-list-item v-for="item in achievement" :key="item.id">
        <v-list-item-content>
          <v-list-item-title>{{ item.name }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list-item-group>
  </v-list>
</template>