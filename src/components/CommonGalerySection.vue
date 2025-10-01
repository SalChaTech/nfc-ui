<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  editable: {
    type: Boolean,
    default: false
  }
})

import g4Image from '../assets/g4.jpg'
import g5Image from '../assets/g5.jpg'


const photos = ref([{ source: g4Image }, { source: g5Image }])
const imageUploadRef = ref(null)
const selectedPhoto = ref(null)
const showModal = ref(false)

function itemClickHandler(photo: any, index: number) {
  selectedPhoto.value = { ...photo, index }
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  selectedPhoto.value = null
}

function triggerImageUpload() {
  if (imageUploadRef.value) {
    imageUploadRef.value.click()
  }
}

function handleImageUpload(event: any) {
  const files = event.target.files
  if (files && files.length > 0) {
    Array.from(files).forEach((file: any) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onload = (e: any) => {
          photos.value.push({ source: e.target.result })
        }
        reader.readAsDataURL(file)
      }
    })
  }
}

function removePhoto(index: number) {
  photos.value.splice(index, 1)
}

function nextPhoto() {
  if (selectedPhoto.value && selectedPhoto.value.index < photos.value.length - 1) {
    const nextIndex = selectedPhoto.value.index + 1
    selectedPhoto.value = { ...photos.value[nextIndex], index: nextIndex }
  }
}

function prevPhoto() {
  if (selectedPhoto.value && selectedPhoto.value.index > 0) {
    const prevIndex = selectedPhoto.value.index - 1
    selectedPhoto.value = { ...photos.value[prevIndex], index: prevIndex }
  }
}

function handleKeydown(event: KeyboardEvent) {
  if (showModal.value) {
    if (event.key === 'ArrowRight') {
      nextPhoto()
    } else if (event.key === 'ArrowLeft') {
      prevPhoto()
    } else if (event.key === 'Escape') {
      closeModal()
    }
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <div class="common-gallery">
    <div class="gallery-header">
      <h2>Galeri</h2>
    </div>

    <div class="gallery-grid">
      <!-- Mevcut fotoğraflar -->
      <div v-for="(photo, index) in photos" :key="index" class="gallery-item"
           @click="itemClickHandler(photo, index)">
        <img :src="photo.source" :alt="`Fotoğraf ${index + 1}`" />
        <button class="remove-btn" @click.stop="props.editable ? removePhoto(index) : null"
                v-if="props.editable"
                title="Fotoğrafı kaldır">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
               xmlns="http://www.w3.org/2000/svg">
            <path
              d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14zM10 11v6M14 11v6"
              stroke="currentColor" stroke-width="2" stroke-linecap="round"
              stroke-linejoin="round" />
          </svg>
        </button>
      </div>

      <!-- Resim ekle butonu -->
      <div class="add-photo-item" @click="triggerImageUpload" v-if="props.editable">
        <div class="add-icon">+</div>
      </div>
    </div>

    <!-- Gizli dosya input -->
    <input type="file" ref="imageUploadRef" @change="handleImageUpload" accept="image/*" multiple
           style="display: none;" v-if="props.editable" />

    <!-- Fotoğraf modal -->
    <div v-if="showModal" class="photo-modal" @click="closeModal">
      <div class="modal-content" @click.stop>
        <button class="close-btn" @click="closeModal">&times;</button>

        <!-- Sol ok butonu -->
        <button v-if="selectedPhoto && selectedPhoto.index > 0" class="nav-btn nav-prev"
                @click="prevPhoto"
                title="Önceki fotoğraf">
          ‹
        </button>

        <!-- Sağ ok butonu -->
        <button v-if="selectedPhoto && selectedPhoto.index < photos.length - 1"
                class="nav-btn nav-next"
                @click="nextPhoto" title="Sonraki fotoğraf">
          ›
        </button>

        <img :src="selectedPhoto?.source" :alt="`Fotoğraf ${selectedPhoto?.index + 1}`" />

        <!-- Fotoğraf sayacı -->
        <div class="photo-counter">
          {{ (selectedPhoto?.index || 0) + 1 }} / {{ photos.length }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Font import'ları artık theme.css'de */

.common-gallery {
  width: 100%;
  margin: 0;
  padding: var(--padding-lg) var(--padding-lg);
}

.gallery-header {
  text-align: center;
  margin-bottom: var(--padding-xl);
}

.gallery-header h2 {
  font-family: var(--font-primary);
  font-size: 3rem;
  font-weight: var(--font-weight-semibold);
  color: var(--color-primary);
  margin: 0 0 10px 0;
  text-shadow: 1px 1px 3px var(--shadow-light);
}


.gallery-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--padding-lg);
  align-items: stretch;
}

/* Hiç fotoğraf yokken tek item olduğunda da 3 sütunlu grid korunsun */
.gallery-grid:has(.add-photo-item:only-child) {
  grid-template-columns: repeat(3, 1fr);
}


.gallery-item {
  position: relative;
  aspect-ratio: 4/3;
  border-radius: var(--radius-xl);
  overflow: hidden;
  cursor: pointer;
  box-shadow: 0 8px 25px var(--shadow-light);
  transition: var(--transition-slow) var(--ease-in-out);
  background: white;
  width: 100%;
  height: 100%;
}

.gallery-item:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 40px var(--shadow-heavy);
}

