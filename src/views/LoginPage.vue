<template>
  <div class="login-page">
    <!-- Animasyonlu arka plan elementleri -->
    <div class="background-elements">
      <div
        v-for="(shape, index) in floatingShapes"
        :key="index"
        :class="['floating-shape', `shape${index + 1}`]"
      ></div>
    </div>

    <!-- Light Beams -->
    <div class="light-beams">
      <div
        v-for="(beam, index) in lightBeams"
        :key="index"
        :class="['light-beam', `beam${index + 1}`]"
      ></div>
    </div>

    <!-- Ana giriş konteyneri -->
    <div class="login-container">
      <div class="logo-section">
        <div class="logo" @click="logoAnimation">
          <transition name="bounce" mode="out-in">
            <span :key="logoIcon">{{ logoIcon }}</span>
          </transition>
        </div>
        <h1 class="app-title">{{ appTitle }}</h1>
        <p class="app-subtitle">{{ appSubtitle }}</p>
      </div>

      <!-- Google Giriş Butonu -->
      <button
        class="google-signin-btn"
        :class="{ loading: isLoading }"
        @click="loginWithGoogle"
        :disabled="isLoading"
      >
        <div class="google-icon"></div>
        <span v-if="!isLoading">Google ile Giriş Yap</span>
        <span v-else>Giriş Yapılıyor...</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { API_ENDPOINTS } from '@/config/apiEndpoints.js'

const router = useRouter()
const user = ref(null)
const isLoading = ref(false)
const logoIcon = ref('✨')

// App bilgileri
const appTitle = ref('Hoş Geldiniz')
const appSubtitle = ref('Hesabınıza giriş yapın')

// Floating shapes & light beams
const floatingShapes = reactive(Array(4).fill({}))
const lightBeams = reactive(Array(6).fill({}))

// Logo animasyonu
const logoIcons = ['✨', '🚀', '💫', '⚡', '🎯']
let iconIndex = 0
const logoAnimation = () => {
  iconIndex = (iconIndex + 1) % logoIcons.length
  logoIcon.value = logoIcons[iconIndex]
}

// Backend-mediated Google login
const loginWithGoogle = () => {
  isLoading.value = true
  console.log('Google login',import.meta.env.VITE_API_BASE_URL)
  window.location.href = `${import.meta.env.VITE_API_BASE_URL}${API_ENDPOINTS.GOOGLE_AUTH.GOOGLE}`;

}

// Kullanıcıyı kontrol et, login olmuşsa upload sayfasına yönlendir
const checkUser = async () => {
  try {
    const api = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL
    })

    const res = await api.get(API_ENDPOINTS.GOOGLE_AUTH.ME, { withCredentials: true })
    if (res.data) {
      user.value = res.data
      router.push('/upload')
    }
  } catch (err) {
    console.log('Kullanıcı login değil veya JWT yok', err)
  }
}

// Klavye navigasyonu
const handleKeydown = (e) => {
  if (e.key === 'Enter' && !isLoading.value) {
    loginWithGoogle()
  }
}

// Lifecycle
onMounted(() => {
  checkUser()
  document.addEventListener('keydown', handleKeydown)
  document.body.style.overflow = 'hidden'
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
  document.body.style.overflow = 'auto'
})
</script>


<style scoped>
.login-page {
  min-height: 100vh;
  width: 100vw;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%),
  url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80') center/cover no-repeat;
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 0;
  left: 0;
  overflow: hidden;
}

/* Animasyonlu arka plan elementleri */
.background-elements {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 1;
}

.floating-shape {
  position: absolute;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  animation: float 6s ease-in-out infinite;
}

.shape1 {
  width: 80px;
  height: 80px;
  top: 10%;
  left: 10%;
  animation-delay: 0s;
}

.shape2 {
  width: 120px;
  height: 120px;
  top: 20%;
  right: 15%;
  animation-delay: 2s;
}

.shape3 {
  width: 60px;
  height: 60px;
  bottom: 20%;
  left: 20%;
  animation-delay: 4s;
}

