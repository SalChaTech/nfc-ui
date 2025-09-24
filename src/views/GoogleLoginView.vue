<template>
  <div class="login-container">
    <div class="login-card">
      <div class="logo-section">
        <div class="google-logo">
          <svg viewBox="0 0 272 92" xmlns="http://www.w3.org/2000/svg">
            <g fill="none" fill-rule="evenodd">
              <path d="M115.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18C71.25 34.32 81.24 25 93.5 25s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44S80.99 39.2 80.99 47.18c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z" fill="#EA4335"/>
              <path d="M163.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18c0-12.85 9.99-22.18 22.25-22.18s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44s-12.51 5.46-12.51 13.44c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z" fill="#FBBC05"/>
              <path d="M209.75 26.34v39.82c0 16.38-9.66 23.07-21.08 23.07-10.75 0-17.22-7.19-19.66-13.07l8.48-3.53c1.51 3.61 5.21 7.87 11.17 7.87 7.31 0 11.84-4.51 11.84-13v-3.19h-.34c-2.18 2.69-6.38 5.04-11.68 5.04-11.09 0-21.25-9.66-21.25-22.09 0-12.52 10.16-22.26 21.25-22.26 5.29 0 9.49 2.35 11.68 4.96h.34v-3.61h9.25zm-8.56 20.92c0-7.81-5.21-13.52-11.84-13.52-6.72 0-12.35 5.71-12.35 13.52 0 7.73 5.63 13.36 12.35 13.36 6.63 0 11.84-5.63 11.84-13.36z" fill="#34A853"/>
              <path d="M225 3v65h-9.5V3h9.5z" fill="#EA4335"/>
              <path d="M262.02 54.48l7.56 5.04c-2.44 3.61-8.32 9.83-18.48 9.83-12.6 0-22.01-9.74-22.01-22.18 0-13.19 9.49-22.18 20.92-22.18 11.51 0 17.14 9.16 18.98 14.11l1.01 2.52-29.65 12.28c2.27 4.45 5.8 6.72 10.75 6.72 4.96 0 8.4-2.44 10.92-6.14zm-23.27-7.98l19.82-8.23c-1.09-2.77-4.37-4.7-8.23-4.7-4.95 0-11.84 4.37-11.59 12.93z" fill="#FBBC05"/>
              <path d="M35.29 41.41V32H67c.31 1.64.47 3.58.47 5.68 0 7.06-1.93 15.79-8.15 22.01-6.05 6.3-13.78 9.66-24.02 9.66C16.32 69.35.36 53.89.36 34.91.36 15.93 16.32.47 35.3.47c10.5 0 17.98 4.12 23.6 9.49l-6.64 6.64c-4.03-3.78-9.49-6.72-16.97-6.72-13.86 0-24.7 11.17-24.7 25.03 0 13.86 10.84 25.03 24.7 25.03 8.99 0 14.11-3.61 17.39-6.89 2.66-2.66 4.41-6.46 5.1-11.65l-22.49.01z" fill="#4285F4"/>
            </g>
          </svg>
        </div>
        <h1>Hesabınızla giriş yapın</h1>
        <p>Devam etmek için Google hesabınızı kullanın</p>
      </div>

      <form @submit.prevent="handleLogin" class="login-form">
        <div class="input-group">
          <input
            v-model="email"
            type="email"
            placeholder="E-posta veya telefon"
            class="form-input"
            required
          >
        </div>

        <div class="forgot-email">
          <a href="#" @click.prevent="showForgotEmail">E-postanızı mı unuttunuz?</a>
        </div>

        <div class="guest-mode">
          <p>Kendi bilgisayarınız değil mi? Gizli tarama özelligini kullanın.</p>
          <a href="#" @click.prevent="learnMore">Daha fazla bilgi</a>
        </div>

        <div class="form-actions">
          <button type="button" @click="createAccount" class="btn-secondary">
            Hesap oluşturun
          </button>
          <button type="submit" class="btn-primary" :disabled="!email">
            İleri
          </button>
        </div>
      </form>
    </div>

    <div class="footer">
      <div class="language-selector">
        <select v-model="selectedLanguage" @change="changeLanguage">
          <option value="tr">Türkçe</option>
          <option value="en">English</option>
          <option value="de">Deutsch</option>
          <option value="fr">Français</option>
        </select>
      </div>

      <div class="footer-links">
        <a href="#">Yardım</a>
        <a href="#">Gizlilik</a>
        <a href="#">Şartlar</a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const email = ref('')
const selectedLanguage = ref('tr')

