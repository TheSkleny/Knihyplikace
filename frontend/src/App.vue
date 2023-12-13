<script setup>
import {RouterView} from 'vue-router'
import NavBar from "@/components/NavBar.vue";
import {usePageTitleStore} from "@/stores/pageTitle";
import {storeToRefs} from "pinia";

const store = usePageTitleStore()
const {title} = storeToRefs(store)
</script>

<template>
  <v-app>
    <v-container style="margin-bottom: 50px">
      <v-app-bar>
        <v-row>
          <v-col style="margin-left: 10px">
            <v-app-bar-nav-icon @click="$router.push({ name: 'home' })">
              <v-icon size="40px">mdi-book-open-variant</v-icon>
            </v-app-bar-nav-icon>
          </v-col>
          <v-col style="margin-top: 10px">
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
