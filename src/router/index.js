import { createRouter, createWebHistory } from 'vue-router'
import GoogleLoginView from '../views/GoogleLoginView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: GoogleLoginView,
    },
  ],
})

export default router