.gallery-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-slow) var(--ease-in-out);
}

.gallery-item:hover img {
  transform: scale(1.05);
}

.remove-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  width: var(--size-xl);
  height: var(--size-xl);
  background: var(--bg-white);
  color: var(--color-danger);
  border: none;
  border-radius: var(--radius-full);
  cursor: pointer;
  font-size: 18px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: var(--transition-normal) var(--ease-in-out);
  z-index: 10;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.remove-btn svg {
  width: var(--size-md);
  height: var(--size-md);
  stroke: var(--color-danger);
}

.gallery-item:hover .remove-btn {
  opacity: 1;
}

.remove-btn:hover {
  background: rgba(255, 255, 255, 1);
  transform: scale(1.1);
  box-shadow: 0 4px 12px var(--shadow-danger);
}

.remove-btn:hover svg {
  stroke: var(--color-danger);
  stroke-width: 2.5;
}


/* Resim ekle butonu */
.add-photo-item {
  aspect-ratio: 4/3;
  border-radius: var(--radius-xl);
  cursor: pointer;
  border: 2px dashed var(--color-text-light);
  background: var(--gradient-primary);
  transition: var(--transition-slow) var(--ease-in-out);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 100%;
}

.add-photo-item:hover {
  border-color: #667eea;
  background: var(--gradient-hover);
  transform: translateY(-5px);
  box-shadow: 0 10px 30px var(--shadow-blue);
}

.add-icon {
  font-size: 3rem;
  font-weight: 300;
  color: var(--color-secondary);
  transition: var(--transition-normal) var(--ease-in-out);
}

.add-photo-item:hover .add-icon {
  transform: scale(1.1);
  color: #667eea;
}

/* Fotoğraf modal */
.photo-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: var(--padding-lg);
  margin: 0;
  width: 100vw;
  height: 100vh;
}

.modal-content {
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
  background: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.modal-content img {
  width: 100%;
  height: auto;
  max-height: 80vh;
  object-fit: contain;
  display: block;
  margin: 0 auto;
}

.close-btn {
  position: absolute;
  top: 15px;
  right: 15px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border: none;
  border-radius: 50%;
  width: var(--size-2xl);
  height: var(--size-2xl);
  font-size: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition-normal) var(--ease-in-out);
  z-index: 1001;
}

.close-btn:hover {
  background: rgba(0, 0, 0, 0.9);
  transform: scale(1.1);
}

/* Navigasyon butonları */
.nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: var(--size-3xl);
  height: var(--size-3xl);
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  font-size: 24px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition-normal) var(--ease-in-out);
  z-index: 20;
}

.nav-prev {
  left: var(--padding-lg);
}

.nav-next {
  right: var(--padding-lg);
}

.nav-btn:hover {
  background: rgba(0, 0, 0, 0.9);
  transform: translateY(-50%) scale(1.1);
}

/* Fotoğraf sayacı */
.photo-counter {
  position: absolute;
  bottom: var(--padding-lg);
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: var(--padding-sm) var(--padding-md);
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  z-index: 20;
}


/* Responsive tasarım - her satırda 3 fotoğraf */
@media (max-width: 768px) {
  .gallery-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: var(--padding-sm);
    align-items: start;
  }

  .gallery-header h2 {
    font-size: 2.5rem;
  }

  .add-icon {
    font-size: 2.5rem;
  }

  .gallery-item {
    width: 100%;
    height: 100%;
  }

  .add-photo-item {
    width: 100%;
    height: 100%;
  }

}

@media (max-width: 480px) {
  .gallery-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: var(--padding-sm);
    align-items: start;
  }

  .gallery-header h2 {
    font-size: 2.2rem;
  }

  .add-icon {
    font-size: 2rem;
  }

  .common-gallery {
    padding: var(--padding-md) var(--padding-lg);
  }

  .gallery-item {
    width: 100%;
    height: 100%;
  }

  .add-photo-item {
    width: 100%;
    height: 100%;
  }

}

/* Çok küçük ekranlar için */
@media (max-width: 360px) {
  .gallery-grid {
    gap: var(--padding-xs);
    align-items: start;
  }

  .gallery-header h2 {
    font-size: 2rem;
  }

  .add-icon {
    font-size: 1.8rem;
  }

  .gallery-item {
    width: 100%;
    height: 100%;
  }

  .add-photo-item {
    width: 100%;
    height: 100%;
  }

}
</style>
