<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { API_ENDPOINTS } from '@/config/apiEndpoints.ts'

const router = useRouter()

// URL'den code parametresini al
const getQueryParam = (key) => new URLSearchParams(window.location.search).get(key)

onMounted(async () => {
  const code = getQueryParam('code')
  if (!code) return

  try {
    const api = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL
    })

    const res = await api.get(API_ENDPOINTS.GOOGLE_AUTH.CALLBACK(code), { withCredentials: true });

    if (res.data?.jwt) {
      // JWT ve user bilgilerini kaydet
      localStorage.setItem('jwt', res.data.jwt)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      const productId = localStorage.getItem('productId')
      if (productId != null && productId !== 'undefined' && productId !== '') {
        router.push(`/upload/${productId}`)
      } else {
        router.push('/login')
      }
    }
  } catch (err) {
    console.error('Login callback hatası:', err)
  }
})
</script>

<template>
</template>
