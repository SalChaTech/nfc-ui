<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  status: 'success' | 'error' | null
  msg: string | null
}>()

const emit = defineEmits<{
  (e: 'passwordSubmit', password: string): void
}>()

const password = ref('')
const isChecking = ref(false)

const handleSubmit = () => {
  if (password.value.length === 6) {
    isChecking.value = true

    emit('passwordSubmit', password.value)

    setTimeout(() => {
      isChecking.value = false
    }, 1000)
  }
}

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  const value = target.value.replace(/\D/g, '') // Sadece rakamları al
  if (value.length <= 6) {
    password.value = value
  }
}
</script>

<template>
  <div class="password-check-container">
    <div class="password-check-card">
      <h2 class="title">Şifre Girin</h2>
      <p class="subtitle">Size Gönderilen Şifreyi Giriniz</p>

      <div class="input-container">
        <input
          v-model="password"
          @input="handleInput"
          type="text"
          inputmode="numeric"
          pattern="[0-9]*"
          maxlength="6"
          placeholder="------"
          class="password-input"
          :disabled="isChecking"
        />
      </div>

      <button
        @click="handleSubmit"
        :disabled="password.length !== 6 || isChecking"
        class="confirm-button"
      >
        <span v-if="!isChecking">Onayla</span>
        <span v-else>Kontrol Ediliyor...</span>
      </button>

      <div v-if="props.status" class="alert-container mt-3">
        <v-alert
          :type="props.status"
          variant="outlined"
          transition="fade"
          rounded="lg"
        >
          {{ props.msg }}
        </v-alert>
      </div>

    </div>
  </div>
</template>

<style scoped>
.password-check-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  padding: var(--padding-lg);
}

.password-check-card {
  background: var(--bg-white);
  border-radius: var(--radius-2xl);
  padding: var(--padding-4xl);
  box-shadow: 0 20px 40px var(--shadow-medium);
  text-align: center;
  max-width: var(--container-sm);
  width: 100%;
  backdrop-filter: blur(var(--blur-sm));
}

.title {
  font-size: var(--font-size-4xl);
  font-weight: var(--font-weight-semibold);
  color: var(--color-primary);
  margin-bottom: var(--spacing-sm);
  font-family: var(--font-primary);
}

.subtitle {
  color: var(--color-text-light);
  margin-bottom: var(--spacing-2xl);
  font-size: var(--font-size-base);
  font-family: var(--font-body);
}

.input-container {
  margin-bottom: var(--spacing-2xl);
}

.password-input {
  width: 100%;
  padding: var(--padding-lg);
  font-size: var(--font-size-2xl);
  text-align: center;
  border: 2px solid var(--color-text-light);
  border-radius: var(--radius-lg);
  outline: none;
  transition: all var(--transition-normal) var(--ease-in-out);
  letter-spacing: 8px;
  font-family: 'Courier New', monospace;
  background: var(--bg-white-light);
}

.password-input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--shadow-blue);
}

.password-input:disabled {
  background-color: var(--color-text-light);
  cursor: not-allowed;
  opacity: var(--opacity-lg);
}

.confirm-button {
  width: 100%;
  padding: var(--padding-lg);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: white;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border: none;
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all var(--transition-normal) var(--ease-in-out);
  font-family: var(--font-body);
  box-shadow: 0 4px 15px rgba(16, 185, 129, 0.2);
}

.confirm-button:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(16, 185, 129, 0.25);
  filter: brightness(var(--brightness-sm));
}

.confirm-button:disabled {
  background: var(--color-secondary);
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
  opacity: var(--opacity-lg);
}

.confirm-button:active:not(:disabled) {
  transform: translateY(0);
}

/* Responsive adjustments */
@media (max-width: 480px) {
  .password-check-card {
    padding: var(--padding-2xl);
    margin: var(--padding-sm);
  }

  .title {
    font-size: var(--font-size-3xl);
  }

  .password-input {
    font-size: var(--font-size-xl);
    padding: var(--padding-md);
  }
}
</style>
