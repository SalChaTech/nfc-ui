// router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '@/components/LoginPage.vue'
import WeddingMemoriesView from '@/views/WeddingMemoriesView.vue'
import LoginProcess from '@/components/LoginProcess.vue'

const routes = [
  { path: '/login', name: 'Login', component: LoginPage },
  { path: '/upload/:id', name: 'UploadWeddingMemories', component: WeddingMemoriesView },
  { path: '/show/:id', name: 'ShowWeddingMemories', component: WeddingMemoriesView },
  { path: '/auth/callback', component: LoginProcess }, // ← BU ÖNEMLİ

]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
