// router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '@/views/LoginPage.vue'
import WeddingMemoriesPage from '@/views/WeddingMemoriesPage.vue'
import LoginProcess from '@/components/login-components/LoginProcess.vue'
import SaveMemoriesSection from '@/components/wedding-memories-components/SaveMemoriesSection.vue'
import axios from 'axios'
import Error404Page from '@/views/Error404Page.vue'
import { API_ENDPOINTS } from '../config/apiEndpoints.ts'
import AdminLogin from '@/views/admin/AdminLogin.vue'
import AdminUserControlPanel from '@/views/admin/AdminUserControlPanel.vue'
import AdminProductControlPanel from '@/views/admin/AdminProductControlPanel.vue'
import AdminDashboard from '@/views/admin/AdminDashboard.vue'
import TripMemoriesPage from '@/views/TripMemoriesPage.vue'


const routes = [
  { path: '/login', name: 'Login', component: LoginPage, meta: { allowDirect: false } },
  { path: '/admin/login', name: 'AdminLogin', component: AdminLogin },
  { path: '/admin/dashboard', name: 'AdminLogin', component: AdminDashboard },
  { path: '/admin/user-control', name: 'AdminDashboard', component: AdminUserControlPanel },
  { path: '/admin/product-control', name: 'AdminDashboard', component: AdminProductControlPanel },
  { path: '/upload/:id', name: 'UploadWeddingMemories', component: WeddingMemoriesPage },
  { path: '/trip/upload/:id', name: 'UploadTripMemories', component: TripMemoriesPage },
  { path: '/show/:id', name: 'ShowWeddingMemories', component: WeddingMemoriesPage },
  { path: '/auth/callback', component: LoginProcess }, // ← BU ÖNEMLİ
  { path: '/save', component: SaveMemoriesSection },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: Error404Page }

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
      const api = axios.create({
        baseURL: import.meta.env.VITE_API_BASE_URL
      })

      const response = await api.post(API_ENDPOINTS.GOOGLE_AUTH.VALIDATE_TOKEN, { token })
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
    console.log('Login page')
    // Eğer kullanıcı direkt /login yazdıysa ve redirect param yoksa → 404
    return { name: 'NotFound' }
  }

  return true // /upload dışındaki yollar için devam
})

export default router
