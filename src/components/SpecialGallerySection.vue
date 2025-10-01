<template>
  <div class="gallery-container mt-4">
    <!-- Ana büyük fotoğraf (sol taraf) -->
    <div class="main-photo" @click="props.editable ? itemClickHandler(photos[0], 0) : null">
      <img :src="photos[0].source" alt="Ana düğün fotoğrafı" />
      <div class="photo-border"></div>
    </div>

    <!-- Sağ taraf fotoğrafları -->
    <div class="right-photos">
      <!-- Üst sağ fotoğraf -->
      <div class="top-photo" @click="props.editable ? itemClickHandler(photos[1], 1) : null">
        <img :src="photos[1].source" alt="Düğün anı" />
        <div class="photo-border"></div>
      </div>

      <!-- Alt sağ fotoğraf -->
      <div class="bottom-photo" @click="props.editable ? itemClickHandler(photos[2], 2) : null">
        <img :src="photos[2].source" alt="Çift anı" />
        <div class="photo-border"></div>
      </div>
    </div>
  </div>

  <!-- Gizli dosya input -->
  <input type="file" ref="photoInputRef" @change="handlePhotoChange" @click="props.editable ? handlePhotoChange : null" accept="image/*" style="display: none;" />

</template>

<script setup lang="ts">
import { ref } from 'vue'
import g1Image from '../assets/g3.jpg'
import g2Image from '../assets/g2.jpg'
import g3Image from '../assets/g1.jpg'

const props = defineProps({
  editable: {
    type: Boolean,
    default: false
  }
})

const photos = ref([
  { source: g1Image },
  { source: g2Image },
  { source: g3Image }
])

const photoInputRef = ref(null)
const selectedPhotoIndex = ref(0)

function itemClickHandler(photo: any, index: number) {
  // Hangi fotoğrafa tıklandığını kaydet
  selectedPhotoIndex.value = index
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
      // Tıklanan fotoğrafı değiştir
      photos.value[selectedPhotoIndex.value].source = e.target.result
    }
    reader.readAsDataURL(file)
  }
}
</script>

<style scoped>
/* Font import'ları artık theme.css'de */

.gallery-container {
  position: relative;
  max-width: 900px;
  margin: 0 auto;
  padding: 60px 0px;
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
  border-radius: var(--radius-2xl);
  border-top-left-radius: 0%;
  border-bottom-left-radius: 0%;
  overflow: hidden;
  box-shadow: 0 12px 30px var(--shadow-light);
  transition: var(--transition-slow) var(--ease-in-out);
  align-self: flex-start;
  margin: 0;
}

.main-photo:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 45px var(--shadow-medium);
}

.main-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-slow) var(--ease-in-out);
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
  border-radius: var(--radius-xl);
  border-top-right-radius: 0%;
  border-bottom-right-radius: 0%;
  overflow: hidden;
  box-shadow: 0 8px 25px var(--shadow-light);
  transition: var(--transition-slow) var(--ease-in-out);
  margin: 0;
}

.top-photo:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 35px var(--shadow-medium);
}

.top-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-slow) var(--ease-in-out);
}

.top-photo:hover img {
  transform: scale(1.05);
}

/* Alt sağ fotoğraf */
.bottom-photo {
  position: relative;
  height: 240px;
  cursor: pointer;
  border-radius: var(--radius-xl);
  border-top-right-radius: 0%;
  border-bottom-right-radius: 0%;
  overflow: hidden;
  box-shadow: 0 8px 25px var(--shadow-light);
  transition: var(--transition-slow) var(--ease-in-out);
  margin: 0;
}

.bottom-photo:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 35px var(--shadow-medium);
}

.bottom-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-slow) var(--ease-in-out);
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
    padding: 25px 0px;
    gap: 15px;
    max-width: 100%;
    align-items: stretch;
    /* Layout korunuyor: flexbox ile sol-sağ düzen */
  }

  .main-photo {
    flex: 0 0 50%;
    /* Sol taraf %50 */
    height: 280px;
    align-self: stretch;
  }

  .right-photos {
    flex: 0 0 45%;
    /* Sağ taraf %45 */
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
    padding: 20px 0px;
    gap: 12px;
    align-items: stretch;
  }

  .main-photo {
    flex: 0 0 55%;
    /* Mobilde biraz daha büyük */
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
    padding: 15px 0px;
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