.shape4 {
  width: 100px;
  height: 100px;
  bottom: 10%;
  right: 10%;
  animation-delay: 1s;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
    opacity: 0.7;
  }
  50% {
    transform: translateY(-20px) rotate(180deg);
    opacity: 1;
  }
}

/* Light Beams */
.light-beams {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 1.5;
  pointer-events: none;
}

.light-beam {
  position: absolute;
  background: linear-gradient(45deg,
  transparent 0%,
  rgba(255, 255, 255, 0.1) 20%,
  rgba(255, 255, 255, 0.3) 40%,
  rgba(255, 255, 255, 0.4) 50%,
  rgba(255, 255, 255, 0.3) 60%,
  rgba(255, 255, 255, 0.1) 80%,
  transparent 100%);
  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(2px);
  animation: lightBeamMove 12s linear infinite;
  border-radius: 50px;
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.2),
  0 0 40px rgba(255, 255, 255, 0.1);
  opacity: 0.8;
  transform-origin: center;
}

.beam1 {
  width: 300px;
  height: 8px;
  top: 10%;
  left: -100px;
  transform: rotate(25deg);
  animation-delay: 0s;
  animation-duration: 15s;
}

.beam2 {
  width: 400px;
  height: 12px;
  top: 30%;
  right: -150px;
  transform: rotate(-20deg);
  animation-delay: 3s;
  animation-duration: 18s;
}

.beam3 {
  width: 250px;
  height: 6px;
  top: 60%;
  left: -80px;
  transform: rotate(35deg);
  animation-delay: 6s;
  animation-duration: 12s;
}

.beam4 {
  width: 350px;
  height: 10px;
  bottom: 20%;
  right: -120px;
  transform: rotate(-30deg);
  animation-delay: 9s;
  animation-duration: 16s;
}

.beam5 {
  width: 200px;
  height: 5px;
  top: 80%;
  left: -60px;
  transform: rotate(45deg);
  animation-delay: 12s;
  animation-duration: 14s;
}

.beam6 {
  width: 450px;
  height: 14px;
  top: 50%;
  right: -200px;
  transform: rotate(-15deg);
  animation-delay: 15s;
  animation-duration: 20s;
}

@keyframes lightBeamMove {
  0% {
    transform: translateX(-100vw);
    opacity: 0;
  }
  10% {
    opacity: 0.8;
  }
  90% {
    opacity: 0.8;
  }
  100% {
    transform: translateX(100vw);
    opacity: 0;
  }
}

/* Ana konteyner - Apple Liquid Glass Effect */
.login-container {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(40px) saturate(200%);
  -webkit-backdrop-filter: blur(40px) saturate(200%);
  border-radius: 32px;
  padding: 48px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1),
  0 32px 64px rgba(0, 0, 0, 0.05),
  inset 0 1px 0 rgba(255, 255, 255, 0.4),
  inset 0 -1px 0 rgba(255, 255, 255, 0.1);
  width: 100%;
  max-width: 420px;
  position: relative;
  z-index: 2;
  border: 1px solid rgba(255, 255, 255, 0.3);
  animation: slideUp 0.6s ease-out;
  overflow: hidden;
}

.login-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg,
  rgba(255, 255, 255, 0.25) 0%,
  rgba(255, 255, 255, 0.1) 25%,
  rgba(255, 255, 255, 0.05) 50%,
  rgba(255, 255, 255, 0.1) 75%,
  rgba(255, 255, 255, 0.15) 100%);
  border-radius: 32px;
  pointer-events: none;
  z-index: -1;
}

