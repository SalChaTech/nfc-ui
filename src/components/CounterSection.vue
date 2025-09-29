<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

// Sayaç için başlangıç tarihi (örnek: 15 Temmuz 2020)
const startDate = new Date('2020-07-15')
const currentDate = ref(new Date())

// Sayaç değerlerini hesapla
const years = computed(() => {
  const diff = currentDate.value.getFullYear() - startDate.getFullYear()
  const monthDiff = currentDate.value.getMonth() - startDate.getMonth()
  return monthDiff < 0 ? diff - 1 : diff
})

const months = computed(() => {
  let monthDiff = currentDate.value.getMonth() - startDate.getMonth()
  if (monthDiff < 0) {
    monthDiff += 12
  }
  return monthDiff
})

const days = computed(() => {
  const today = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth(), currentDate.value.getDate())
  const start = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate())
  const diffTime = today.getTime() - start.getTime()
  return Math.floor(diffTime / (1000 * 60 * 60 * 24))
})

const totalDays = computed(() => {
  const today = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth(), currentDate.value.getDate())
  const start = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate())
  const diffTime = today.getTime() - start.getTime()
  return Math.floor(diffTime / (1000 * 60 * 60 * 24))
})

// Her gün güncelle
let intervalId: number | null = null

onMounted(() => {
  // Her gün saat 00:00'da güncelle
  intervalId = setInterval(() => {
    currentDate.value = new Date()
  }, 24 * 60 * 60 * 1000) // 24 saat
})

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId)
  }
})
</script>

<template>
  <div class="counter-section">
    <div class="counter-title">
      <h2>Birlikte Geçen</h2>
      <div class="days-counter">
        <div class="counter-digit">{{ totalDays.toString().padStart(4, '0').split('')[0] }}</div>
        <div class="counter-digit">{{ totalDays.toString().padStart(4, '0').split('')[1] }}</div>
        <div class="counter-digit">{{ totalDays.toString().padStart(4, '0').split('')[2] }}</div>
        <div class="counter-digit">{{ totalDays.toString().padStart(4, '0').split('')[3] }}</div>
      </div>
      <h3>Gün</h3>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap');

/* Sayaç bölümü */
.counter-section {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  padding: 60px 40px;
  margin: 0;
  text-align: center;
  max-width: 900px;
  margin: 0 auto;
}

.counter-title h2 {
  font-family: 'Dancing Script', cursive;
  font-size: 2.5rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 20px 0;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.1);
}

.days-counter {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin: 20px 0;
}

.counter-digit {
  background: linear-gradient(135deg, #e74c3c, #c0392b);
  color: white;
  font-family: 'Playfair Display', serif;
  font-size: 3rem;
  font-weight: 700;
  width: 60px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px 8px 12px 12px;
  box-shadow: 0 8px 25px rgba(231, 76, 60, 0.3);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  clip-path: polygon(0 0, 100% 0, 100% 85%, 85% 100%, 0 100%);
}

.counter-digit::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.05));
  border-radius: 8px 8px 12px 12px;
  clip-path: polygon(0 0, 100% 0, 100% 85%, 85% 100%, 0 100%);
}

.counter-digit::after {
  content: '';
  position: absolute;
  top: 8px;
  left: 50%;
  transform: translateX(-50%);
  width: 8px;
  height: 8px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.1);
}

.counter-digit:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 35px rgba(231, 76, 60, 0.4);
}

.counter-title h3 {
  font-family: 'Playfair Display', serif;
  font-size: 1.5rem;
  font-weight: 500;
  color: #6c757d;
  margin: 0;
  font-style: italic;
}

/* Responsive tasarım */
@media (max-width: 768px) {
  .counter-section {
    padding: 40px 20px;
  }

  .counter-title h2 {
    font-size: 2.2rem;
  }

  .counter-digit {
    width: 50px;
    height: 65px;
    font-size: 2.5rem;
    border-radius: 6px 6px 10px 10px;
    clip-path: polygon(0 0, 100% 0, 100% 85%, 85% 100%, 0 100%);
  }

  .counter-digit::before {
    border-radius: 6px 6px 10px 10px;
    clip-path: polygon(0 0, 100% 0, 100% 85%, 85% 100%, 0 100%);
  }

  .counter-digit::after {
    top: 6px;
    width: 6px;
    height: 6px;
  }

  .counter-title h3 {
    font-size: 1.3rem;
  }
}

@media (max-width: 480px) {
  .counter-section {
    padding: 30px 15px;
  }

  .counter-title h2 {
    font-size: 1.8rem;
  }

  .counter-digit {
    width: 45px;
    height: 60px;
    font-size: 2rem;
    border-radius: 5px 5px 8px 8px;
    clip-path: polygon(0 0, 100% 0, 100% 85%, 85% 100%, 0 100%);
  }

  .counter-digit::before {
    border-radius: 5px 5px 8px 8px;
    clip-path: polygon(0 0, 100% 0, 100% 85%, 85% 100%, 0 100%);
  }

  .counter-digit::after {
    top: 5px;
    width: 5px;
    height: 5px;
  }

  .counter-title h3 {
    font-size: 1.1rem;
  }
}
</style>
