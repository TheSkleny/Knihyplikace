import {createRouter, createWebHistory} from 'vue-router'
import HomeView from '../views/HomeView.vue'
import WishListView from '../views/WishListView.vue'
import BookDetailView from '../views/BookDetailView.vue'
import AchievementsView from '../views/AchievementsView.vue'
import AddBookView from '@/views/AddBookView.vue'

import changeTitleMiddleware from "@/middleware/changeTitle";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    mode: 'history',
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView,
            meta: {
                title: "Doma pička",
            }
        },
        {
            path: '/wish-list',
            name: 'wish-list',
            component: WishListView,
            meta: {
                title: "wiš list",
            }

        },
        {
            path: '/book-detail/:id',
            name: 'book-detail',
            component: BookDetailView
        },
        {
            path: '/achievements',
            name: 'achievements',
            component: AchievementsView,
            meta: {
                title: "Ocenění",
            }
        },
        {
            path: '/add-book',
            name: 'add-book',
            component: AddBookView
        }
    ]
})


router.beforeEach((to, from, next) => {
    changeTitleMiddleware(to?.meta.title ?? null);
    return next();
});


export default router
