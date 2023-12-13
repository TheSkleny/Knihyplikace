<script setup>
import { ref } from 'vue';
import { supabase } from '@/lib/supabaseClient';
import AchievementCard from "@/components/AchievementCard.vue";

const achievements = ref([]);

async function getAchievements() {
  const { data, error } = await supabase
    .from('Achievement')
    .select(
      'Id, Name, Description, Reward, Goal, Current, ImageUri'
    );
  if (error) {
    console.error('Error fetching achievements:', error);
  } else {
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
