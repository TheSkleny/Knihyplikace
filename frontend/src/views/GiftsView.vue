<script setup>

import {ref} from 'vue'
import {supabase} from "@/lib/supabaseClient";
import WishListBookCard from "@/components/WishListBookCard.vue";

/**
 * @type {Ref<UnwrapRef<Gift[]>>}
 */
const gifts = ref([])

async function GetGifts() {
  const {data, error} = await supabase
      .from('vGiftBooks')
      .select()
  if (error) {
    console.log('error', error)
  }
  else {
    gifts.value = data.reduce((acc, gift) => {
      if (acc[gift.Person]) {
        acc[gift.Person].push(gift);
      } else {
        acc[gift.Person] = [gift];
      }
      return acc;
    }, {});
  }
}


GetGifts()
</script>

<template>
  <v-expansion-panels>
    <v-expansion-panel v-for="(gifts, person) in gifts" :key="person">
      <v-expansion-panel-title>
        <h2>{{ person }}</h2>
      </v-expansion-panel-title>
      <v-expansion-panel-text>
        <WishListBookCard
            v-for="gift in gifts"
            :key="gift.GiftId"
            :book="gift"
            :show-button="false"
        />
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<style scoped>

</style>