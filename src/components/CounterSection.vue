<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useDateStore } from '../composables/useDateStore.js'

// Tarih store'unu kullan
const { selectedDate, currentDate, totalDays, updateCurrentDate } = useDateStore()

// Animasyon için state'ler
const displayDigits = ref(['0', '0', '0', '0'])
const isAnimating = ref(false)
const animationTriggered = ref(false)

// Editable title
const title = ref('Birlikte Geçen Gün')
const isEditingTitle = ref(false)
const titleRef = ref(null)

// Başlangıç değerini 1 eksik olarak ayarla
function initializeDisplayDigits() {
  const currentDays = totalDays.value
  const oneLess = Math.max(0, currentDays - 1)
  displayDigits.value = oneLess.toString().padStart(4, '0').split('')
}

// Store'dan gelen değerleri kullan (artık hesaplama gerekmiyor)

// Her gün güncelle
let intervalId: NodeJS.Timeout | null = null

// Sayfa görünürlüğünü kontrol et
const isVisible = ref(false)

// Intersection Observer ile sayfa görünürlüğünü takip et
onMounted(() => {
  // Başlangıç değerlerini ayarla
  initializeDisplayDigits()

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animationTriggered.value) {
        isVisible.value = true
        animationTriggered.value = true
        // 1 saniye bekle sonra animasyonu başlat
        setTimeout(() => {
          startCalendarAnimation()
        }, 1000)
      }
    })
  }, { threshold: 0.3 })

  const counterElement = document.querySelector('.counter-section')
  if (counterElement) {
    observer.observe(counterElement)
  }

  // Her gün saat 00:00'da güncelle
  intervalId = setInterval(() => {
    updateCurrentDate()
  }, 24 * 60 * 60 * 1000) // 24 saat
})

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId)
  }
})

// Takvim animasyonu
function startCalendarAnimation() {
  if (isAnimating.value) return

  isAnimating.value = true
  const targetDigits = totalDays.value.toString().padStart(4, '0').split('')

  // Her rakam için ayrı ayrı animasyon
  targetDigits.forEach((targetDigit, index) => {
    setTimeout(() => {
      animateDigit(index, targetDigit)
    }, index * 200) // Her rakam 200ms arayla başlar
  })
}

function animateDigit(index: number, targetDigit: string) {
  const currentDigit = displayDigits.value[index]

  // Eğer rakam aynıysa animasyon yapma
  if (currentDigit === targetDigit) {
    if (index === 3) isAnimating.value = false
    return
  }

  // Eski rakamı düşür
  const fallingDigit = document.querySelector(`.counter-digit:nth-child(${index + 1}) .digit-content`)
  if (fallingDigit) {
    fallingDigit.classList.add('falling')
  }

  // Yeni rakamı getir
  setTimeout(() => {
    displayDigits.value[index] = targetDigit
    const newDigit = document.querySelector(`.counter-digit:nth-child(${index + 1}) .digit-content`)
    if (newDigit) {
      newDigit.classList.add('appearing')
    }

    // Animasyon bittiğinde class'ları temizle
    setTimeout(() => {
      if (fallingDigit) fallingDigit.classList.remove('falling')
      if (newDigit) newDigit.classList.remove('appearing')

      // Son rakam animasyonu bittiğinde
      if (index === 3) {
        isAnimating.value = false
      }
    }, 600)
  }, 300)
}

// totalDays değiştiğinde animasyonu tetikle
watch(totalDays, (newValue) => {
  if (isVisible.value && !isAnimating.value) {
    startCalendarAnimation()
  }
})

// Title editing functions
function editTitle() {
  isEditingTitle.value = true
  setTimeout(() => {
    if (titleRef.value) {
      titleRef.value.focus()
      selectAllText(titleRef.value)
    }
  }, 10)
}

function saveTitle() {
  if (titleRef.value) {
    const newTitle = titleRef.value.textContent.trim()
    if (newTitle && newTitle !== title.value) {
      title.value = newTitle
    } else {
      titleRef.value.textContent = title.value
    }
  }
  isEditingTitle.value = false
}

// Helper function to select all text
function selectAllText(element: HTMLElement) {
  if (window.getSelection) {
    const selection = window.getSelection()
    const range = document.createRange()
    range.selectNodeContents(element)
    selection.removeAllRanges()
    selection.addRange(range)
  }
}
</script>

