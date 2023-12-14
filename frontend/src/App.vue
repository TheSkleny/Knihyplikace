<style scoped lang="scss">
 @import "@/assets/main.scss";
</style>
<script setup>
import {RouterView} from 'vue-router'
import NavBar from "@/components/NavBar.vue";
import {usePageTitleStore} from "@/stores/pageTitle";
import {storeToRefs} from "pinia";
import {supabase} from "@/lib/supabaseClient";
import {useRouter} from "vue-router";

const $router = useRouter()

const store = usePageTitleStore()
const {title} = storeToRefs(store)

async function onLogoClick() {
  await supabase
    .rpc('increment_achievement', {
        name_param: 'For the statement'
  })
  $router.push({name: 'home'})
}
</script>

<template>
  <v-app>
    <v-container class="margin-bottom-50">
      <v-app-bar>
        <v-row>
          <v-col class="margin-left-10">
            <v-app-bar-nav-icon @click="onLogoClick">
              <v-icon size="40px">mdi-book-open-variant</v-icon>
            </v-app-bar-nav-icon>
          </v-col>
          <v-col class="margin-top-10">
            <v-app-bar-title style="font-weight: bold; font-size: 26px">
              {{ title }}
            </v-app-bar-title>
          </v-col>
          <v-spacer/>
        </v-row>
      </v-app-bar>
    </v-container>
    <RouterView/>
    <NavBar/>
  </v-app>
</template>
