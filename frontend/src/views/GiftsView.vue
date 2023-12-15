<style scoped lang="scss">
@import "@/assets/main.scss";
</style>
<script setup>

import {ref, computed} from 'vue'
import {supabase} from "@/lib/supabaseClient";
import WishListBookCard from "@/components/WishListBookCard.vue";
import AddBookDialog from "@/components/AddBookDialog.vue";

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


const persons = computed(() => Object.keys(gifts.value));


GetGifts()
</script>

<template>
  <AddBookDialog
      :isGift="true"
      :gift-persons="persons"
      @on-reload="GetGifts"
  />
  <v-expansion-panels>
    <v-expansion-panel v-for="(gifts, person) in gifts" :key="person">
      <v-expansion-panel-title>
        <h2>{{ person }}</h2>
        <v-spacer/>
        <p class="book_counter">{{ gifts.length }}</p>
      </v-expansion-panel-title>
      <v-expansion-panel-text>
        <WishListBookCard
            v-for="gift in gifts"
            :key="gift.GiftId"
            :book="gift"
            :show-button="false"
            :person="person"
        />
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
</template>