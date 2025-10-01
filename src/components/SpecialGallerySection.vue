<template>
  <div class="gallery-container mt-4">
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

  <!-- Gizli dosya input -->
  <input
    type="file"
    ref="photoInputRef"
    @change="handlePhotoChange"
    accept="image/*"
    style="display: none;"
  />

</template>

<script setup lang="ts">
import { ref } from 'vue'
import { IMAGES} from '@/constants/images.js';


const props = defineProps({
  editable: {
    type: Boolean,
    default: fa
  }
})


const photos = ref([
  { source: IMAGES[1] },
  { source: IMAGES[5] },
  { source: IMAGES[6] }
])

const photoInputRef = ref(null)

function itemClickHandler(photo: any, index: number) {
  // Fotoğraf değiştirme için input'u tetikle
  if (photoInputRef.value) {
    photoInputRef.value.click()
  }
}

function handlePhotoChange(event: any) {
  const file = event.target.files[0]
  if (file && file.type.startsWith('image/')) {
    const reader = new FileReader()
    reader.onload = (e: any) => {
      // İlk fotoğrafı değiştir (index 0)
      photos.value[0].source = e.target.result
    }
    reader.readAsDataURL(file)
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap');

.gallery-container {
  position: relative;
  max-width: 900px;
  margin: 0 auto;
  padding: 60px 20px;
  background: transparent;
  display: flex;
  gap: 30px;
  align-items: flex-start;
  justify-content: space-between;
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
  align-self: flex-start;
  margin: 0;
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
  align-self: flex-end;
  margin: 0;
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
  margin: 0;
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
  margin: 0;
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
  .gallery-container {
    padding: 25px 15px;
    gap: 15px;
    max-width: 100%;
    align-items: stretch;
    /* Layout korunuyor: flexbox ile sol-sağ düzen */
  }

  .main-photo {
    flex: 0 0 50%; /* Sol taraf %50 */
    height: 280px;
    align-self: stretch;
  }

  .right-photos {
    flex: 0 0 45%; /* Sağ taraf %45 */
    gap: 12px;
    align-self: stretch;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .top-photo,
  .bottom-photo {
    height: 130px;
  }
}

@media (max-width: 480px) {
  .gallery-container {
    padding: 20px 10px;
    gap: 12px;
    align-items: stretch;
  }

  .main-photo {
    flex: 0 0 55%; /* Mobilde biraz daha büyük */
    height: 220px;
    align-self: stretch;
  }

  .right-photos {
    flex: 0 0 40%;
    gap: 10px;
    align-self: stretch;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .top-photo,
  .bottom-photo {
    height: 100px;
  }
}

/* Çok küçük ekranlar için */
@media (max-width: 360px) {
  .gallery-container {
    padding: 15px 8px;
    gap: 10px;
    align-items: stretch;
  }

  .main-photo {
    height: 180px;
    align-self: stretch;
  }

  .right-photos {
    align-self: stretch;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .top-photo,
  .bottom-photo {
    height: 85px;
  }
}
</style>
