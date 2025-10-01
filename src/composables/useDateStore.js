import { ref, computed } from 'vue'

// Global tarih store'u
const selectedDate = ref('2024-07-15') // Varsayılan tarih
const currentDate = ref(new Date())

// Tarih hesaplama fonksiyonları
export const useDateStore = () => {
  // Seçilen tarihten bugüne kadar geçen günleri hesapla
  const totalDays = computed(() => {
    if (!selectedDate.value) return 0
    
    const startDate = new Date(selectedDate.value)
    const today = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth(), currentDate.value.getDate())
    const start = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate())
    
    const diffTime = today.getTime() - start.getTime()
    return Math.floor(diffTime / (1000 * 60 * 60 * 24))
  })

  // Yılları hesapla
  const years = computed(() => {
    if (!selectedDate.value) return 0
    
    const startDate = new Date(selectedDate.value)
    const diff = currentDate.value.getFullYear() - startDate.getFullYear()
    const monthDiff = currentDate.value.getMonth() - startDate.getMonth()
    return monthDiff < 0 ? diff - 1 : diff
  })

  // Ayları hesapla
  const months = computed(() => {
    if (!selectedDate.value) return 0
    
    const startDate = new Date(selectedDate.value)
    let monthDiff = currentDate.value.getMonth() - startDate.getMonth()
    if (monthDiff < 0) {
      monthDiff += 12
    }
    return monthDiff
  })

  // Tarihi güncelle
  const updateDate = (newDate) => {
    selectedDate.value = newDate
  }

  // Güncel tarihi güncelle
  const updateCurrentDate = () => {
    currentDate.value = new Date()
  }

  return {
    selectedDate,
    currentDate,
    totalDays,
    years,
    months,
    updateDate,
    updateCurrentDate
  }
}