const handleLogin = () => {
  if (email.value) {
    console.log('Giriş yapılıyor:', email.value)
    // Burada gerçek Google OAuth entegrasyonu yapılacak
  }
}

const createAccount = () => {
  console.log('Hesap oluşturma sayfasına yönlendiriliyor')
  // Hesap oluşturma sayfasına yönlendirme
}

const showForgotEmail = () => {
  console.log('E-posta kurtarma sayfası')
  // E-posta kurtarma işlevi
}

const learnMore = () => {
  console.log('Gizli tarama hakkında daha fazla bilgi')
  // Bilgi modalı veya sayfa
}

const changeLanguage = () => {
  console.log('Dil değiştirildi:', selectedLanguage.value)
  // Dil değiştirme işlevi
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  min-height: 100dvh; /* Modern viewport units */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #f8f9fa;
  padding: 16px;
  box-sizing: border-box;
  position: relative;
}

.login-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: clamp(40px, 8vw, 60px) clamp(40px, 8vw, 60px) clamp(36px, 6vw, 50px);
  width: calc(100vw - 40px);
  max-width: 800px;
  min-width: 400px;
  text-align: center;
  box-sizing: border-box;
  margin: auto;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.logo-section {
  margin-bottom: clamp(16px, 3vw, 24px);
}

.google-logo {
  width: clamp(60px, 15vw, 90px);
  height: auto;
  margin: 0 auto clamp(12px, 2vw, 16px) auto;
  display: block;
}

.google-logo svg {
  width: 100%;
  height: auto;
  max-width: 90px;
}

.logo-section h1 {
  font-size: clamp(20px, 4vw, 24px);
  font-weight: 400;
  color: #202124;
  margin: 0 0 clamp(6px, 1vw, 8px) 0;
  font-family: 'Google Sans', Roboto, Arial, sans-serif;
  line-height: 1.3;
}

.logo-section p {
  font-size: clamp(14px, 3vw, 16px);
  color: #5f6368;
  margin: 0;
  font-family: Roboto, Arial, sans-serif;
  line-height: 1.4;
}

.login-form {
  text-align: left;
}

.input-group {
  margin-bottom: clamp(16px, 3vw, 24px);
}

.form-input {
  width: 100%;
  height: clamp(48px, 10vw, 56px);
  padding: clamp(10px, 2vw, 13px) clamp(12px, 2vw, 15px);
  border: 1px solid #dadce0;
  border-radius: 4px;
  font-size: clamp(14px, 3vw, 16px);
  font-family: Roboto, Arial, sans-serif;
  transition: border-color 0.2s;
  box-sizing: border-box;
  -webkit-appearance: none; /* iOS styling reset */
  appearance: none;
}

.form-input:focus {
  outline: none;
  border-color: #1a73e8;
  border-width: 2px;
}

.form-input::placeholder {
  color: #5f6368;
}

.forgot-email {
  margin-bottom: clamp(16px, 3vw, 24px);
}

.forgot-email a {
  color: #1a73e8;
  text-decoration: none;
  font-size: clamp(12px, 3vw, 14px);
  font-weight: 500;
  display: inline-block;
  padding: 4px 0;
  min-height: 44px; /* Touch target */
  line-height: 1.3;
}

.forgot-email a:hover {
  text-decoration: underline;
}

.guest-mode {
  margin-bottom: clamp(32px, 6vw, 60px);
  font-size: clamp(12px, 3vw, 14px);
  color: #5f6368;
  line-height: 1.5;
}

.guest-mode a {
  color: #1a73e8;
  text-decoration: none;
  font-weight: 500;
  display: inline-block;
  padding: 2px 0;
  min-height: 40px;
  line-height: 1.4;
}

.guest-mode a:hover {
  text-decoration: underline;
}

.form-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: clamp(8px, 2vw, 12px);
}

