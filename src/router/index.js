// router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '@/views/LoginPage.vue'
import WeddingMemoriesPage from '@/views/WeddingMemoriesPage.vue'
import LoginProcess from '@/components/loading-components/LoginProcess.vue'
import SaveMemoriesSection from '@/components/wedding-memories-components/SaveMemoriesSection.vue'

const routes = [
  { path: '/login', name: 'Login', component: LoginPage },
  { path: '/upload/:id', name: 'UploadWeddingMemories', component: WeddingMemoriesPage },
  { path: '/show/:id', name: 'ShowWeddingMemories', component: WeddingMemoriesPage },
  { path: '/auth/callback', component: LoginProcess }, // ← BU ÖNEMLİ
  { path: '/save', component: SaveMemoriesSection }, // ← BU ÖNEMLİ

]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
