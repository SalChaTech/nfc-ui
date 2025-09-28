<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const photos = ref([])
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
      <div 
        v-for="(photo, index) in photos" 
        :key="index"
        class="gallery-item"
        @click="itemClickHandler(photo, index)"
      >
        <img :src="photo.source" :alt="`Fotoğraf ${index + 1}`" />
        <button 
          class="remove-btn" 
          @click.stop="removePhoto(index)"
          title="Fotoğrafı kaldır"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14zM10 11v6M14 11v6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
      
      <!-- Resim ekle butonu -->
      <div class="add-photo-item" @click="triggerImageUpload">
        <div class="add-photo-content">
          <div class="add-icon">+</div>
          <div class="add-text">Resim Ekle</div>
        </div>
      </div>
    </div>
    
    <!-- Gizli dosya input -->
    <input 
      type="file" 
      ref="imageUploadRef"
      @change="handleImageUpload"
      accept="image/*"
      multiple
      style="display: none;"
    />
    
    <!-- Fotoğraf modal -->
    <div v-if="showModal" class="photo-modal" @click="closeModal">
      <div class="modal-content" @click.stop>
        <button class="close-btn" @click="closeModal">&times;</button>
        
        <!-- Sol ok butonu -->
        <button 
          v-if="selectedPhoto && selectedPhoto.index > 0"
          class="nav-btn nav-prev" 
          @click="prevPhoto"
          title="Önceki fotoğraf"
        >
          ‹
        </button>
        
        <!-- Sağ ok butonu -->
        <button 
          v-if="selectedPhoto && selectedPhoto.index < photos.length - 1"
          class="nav-btn nav-next" 
          @click="nextPhoto"
          title="Sonraki fotoğraf"
        >
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
@import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap');

.common-gallery {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.gallery-header {
  text-align: center;
  margin-bottom: 40px;
}

.gallery-header h2 {
  font-family: 'Dancing Script', cursive;
  font-size: 3rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 10px 0;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.1);
}


.gallery-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.gallery-item {
  position: relative;
  aspect-ratio: 4/3;
  border-radius: 15px;
  overflow: hidden;
  cursor: pointer;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  transition: all 0.4s ease;
  background: white;
}

.gallery-item:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2);
}

.gallery-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.gallery-item:hover img {
  transform: scale(1.05);
}

.remove-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 28px;
  height: 28px;
  background: rgba(255, 255, 255, 0.95);
  color: #dc3545;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  font-size: 18px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: all 0.3s ease;
  z-index: 10;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.remove-btn svg {
  width: 16px;
  height: 16px;
  stroke: #dc3545;
}

.gallery-item:hover .remove-btn {
  opacity: 1;
}

.remove-btn:hover {
  background: rgba(255, 255, 255, 1);
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(220, 53, 69, 0.4);
}

.remove-btn:hover svg {
  stroke: #dc3545;
  stroke-width: 2.5;
}


/* Resim ekle butonu */
.add-photo-item {
  aspect-ratio: 4/3;
  border-radius: 15px;
  cursor: pointer;
  border: 2px dashed #adb5bd;
  background: linear-gradient(135deg, #f8f9fa, #e9ecef);
  transition: all 0.4s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.add-photo-item:hover {
  border-color: #667eea;
  background: linear-gradient(135deg, #e3f2fd, #f3e5f5);
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.2);
}

.add-photo-content {
  text-align: center;
  color: #6c757d;
  transition: all 0.3s ease;
}

.add-photo-item:hover .add-photo-content {
  color: #667eea;
}

.add-icon {
  font-size: 3rem;
  font-weight: 300;
  margin-bottom: 10px;
  transition: all 0.3s ease;
}

.add-photo-item:hover .add-icon {
  transform: scale(1.1);
}

.add-text {
  font-family: 'Playfair Display', serif;
  font-size: 1.1rem;
  font-weight: 500;
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
  padding: 20px;
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
  width: 40px;
  height: 40px;
  font-size: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
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
  width: 50px;
  height: 50px;
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
  transition: all 0.3s ease;
  z-index: 20;
}

.nav-prev {
  left: 20px;
}

.nav-next {
  right: 20px;
}

.nav-btn:hover {
  background: rgba(0, 0, 0, 0.9);
  transform: translateY(-50%) scale(1.1);
}

/* Fotoğraf sayacı */
.photo-counter {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  z-index: 20;
}


/* Responsive tasarım - her satırda 3 fotoğraf */
@media (max-width: 768px) {
  .gallery-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
  }
  
  .gallery-header h2 {
    font-size: 2.5rem;
  }
  
  .add-icon {
    font-size: 2.5rem;
  }
  
  .add-text {
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .gallery-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
  }
  
  .gallery-header h2 {
    font-size: 2.2rem;
  }
  
  .add-icon {
    font-size: 2rem;
  }
  
  .add-text {
    font-size: 0.9rem;
  }
  
  .common-gallery {
    padding: 30px 15px;
  }
}

/* Çok küçük ekranlar için */
@media (max-width: 360px) {
  .gallery-grid {
    gap: 6px;
  }
  
  .gallery-header h2 {
    font-size: 2rem;
  }
  
  .add-icon {
    font-size: 1.8rem;
  }
  
  .add-text {
    font-size: 0.8rem;
  }
}
</style>
