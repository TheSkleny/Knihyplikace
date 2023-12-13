import {createRouter, createWebHistory} from 'vue-router'
import HomeView from '../views/HomeView.vue'
import WishListView from '../views/WishListView.vue'
import BookDetailView from '../views/BookDetailView.vue'
import AchievementsView from '../views/AchievementsView.vue'
import AddBookView from '@/views/AddBookView.vue'
import BookshelfView from '@/views/BookshelfView.vue'
import GiftsView from '@/views/GiftsView.vue'

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
                title: "Moje knihy",
            }
        },
        {
            path: '/wish-list',
            name: 'wish-list',
            component: WishListView,
            meta: {
                title: "Seznam přání",
            }

        },
        {
            path: '/book-detail/:id',
            name: 'book-detail',
            component: BookDetailView,
            meta: {
                title: "Detail knihy",
            }
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
            component: AddBookView,
            meta: {
                title: "Přidat knihu",
            }
        },
        {
            path: '/bookshelf',
            name: 'bookshelf',
            component: BookshelfView,
            meta: {
                title: "Knihovnička",
            }
        },
        {
            path: '/gifts',
            name: 'gifts',
            component: GiftsView,
            meta: {
                title: "Dárky",
            }
        }
    ]
})


router.beforeEach((to, from, next) => {
    changeTitleMiddleware(to?.meta.title ?? null);
    return next();
});


export default router