<template>
  <div class="counter-section">
    <div class="counter-title">
      <h2 class="editable" @click="editTitle" @blur="saveTitle" @keydown.enter="saveTitle"
        :contenteditable="isEditingTitle" ref="titleRef">{{ title }}</h2>
      <div class="days-counter">
        <div class="counter-digit">
          <div class="digit-content">{{ displayDigits[0] }}</div>
        </div>
        <div class="counter-digit">
          <div class="digit-content">{{ displayDigits[1] }}</div>
        </div>
        <div class="counter-digit">
          <div class="digit-content">{{ displayDigits[2] }}</div>
        </div>
        <div class="counter-digit">
          <div class="digit-content">{{ displayDigits[3] }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Font import'ları artık theme.css'de */

/* Sayaç bölümü */
.counter-section {
  background: var(--gradient-primary);
  padding: var(--padding-lg) var(--padding-2xl);
  margin: 0;
  text-align: center;
  max-width: var(--container-xl);
  margin: 0 auto;
}

.counter-title h2 {
  font-family: var(--font-primary);
  font-size: 2.5rem;
  font-weight: var(--font-weight-semibold);
  color: var(--color-primary);
  margin: 0 0 20px 0;
  text-shadow: 1px 1px 3px var(--shadow-light);
}

.counter-title h2.editable {
  cursor: pointer;
  transition: var(--transition-normal) var(--ease-in-out);
  border-radius: var(--radius-md);
  padding: var(--padding-xs) var(--padding-sm);
  margin: var(--padding-xs) calc(-1 * var(--padding-sm));
}

.counter-title h2.editable:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: scale(1.02);
}

.counter-title h2.editable:focus {
  outline: none;
  background: rgba(255, 255, 255, 0.15);
  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.3);
}

.days-counter {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: var(--padding-sm);
  margin: var(--padding-lg) 0;
}

.counter-digit {
  background: var(--gradient-red);
  color: white;
  font-family: var(--font-secondary);
  font-size: 3rem;
  font-weight: var(--font-weight-bold);
  width: 60px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-md) var(--radius-md) var(--radius-lg) var(--radius-lg);
  box-shadow: 0 8px 25px var(--shadow-danger);
  transition: var(--transition-normal) var(--ease-in-out);
  position: relative;
  overflow: hidden;
  clip-path: polygon(0 0, 100% 0, 100% 85%, 85% 100%, 0 100%);
}

.digit-content {
  position: relative;
  z-index: 2;
  transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  transform: translateY(12px);
}

/* Takvim yaprağı düşme animasyonu */
.digit-content.falling {
  animation: calendarFall 0.6s cubic-bezier(0.55, 0.085, 0.68, 0.53) forwards;
}

.digit-content.appearing {
  animation: calendarAppear 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
}

@keyframes calendarFall {
  0% {
    transform: translateY(12px) rotateX(0deg);
    opacity: 1;
  }

  50% {
    transform: translateY(28px) rotateX(45deg);
    opacity: 0.8;
  }

  100% {
    transform: translateY(108px) rotateX(90deg);
    opacity: 0;
  }
}

@keyframes calendarAppear {
  0% {
    transform: translateY(-42px) rotateX(-90deg);
    opacity: 0;
  }

  50% {
    transform: translateY(-2px) rotateX(-45deg);
    opacity: 0.8;
  }

  100% {
    transform: translateY(8px) rotateX(0deg);
    opacity: 1;
  }
}

.counter-digit::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.05));
  border-radius: var(--radius-md) var(--radius-md) var(--radius-lg) var(--radius-lg);
  clip-path: polygon(0 0, 100% 0, 100% 85%, 85% 100%, 0 100%);
}

.counter-digit::after {
  content: '';
  position: absolute;
  top: 8px;
  left: 50%;
  transform: translateX(-50%);
  width: var(--padding-sm);
  height: var(--padding-sm);
  background: rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.1);
}

.counter-digit:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 35px var(--shadow-danger);
}

.counter-title h3 {
  font-family: var(--font-secondary);
  font-size: 2rem;
  font-weight: var(--font-weight-medium);
  color: var(--color-primary);
  margin: 0;
  font-style: italic;
}

/* Responsive tasarım */
@media (max-width: 768px) {
  .counter-section {
    padding: var(--padding-md) var(--padding-lg);
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
    width: var(--padding-xs);
    height: var(--padding-xs);
  }

  .counter-title h3 {
    font-size: 1.3rem;
  }
}

@media (max-width: 480px) {
  .counter-section {
    padding: var(--padding-sm) var(--padding-lg);
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
    width: var(--padding-xs);
    height: var(--padding-xs);
  }

  .counter-title h3 {
    font-size: 1.1rem;
  }
}
</style>
