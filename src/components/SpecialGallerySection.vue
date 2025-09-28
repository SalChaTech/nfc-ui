<template>
  <div class="gallery-container mt-4">
    <!-- Fotoğraf galerisi -->
    <div class="elegant-collage">
      <!-- Ana büyük fotoğraf (sol taraf) -->
      <div class="main-photo" @click="itemClickHandler(photos[0], 0)">
        <img :src="photos[0].source" alt="Ana düğün fotoğrafı" />
        <div class="photo-border"></div>
      </div>

    <!-- Sağ taraf fotoğrafları -->
    <div class="right-photos">
      <!-- Üst sağ fotoğraf -->
      <div class="top-photo" @click="itemClickHandler(photos[1], 1)">
        <img :src="photos[1].source" alt="Düğün anı" />
        <div class="photo-border"></div>
      </div>

      <!-- Alt sağ fotoğraf -->
      <div class="bottom-photo" @click="itemClickHandler(photos[2], 2)">
        <img :src="photos[2].source" alt="Çift anı" />
        <div class="photo-border"></div>
      </div>
    </div>
    </div>

    <!-- Sayaç bölümü -->
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
  </div>

</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

const photos = ref([
  { source: 'https://images.unsplash.com/photo-1517088455889-bfa75135412c?auto=format&fit=crop&w=749&q=80' },
  { source: 'https://images.unsplash.com/photo-1526656892012-7b336603ed46?auto=format&fit=crop&w=334&q=80' },
  { source: 'https://images.unsplash.com/photo-1521024221340-efe7d7fa239b?auto=format&fit=crop&w=750&q=80' }
])

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

function itemClickHandler(photo: any, index: number) {
  alert(`Fotoğraf ${index + 1} seçildi!`)
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap');

.gallery-container {
  max-width: 900px;
  margin: 0 auto;
}

/* Sayaç bölümü */
.counter-section {
  background: linear-gradient(135deg, #f8f9fa, #e9ecef);
  border-radius: 20px;
  padding: 40px 30px;
  margin-top: 30px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.8);
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
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  font-family: 'Playfair Display', serif;
  font-size: 3rem;
  font-weight: 700;
  width: 60px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.counter-digit::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.05));
  border-radius: 12px;
}

.counter-digit:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 35px rgba(102, 126, 234, 0.4);
}

.counter-title h3 {
  font-family: 'Playfair Display', serif;
  font-size: 1.5rem;
  font-weight: 500;
  color: #6c757d;
  margin: 0;
  font-style: italic;
}

.elegant-collage {
  position: relative;
  max-width: 900px;
  margin: 0 auto;
  padding: 60px 40px;
  background: #fefefe;
  border-radius: 25px;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  display: flex;
  gap: 30px;
  align-items: flex-start;
}

/* Ana büyük fotoğraf (sol taraf) */
.main-photo {
  position: relative;
  flex: 0 0 55%;
  height: 500px;
  cursor: pointer;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.12);
  transition: all 0.4s ease;
}

.main-photo:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 45px rgba(0, 0, 0, 0.18);
}

.main-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.main-photo:hover img {
  transform: scale(1.03);
}

.photo-border {
  position: absolute;
  top: -8px;
  left: -8px;
  right: -8px;
  bottom: -8px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.4));
  border-radius: 25px;
  z-index: -1;
  filter: blur(2px);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.main-photo:hover .photo-border {
  opacity: 1;
}

/* Sağ taraf fotoğrafları */
.right-photos {
  flex: 0 0 40%;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Üst sağ fotoğraf */
.top-photo {
  position: relative;
  height: 240px;
  cursor: pointer;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  transition: all 0.4s ease;
}

.top-photo:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
}

.top-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.top-photo:hover img {
  transform: scale(1.05);
}

/* Alt sağ fotoğraf */
.bottom-photo {
  position: relative;
  height: 240px;
  cursor: pointer;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  transition: all 0.4s ease;
}

.bottom-photo:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
}

.bottom-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.bottom-photo:hover img {
  transform: scale(1.05);
}

/* Fotoğraf kenarları */
.top-photo .photo-border,
.bottom-photo .photo-border {
  position: absolute;
  top: -6px;
  left: -6px;
  right: -6px;
  bottom: -6px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.3));
  border-radius: 18px;
  z-index: -1;
  filter: blur(1.5px);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.top-photo:hover .photo-border,
.bottom-photo:hover .photo-border {
  opacity: 1;
}

/* Responsive tasarım - solda bir, sağda iki fotoğraf */
@media (max-width: 768px) {
  .counter-section {
    padding: 30px 20px;
  }

  .counter-title h2 {
    font-size: 2.2rem;
  }

  .counter-digit {
    width: 50px;
    height: 65px;
    font-size: 2.5rem;
  }

  .counter-title h3 {
    font-size: 1.3rem;
  }

  .elegant-collage {
    padding: 25px 15px;
    gap: 15px;
    max-width: 100%;
    /* Layout korunuyor: flexbox ile sol-sağ düzen */
  }

  .main-photo {
    flex: 0 0 50%; /* Sol taraf %50 */
    height: 280px;
  }

  .right-photos {
    flex: 0 0 45%; /* Sağ taraf %45 */
    gap: 12px;
  }

  .top-photo,
  .bottom-photo {
    height: 130px;
  }
}

@media (max-width: 480px) {
  .counter-section {
    padding: 25px 15px;
  }

  .counter-title h2 {
    font-size: 1.8rem;
  }

  .counter-digit {
    width: 45px;
    height: 60px;
    font-size: 2rem;
  }

  .counter-title h3 {
    font-size: 1.1rem;
  }

  .elegant-collage {
    padding: 20px 10px;
    gap: 12px;
  }

  .main-photo {
    flex: 0 0 55%; /* Mobilde biraz daha büyük */
    height: 220px;
  }

  .right-photos {
    flex: 0 0 40%;
    gap: 10px;
  }

  .top-photo,
  .bottom-photo {
    height: 100px;
  }
}

/* Çok küçük ekranlar için */
@media (max-width: 360px) {
  .elegant-collage {
    padding: 15px 8px;
    gap: 10px;
  }

  .main-photo {
    height: 180px;
  }

  .top-photo,
  .bottom-photo {
    height: 85px;
  }
}
</style>
