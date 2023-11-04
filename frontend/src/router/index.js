import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import WishListView from '../views/WishListView.vue'
import BookDetailView from '../views/BookDetailView.vue'
import AchievementsView from '../views/AchievementsView.vue'
import AddBook from "@/views/AddBookView.vue";
import AddBookView from "@/views/AddBookView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/wish-list',
      name: 'wish-list',
      component: WishListView
    },
    {
      path: '/book-detail/:id',
      name: 'book-detail',
      component: BookDetailView
    },
    {
      path: '/achievements',
      name: 'achievements',
      component: AchievementsView
    },
    {
      path: '/add-book',
      name: 'add-book',
      component: AddBookView
    }
  ]
})

export default router
