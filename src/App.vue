<style scoped lang="scss">
@import "@/assets/main.scss";
</style>
<script setup>
import { RouterView } from 'vue-router'
import NavBar from "@/components/NavBar.vue";
import { usePageTitleStore } from "@/stores/pageTitle";
import { storeToRefs } from "pinia";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "vue-router";

const router = useRouter()
const store = usePageTitleStore()
const {title} = storeToRefs(store)

async function onLogoClick() {
  await supabase
      .rpc('increment_achievement', {
        name_param: 'For the statement'
      })
  await router.push({name: 'home'})
}

async function routeToSettings() {
  await router.push({name: 'settings'})
}
</script>

<template>
  <v-app>
    <v-container class="margin-bottom-50">
      <v-app-bar>
        <v-app-bar-nav-icon @click="onLogoClick">
          <v-icon size="40px" color="primary">mdi-book-open-variant</v-icon>
        </v-app-bar-nav-icon>
        <v-app-bar-title class="app_title">
          {{ title }}
        </v-app-bar-title>
        <v-btn icon="mdi-cog" @click="routeToSettings"/>
      </v-app-bar>
    </v-container>
    <RouterView/>
    <NavBar/>
  </v-app>
</template>