.btn-secondary,
.btn-primary {
  border-radius: 4px;
  font-size: clamp(12px, 3vw, 14px);
  font-weight: 500;
  cursor: pointer;
  font-family: 'Google Sans', Roboto, Arial, sans-serif;
  transition: all 0.2s;
  min-height: 44px; /* Touch target */
  padding: clamp(8px, 2vw, 9px) clamp(16px, 4vw, 23px);
  box-sizing: border-box;
  border: 1px solid;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.btn-secondary {
  background: transparent;
  border-color: #dadce0;
  color: #1a73e8;
}

.btn-secondary:hover {
  background: #f8f9fa;
  border-color: #c8c8c8;
}

.btn-primary {
  background: #1a73e8;
  border-color: #1a73e8;
  color: white;
  min-width: clamp(70px, 15vw, 80px);
}

.btn-primary:hover:not(:disabled) {
  background: #1557b0;
  border-color: #1557b0;
}

.btn-primary:disabled {
  background: #f8f9fa;
  border-color: #f8f9fa;
  color: #5f6368;
  cursor: not-allowed;
}

.footer {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 450px;
  flex-wrap: wrap;
  gap: clamp(8px, 2vw, 12px);
  padding: 0 16px;
  box-sizing: border-box;
}

.language-selector select {
  border: 1px solid #dadce0;
  border-radius: 4px;
  padding: clamp(6px, 1vw, 8px) clamp(8px, 2vw, 12px);
  font-size: clamp(12px, 3vw, 14px);
  color: #5f6368;
  background: white;
  cursor: pointer;
  min-height: 40px;
  box-sizing: border-box;
}

.footer-links {
  display: flex;
  gap: clamp(12px, 3vw, 24px);
  flex-wrap: wrap;
}

.footer-links a {
  color: #5f6368;
  text-decoration: none;
  font-size: clamp(12px, 3vw, 14px);
  padding: 4px 0;
  min-height: 40px;
  display: flex;
  align-items: center;
}

.footer-links a:hover {
  color: #202124;
}

/* Mobile First Responsive Design */
@media (max-width: 479px) {
  .login-container {
    padding: 12px;
  }

  .login-card {
    border-radius: 0;
    box-shadow: none;
    background: white;
    margin: 0;
  }

  .form-actions {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }

  .btn-secondary,
  .btn-primary {
    width: 100%;
    min-height: 48px;
  }

  .footer {
    flex-direction: column;
    text-align: center;
    gap: 16px;
  }

  .footer-links {
    justify-content: center;
    flex-wrap: wrap;
  }
}

/* Very small screens */
@media (max-width: 359px) {
  .login-container {
    padding: 8px;
  }

  .login-card {
    padding: 20px 16px;
  }

  .footer-links {
    flex-direction: column;
    gap: 8px;
    align-items: center;
  }

  .guest-mode {
    margin-bottom: 24px;
  }
}

/* Tablet Portrait */
@media (min-width: 480px) and (max-width: 768px) {
  .login-card {
    max-width: 420px;
  }
}

/* Desktop and larger tablets */
@media (min-width: 769px) {
  .login-container {
    padding: 24px;
  }

  .login-card {
    padding: 48px 40px 36px;
  }
}

/* Large screens */
@media (min-width: 1200px) {
  .login-card {
    max-width: 450px;
  }
}

/* Touch device optimizations */
@media (hover: none) and (pointer: coarse) {
  .btn-secondary,
  .btn-primary,
  .forgot-email a,
  .guest-mode a,
  .footer-links a {
    min-height: 44px;
  }

  .form-input {
    min-height: 48px;
  }
}

/* Landscape phones */
@media (max-height: 500px) and (orientation: landscape) {
  .login-container {
    padding: 8px;
    justify-content: flex-start;
  }

  .login-card {
    margin: 8px 0;
    padding: 16px 24px;
  }

  .logo-section {
    margin-bottom: 12px;
  }

  .guest-mode {
    margin-bottom: 16px;
  }

  .footer {
    margin-top: 16px;
  }
}

/* High DPI screens */
@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
  .login-card {
    box-shadow: 0 1px 5px rgba(0, 0, 0, 0.1);
  }
}

/* Reduced motion preference */
@media (prefers-reduced-motion: reduce) {
  .form-input,
  .btn-secondary,
  .btn-primary {
    transition: none;
  }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .login-container {
    background-color: #1a1a1a;
  }

  .login-card {
    background: #2d2d2d;
    color: #e8eaed;
  }

  .logo-section h1 {
    color: #e8eaed;
  }

  .logo-section p {
    color: #9aa0a6;
  }

  .form-input {
    background: #2d2d2d;
    border-color: #5f6368;
    color: #e8eaed;
  }

  .form-input::placeholder {
    color: #9aa0a6;
  }

  .form-input:focus {
    border-color: #8ab4f8;
  }

  .btn-secondary {
    border-color: #5f6368;
    color: #8ab4f8;
  }

  .btn-secondary:hover {
    background: #3c4043;
    border-color: #9aa0a6;
  }

  .language-selector select {
    background: #2d2d2d;
    border-color: #5f6368;
    color: #e8eaed;
  }

  .footer-links a {
    color: #9aa0a6;
  }

  .footer-links a:hover {
    color: #e8eaed;
  }

  .guest-mode {
    color: #9aa0a6;
  }

  .guest-mode a,
  .forgot-email a {
    color: #8ab4f8;
  }
}
</style>