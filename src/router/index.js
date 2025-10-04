// router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '@/views/LoginPage.vue'
import WeddingMemoriesPage from '@/views/WeddingMemoriesPage.vue'
import LoginProcess from '@/components/loading-components/LoginProcess.vue'
import SaveMemoriesSection from '@/components/wedding-memories-components/SaveMemoriesSection.vue'
import axios from 'axios'

const routes = [
  { path: '/login', name: 'Login', component: LoginPage },
  { path: '/upload/:id', name: 'UploadWeddingMemories', component: WeddingMemoriesPage },
  { path: '/show/:id', name: 'ShowWeddingMemories', component: WeddingMemoriesPage },
  { path: '/auth/callback', component: LoginProcess }, // ← BU ÖNEMLİ
  { path: '/save', component: SaveMemoriesSection } // ← BU ÖNEMLİ

]

const router = createRouter({
  history: createWebHistory(),
  routes
})


router.beforeEach(async (to) => {
  if (to.path.startsWith('/upload')) {
    const token = localStorage.getItem('jwt')

    if (!token) {
      console.log("token yok")
    }

    try {
      const response = await axios.post('http://localhost:8080/auth/validate-token', { token })
      if (response.data.valid) {
        return true
      } else {
        localStorage.removeItem('jwt')
        return '/login'
      }

    } catch (err) {
      localStorage.removeItem('jwt')
      return '/login'
    }

    return true // token varsa route’a devam
  }

  return true // /upload dışındaki yollar için devam
})

export default router
