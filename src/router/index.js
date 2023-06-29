import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import useUserStore from '@/stores/user'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView
        },
        {
            path: '/about',
            name: 'about',
            component: () => import('@/views/AboutView.vue')
        },
        {
            path: '/manage-music',
            name: 'manage',
            component: () => import('@/views/ManageView.vue'),
            meta: {
                requiresAuth: true,
            }
        },
        {
            path: '/manage',
            redirect: { name: 'manage' },
        },
        {
            path: '/song/:id',
            name: 'song',
            component: () => import('@/views/SongView.vue')
        },
        {
            path: '/:catchAll(.*)*',
            redirect: { name: 'home' }
        }
    ]
})

router.beforeEach((to, from, next) => {
    if(!to.meta.requiresAuth) {
        next();
        return;
    }
    const store = useUserStore();

    if(store.userLoggedIn) {
        next();
    } else {
        next({ name: 'home' })
    }
})

export default router
