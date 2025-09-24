// router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '@/components/LoginPage.vue'

const routes = [
  { path: '/', name: 'Login', component: LoginPage },
  { path: '/editor', name: 'TemplateEditor', component: () => import('@/views/TemplateEditor.vue') }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
