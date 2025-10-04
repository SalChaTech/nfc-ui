// router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '@/views/LoginPage.vue'
import WeddingMemoriesPage from '@/views/WeddingMemoriesPage.vue'
import LoginProcess from '@/components/login-components/LoginProcess.vue'
import SaveMemoriesSection from '@/components/wedding-memories-components/SaveMemoriesSection.vue'
import axios from 'axios'
import Error404Page from '@/views/Error404Page.vue'

const routes = [
  { path: '/login', name: 'Login', component: LoginPage, meta: { allowDirect: false } },
  { path: '/upload/:id', name: 'UploadWeddingMemories', component: WeddingMemoriesPage },
  { path: '/show/:id', name: 'ShowWeddingMemories', component: WeddingMemoriesPage },
  { path: '/auth/callback', component: LoginProcess }, // ← BU ÖNEMLİ
  { path: '/save', component: SaveMemoriesSection },// ← BU ÖNEMLİ
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: Error404Page } // 404 fallback

]

const router = createRouter({
  history: createWebHistory(),
  routes
})


router.beforeEach(async (to, from) => {

  if (to.path.startsWith('/upload')) {
    const productId = to.params.id
    if (productId) {
      localStorage.setItem('productId', productId)
    }

    const token = localStorage.getItem('jwt')

    if (!token) {
      return { name: 'Login', query: { redirect: to.fullPath } }
    }

    try {
      const response = await axios.post('http://localhost:8080/auth/validate-token', { token })
      if (response.data.valid) {
        return true
      } else {
        localStorage.removeItem('jwt')
        return { name: 'Login', query: { redirect: to.fullPath } }
      }

    } catch (err) {
      localStorage.removeItem('jwt')
      return { name: 'Login', query: { redirect: to.fullPath } }
    }

  }

  if (to.name === 'Login' && !from.name && !to.query.redirect) {
    // Eğer kullanıcı direkt /login yazdıysa ve redirect param yoksa → 404
    return { name: 'NotFound' }
  }

  return true // /upload dışındaki yollar için devam
})

export default router
