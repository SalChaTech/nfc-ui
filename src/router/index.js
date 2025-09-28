// router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '@/components/LoginPage.vue'
import UploadMemory from '@/views/UploadMemory.vue'

const routes = [
  { path: '/login', name: 'Login', component: LoginPage },
  { path: '/upload-memory', name: UploadMemory, component: UploadMemory},
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
