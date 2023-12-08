<script setup>
import { ref } from 'vue'
// TODO: change to query from database
import achievementsData from '@/assets/achievementsData.json'

import AchievementCard from "@/components/AchievementCard.vue";

const achievements = ref(achievementsData)
</script>


<template>
  <AchievementCard v-for="achievement in achievements.data" :key="achievement.id" :achievement="achievement" />
<!--  <v-container class="achievements-container" fluid>-->
<!--    <v-row>-->
<!--      <v-col cols="12">-->
<!--        <h1 class="achievements-header">{{ achievementsData.header }}</h1>-->
<!--      </v-col>-->
<!--    </v-row>-->
<!--    <v-row>-->
<!--      <v-col cols="12">-->
<!--        <v-list>-->
<!--          <v-list-item-group>-->
<!--            <v-list-item v-for="item in achievementsData.data" :key="item.id">-->
<!--              <v-list-item-avatar>-->
<!--                <img :src="item.image" alt="Achievement Image" class="achievement-image" />-->
<!--              </v-list-item-avatar>-->
<!--              <v-list-item-content>-->
<!--                <v-list-item-title>{{ item.name }}</v-list-item-title>-->
<!--                <v-list-item-subtitle>{{ item.description }}</v-list-item-subtitle>-->
<!--                <v-list-item-subtitle>{{ item.points }} points</v-list-item-subtitle>-->
<!--              </v-list-item-content>-->
<!--            </v-list-item>-->
<!--          </v-list-item-group>-->
<!--        </v-list>-->
<!--      </v-col>-->
<!--    </v-row>-->
<!--  </v-container>-->
</template>


<style scoped>
.achievements-header {
  font-size: 2rem;
  margin-bottom: 2rem;
}

.achievement-image {
  width: 100px;
  height: 100px;
}
</style>
