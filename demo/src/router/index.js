import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'

const router = createRouter({
    history: createWebHistory('/'),
    routes: [
        { path: '/', component: Home },
        { path: '/adapt', component: () => import('../views/Adapt.vue') },
        { path: '/skill', component: () => import('../views/Skill.vue') },
    ],
})

export default router
