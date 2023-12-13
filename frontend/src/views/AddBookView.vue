<script setup>
import {ref} from 'vue'
import BookForm from '@/components/BookForm.vue'

// empty book
const emptyBookData = ref({
  Id: null,
  Name: null,
  Author: null,
  GenreId: null,
  PublishDate: null,
  Publisher: null,
  Language: null,
  Rating: null,
  Pages: null,
  PagesRead: null,
  Description: null,
  CoverImageLink: null,
})
</script>

<template>
  <BookForm :book-data="emptyBookData" :is-create="true"/>
</template>