.login-container::after {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: linear-gradient(135deg,
  rgba(255, 255, 255, 0.6),
  rgba(255, 255, 255, 0.2),
  rgba(255, 255, 255, 0.1),
  rgba(255, 255, 255, 0.3));
  border-radius: 34px;
  z-index: -2;
  filter: blur(1px);
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Logo/Başlık alanı */
.logo-section {
  text-align: center;
  margin-bottom: 40px;
}

.logo {
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, #4285f4, #34a853, #fbbc05, #ea4335);
  border-radius: 16px;
  margin: 0 auto 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  font-weight: bold;
  color: white;
  box-shadow: 0 8px 25px rgba(66, 133, 244, 0.3);
  cursor: pointer;
  transition: transform 0.3s ease;
  user-select: none;
}

.logo:hover {
  transform: scale(1.05);
}

.logo:active {
  transform: scale(0.95);
}

.app-title {
  font-size: 28px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 8px;
}

.app-subtitle {
  font-size: 16px;
  color: #666;
  font-weight: 400;
}

/* Google giriş butonu - Liquid Glass Effect */
.google-signin-btn {
  width: 100%;
  padding: 16px 24px;
  border: none;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  color: #1f1f1f;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08),
  0 1px 4px rgba(0, 0, 0, 0.04),
  inset 0 1px 0 rgba(255, 255, 255, 0.6),
  inset 0 -1px 0 rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.4);
  position: relative;
  overflow: hidden;
}

.google-signin-btn:hover:not(:disabled) {
  transform: translateY(-2px) scale(1.02);
  background: rgba(255, 255, 255, 0.3);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12),
  0 2px 8px rgba(0, 0, 0, 0.06),
  inset 0 1px 0 rgba(255, 255, 255, 0.8),
  inset 0 -1px 0 rgba(255, 255, 255, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.6);
}

.google-signin-btn:active:not(:disabled) {
  transform: translateY(0);
}

.google-signin-btn:disabled {
  cursor: not-allowed;
  opacity: 0.8;
}

.google-icon {
  width: 20px;
  height: 20px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 488 512'%3E%3Cpath fill='%234285f4' d='M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h240z'/%3E%3C/svg%3E");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}

/* Loading state */
.google-signin-btn.loading::after {
  content: '';
  position: absolute;
  width: 20px;
  height: 20px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid #4285f4;
  border-radius: 50%;
  right: 20px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}


/* Logo animasyonu */
.bounce-enter-active, .bounce-leave-active {
  transition: all 0.3s ease;
}

.bounce-enter-from {
  opacity: 0;
  transform: scale(0.5) rotate(-180deg);
}

.bounce-leave-to {
  opacity: 0;
  transform: scale(1.5) rotate(180deg);
}

/* Responsive tasarım */
@media (max-width: 480px) {
  .login-container {
    margin: 20px;
    padding: 32px 24px;
    border-radius: 20px;
  }

  .app-title {
    font-size: 24px;
  }

  .google-signin-btn {
    padding: 14px 20px;
    font-size: 15px;
  }

  .floating-shape,
  .light-beam {
    display: none;
  }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .login-container {
    background: rgba(0, 0, 0, 0.15);
    backdrop-filter: blur(40px) saturate(200%);
    -webkit-backdrop-filter: blur(40px) saturate(200%);
    color: #fff;
    border: 1px solid rgba(255, 255, 255, 0.2);
  }

  .login-container::before {
    background: linear-gradient(135deg,
    rgba(255, 255, 255, 0.1) 0%,
    rgba(255, 255, 255, 0.05) 25%,
    rgba(255, 255, 255, 0.02) 50%,
    rgba(255, 255, 255, 0.05) 75%,
    rgba(255, 255, 255, 0.08) 100%);
  }

  .google-signin-btn {
    background: rgba(255, 255, 255, 0.1);
    color: #fff;
    border: 1px solid rgba(255, 255, 255, 0.3);
  }

  .google-signin-btn:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.4);
  }

  .app-title {
    color: #fff;
  }

  .app-subtitle {
    color: #ccc;
  }

  .light-beam {
    background: linear-gradient(45deg,
    transparent 0%,
    rgba(255, 255, 255, 0.05) 20%,
    rgba(255, 255, 255, 0.15) 40%,
    rgba(255, 255, 255, 0.2) 50%,
    rgba(255, 255, 255, 0.15) 60%,
    rgba(255, 255, 255, 0.05) 80%,
    transparent 100%);
    box-shadow: 0 0 15px rgba(255, 255, 255, 0.1),
    0 0 30px rgba(255, 255, 255, 0.05);
  }
}
</style>
