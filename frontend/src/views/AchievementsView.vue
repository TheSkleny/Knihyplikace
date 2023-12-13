<script setup>
import { ref } from 'vue';
import { supabase } from '@/lib/supabaseClient';
import AchievementCard from "@/components/AchievementCard.vue";
import "@/assets/styles/AchievementsView.scss";

const achievements = ref([]);

async function getAchievements() {
  const { data, error } = await supabase
    .from('Achievement')
    .select('Id, Name, Description, Reward, Goal, Current, ImageUri');
  if (error) {
    console.error('Error fetching achievements:', error);
  } 
  else {
    achievements.value = data;
  }
}

getAchievements();
</script>

<template>
  <div>
    <AchievementCard v-for="achievement in achievements" :key="achievement.Id" :achievement="achievement" />
  </div>
  <div style="display: block; height: 100px;"/>

</template>
