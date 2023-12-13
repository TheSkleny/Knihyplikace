<style lang="scss">
 @import "@/assets/main.scss";
</style>
<script setup>
import { ref } from 'vue';
import { supabase } from '@/lib/supabaseClient';
import AchievementCard from "@/components/AchievementCard.vue";

const achievements = ref([]);

async function getAchievements() {
  const { data, error } = await supabase
    .from('Achievement')
    .select('Id, Name, Description, Reward, Goal, Current, ImageUri');
  if (error) {
    console.error('Error fetching achievements:', error);
  } 
  else {
    data.forEach(achievement => {
      achievement.progress = achievement.Current / achievement.Goal;
    });

    data.sort((a, b) => {
      if (a.Current === a.Goal) return 1;
      if (b.Current === b.Goal) return -1;
      return b.progress - a.progress;
    });

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
