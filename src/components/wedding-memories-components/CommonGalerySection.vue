<template>


  <div class="common-gallery">

    <div class="gallery-header">
      <h2>Galeri</h2>
    </div>

    <div class="gallery-grid">
      <!-- Mevcut fotoğraflar -->
      <div v-for="(photo, index) in allPhotos" :key="index" class="gallery-item"
           @click="itemClickHandler(photo, index)">
        <img :src="photo.url" :alt="`Fotoğraf ${index + 1}`" />
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
      <!-- Three dots menu button -->
      <button class="three-dots-btn"
              @click="toggleMenu"
              v-if="props.editable"
              title="Seçenekler">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
             xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="1" fill="currentColor" />
          <circle cx="12" cy="5" r="1" fill="currentColor" />
          <circle cx="12" cy="19" r="1" fill="currentColor" />
        </svg>
      </button>

      <!-- Dropdown menu -->
      <div v-if="showMenu"
           class="dropdown-menu"
           :style="{ left: menuPosition.x + 'px', top: menuPosition.y + 'px' }"
           @click.stop>
        <button class="delete-btn" @click="deleteCurrentPhoto">
          Albümden kaldır
        </button>
      </div>

      <!-- Gallery container with all photos -->
      <div class="gallery-container"
           ref="galleryContainer"
           @scroll="handleGalleryScroll">
        <div v-for="(photo, index) in allPhotos"
             :key="index"
             class="gallery-photo"
             @click="closeModal">
          <img :src="photo.url"
               :alt="`Fotoğraf ${index + 1}`"
               class="gallery-image"
               @click.stop />
        </div>
      </div>

      <!-- Fotoğraf sayacı -->
      <div class="photo-counter" @click.stop>
        {{ currentPhotoIndex + 1 }} / {{ allPhotos.length }}
      </div>
    </div>
  </div>


</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, computed, nextTick } from 'vue'

const props = defineProps({
  editable: {
    type: Boolean,
    default: true
  },
  common_gallery_photos: {
    type: Array,
    default: () => []
  }
})

import g4Image from '../../assets/g4.jpg'
import g5Image from '../../assets/g5.jpg'

const serverPhotos = ref(props.common_gallery_photos)
const localPhotos = ref<Photo[]>(
  props.common_gallery_photos.length === 0
    ? [
      {
        id: null,
        name: 'local-g4',
        url: g4Image
      },
      {
        id: null,
        name: 'local-g5',
        url: g5Image
      }
    ]
    : []
)

const deletedPhotos = ref<Photo[]>([])

const allPhotos = computed(() => [
  ...serverPhotos.value,
  ...localPhotos.value
])

// Current hero image for slideshow
const currentHeroImage = computed(() => {
  if (allPhotos.value.length === 0) {
    return hero // Default hero image if no photos
  }
  return allPhotos.value[currentHeroIndex.value]?.url || hero
})


const emit = defineEmits<{
  (e: 'update:added_common_gallery_photos', photos: Photo[]): void
  (e: 'update:deleted_common_gallery_photos', photos: Photo[]): void
}>()

// localPhotos değiştikçe emit et
watch(localPhotos, (newVal) => {
  emit('update:added_common_gallery_photos', newVal)
}, { deep: true })

// deletedPhotos değiştikçe emit et
watch(deletedPhotos, (newVal) => {
  emit('update:deleted_common_gallery_photos', newVal)
}, { deep: true })

const imageUploadRef = ref(null)
const selectedPhoto = ref(null)
const showModal = ref(false)

// Touch/swipe navigation
const touchStartX = ref(0)
const touchStartY = ref(0)
const touchEndX = ref(0)
const touchEndY = ref(0)
const isDragging = ref(false)

// Gallery modal state
const galleryContainer = ref(null)
const currentPhotoIndex = ref(0)
const isGalleryOpen = ref(false)

// Three dots menu state
const showMenu = ref(false)
const menuPosition = ref({ x: 0, y: 0 })

// Slideshow functionality
const currentHeroIndex = ref(0)
const slideshowInterval = ref(null)
const isSlideshowPlaying = ref(true)
const slideshowSpeed = 5000 // 5 seconds per photo

function itemClickHandler(photo: any, index: number) {
  selectedPhoto.value = { ...photo, index }
  currentPhotoIndex.value = index
  showModal.value = true
  isGalleryOpen.value = true

  // Modal açıldığında direkt seçilen fotoğrafa git
  nextTick(() => {
    if (galleryContainer.value) {
      const container = galleryContainer.value
      const photoWidth = container.clientWidth + 20 // 20px margin dahil
      const scrollPosition = index * photoWidth

      // Scroll-snap'i tamamen devre dışı bırak
      container.style.scrollSnapType = 'none'
      container.style.scrollBehavior = 'auto'

      // Direkt olarak scroll pozisyonunu ayarla
      container.scrollLeft = scrollPosition

      // Çok kısa gecikme ile tekrar ayarla
      setTimeout(() => {
        if (galleryContainer.value) {
          galleryContainer.value.scrollLeft = scrollPosition
        }
      }, 1)

      // Scroll-snap'i tekrar aktif et
      setTimeout(() => {
        if (galleryContainer.value) {
          galleryContainer.value.style.scrollSnapType = 'x mandatory'
          galleryContainer.value.style.scrollBehavior = 'smooth'
        }
      }, 200)
    }
  })
}

function closeModal() {
  showModal.value = false
  selectedPhoto.value = null
  isGalleryOpen.value = false
  currentPhotoIndex.value = 0
  showMenu.value = false
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
          localPhotos.value.push({
            id: null,                       // Local dosyalara id yok
            name: `local-${Date.now()}-${Math.floor(Math.random() * 10000)}`, // Dosya adı
            url: e.target.result            // Base64 veya blob URL
          })
        }
        reader.readAsDataURL(file)
      }
    })
  }
}

function removePhoto(index: number) {

  const photo = allPhotos.value[index]

  if (!photo) return

  // Server’dan gelen foto ise
  const serverIndex = serverPhotos.value.findIndex(p => p.id === photo.id)
  if (serverIndex !== -1) {
    deletedPhotos.value.push(photo)       // backend’e silinecekler için kaydet
    serverPhotos.value.splice(serverIndex, 1) // server listeden çıkar
    return
  }

  // Local’den gelen foto ise
  const localIndex = localPhotos.value.findIndex(p => p.url === photo.url)
  if (localIndex !== -1) {
    localPhotos.value.splice(localIndex, 1)
  }
}


function handleKeydown(event: KeyboardEvent) {
  if (showModal.value) {
    if (event.key === 'Escape') {
      closeModal()
    }
  }
}

// Gallery navigation functions
function scrollToPhoto(index) {
  if (!galleryContainer.value) return

  const container = galleryContainer.value
  const photoWidth = container.clientWidth + 20 // 20px margin dahil
  const scrollPosition = index * photoWidth

  // Scroll pozisyonunu ayarla - tüm fotoğraflar için auto behavior
  container.scrollTo({
    left: scrollPosition,
    behavior: 'auto'
  })

  currentPhotoIndex.value = index
}

function nextPhoto() {
  if (currentPhotoIndex.value < allPhotos.value.length - 1) {
    scrollToPhoto(currentPhotoIndex.value + 1)
  }
}

function prevPhoto() {
  if (currentPhotoIndex.value > 0) {
    scrollToPhoto(currentPhotoIndex.value - 1)
  }
}

function handleGalleryScroll() {
  if (!galleryContainer.value) return

  const container = galleryContainer.value
  const photoWidth = container.clientWidth + 20 // 20px margin dahil
  const scrollLeft = container.scrollLeft
  const newIndex = Math.round(scrollLeft / photoWidth)

  if (newIndex !== currentPhotoIndex.value && newIndex >= 0 && newIndex < allPhotos.value.length) {
    currentPhotoIndex.value = newIndex
    selectedPhoto.value = { ...allPhotos.value[newIndex], index: newIndex }
  }
}

// Three dots menu functions
function toggleMenu(event) {
  event.stopPropagation()
  showMenu.value = !showMenu.value
  if (showMenu.value) {
    // Menüyü üç nokta butonunun sol altında konumlandır
    const buttonRect = event.target.getBoundingClientRect()
    const menuWidth = 150
    const menuHeight = 50
    menuPosition.value = {
      x: buttonRect.left - menuWidth + 20, // Sol alt
      y: buttonRect.bottom + 15 // Daha fazla boşluk ile altında
    }
  }
}

function closeMenu() {
  showMenu.value = false
}

function deleteCurrentPhoto() {
  if (currentPhotoIndex.value >= 0 && currentPhotoIndex.value < allPhotos.value.length) {
    removePhoto(currentPhotoIndex.value)
    closeMenu()

    // If we deleted the last photo, close modal
    if (allPhotos.value.length === 0) {
      closeModal()
    } else {
      // Adjust index if we deleted a photo before current
      if (currentPhotoIndex.value >= allPhotos.value.length) {
        currentPhotoIndex.value = allPhotos.value.length - 1
      }
      // Scroll to current photo
      nextTick(() => {
        scrollToPhoto(currentPhotoIndex.value)
      })
    }
  }
}

function handleTouchStart(event: TouchEvent) {
  if (!showModal.value) return

  touchStartX.value = event.touches[0].clientX
  touchStartY.value = event.touches[0].clientY
  isDragging.value = true
}

function handleTouchMove(event: TouchEvent) {
  if (!showModal.value || !isDragging.value) return

  event.preventDefault() // Prevent scrolling
}

function handleTouchEnd(event: TouchEvent) {
  if (!showModal.value || !isDragging.value) return

  touchEndX.value = event.changedTouches[0].clientX
  touchEndY.value = event.changedTouches[0].clientY

  const deltaX = touchStartX.value - touchEndX.value
  const deltaY = touchStartY.value - touchEndY.value

  // Only process horizontal swipes (ignore vertical scrolling)
  if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
    if (deltaX > 0) {
      // Swipe left - next photo
      nextPhoto()
    } else {
      // Swipe right - previous photo
      prevPhoto()
    }
  }

  isDragging.value = false
}

// Mouse drag support for desktop
function handleMouseDown(event: MouseEvent) {
  if (!showModal.value) return

  touchStartX.value = event.clientX
  touchStartY.value = event.clientY
  isDragging.value = true

  event.preventDefault()
}

function handleMouseMove(event: MouseEvent) {
  if (!showModal.value || !isDragging.value) return

  event.preventDefault()
}

function handleMouseUp(event: MouseEvent) {
  if (!showModal.value || !isDragging.value) return

  touchEndX.value = event.clientX
  touchEndY.value = event.clientY

  const deltaX = touchStartX.value - touchEndX.value
  const deltaY = touchStartY.value - touchEndY.value

  // Only process horizontal drags
  if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
    if (deltaX > 0) {
      // Drag left - next photo
      nextPhoto()
    } else {
      // Drag right - previous photo
      prevPhoto()
    }
  }

  isDragging.value = false
}

// Slideshow functions
function startSlideshow() {
  if (allPhotos.value.length <= 1) return

  stopSlideshow()
  isSlideshowPlaying.value = true
  slideshowInterval.value = setInterval(() => {
    currentHeroIndex.value = (currentHeroIndex.value + 1) % allPhotos.value.length
  }, slideshowSpeed)
}

function stopSlideshow() {
  if (slideshowInterval.value) {
    clearInterval(slideshowInterval.value)
    slideshowInterval.value = null
  }
  isSlideshowPlaying.value = false
}


// Watch for changes in photos to restart slideshow
watch(allPhotos, (newPhotos) => {
  if (newPhotos.length > 1) {
    startSlideshow()
  } else {
    stopSlideshow()
  }
}, { immediate: true })

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
  document.addEventListener('click', (event) => {
    // Menü dışında herhangi bir yere tıklayınca kapat
    if (showMenu.value && !event.target.closest('.dropdown-menu') && !event.target.closest('.three-dots-btn')) {
      closeMenu()
    }
  })
  // Start slideshow if there are photos
  if (allPhotos.value.length > 1) {
    startSlideshow()
  }
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
  stopSlideshow()
})
</script>

<style scoped>
/* Font import'ları artık theme.css'de */

.hero-container {
  position: relative;
  min-height: 85vh;
  width: 100%;
  overflow: hidden;
}

.hero-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover; /* containeri her zaman kaplasın */
  object-position: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.hero-image:hover {
  transform: scale(1.01);
  filter: brightness(1.1);
}


.hero-photo-counter {
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 8px 12px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  backdrop-filter: blur(5px);
  z-index: 10;
}

.invitation-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: white;
  max-width: 320px;
  width: 80%;
  padding: var(--padding-2xl) var(--padding-lg);
  background: rgba(0, 0, 0, 0.15);
  border-radius: var(--radius-2xl);
  backdrop-filter: blur(3px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.decorative-top,
.decorative-bottom {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: var(--padding-lg) 0;
}

.decorative-line {
  width: 60px;
  height: 1px;
  background: linear-gradient(90deg, transparent, white, transparent);
  margin: 0 var(--padding-sm);
}

.decorative-dot {
  width: var(--padding-sm);
  height: var(--padding-sm);
  background: white;
  border-radius: 50%;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
}

.invitation-content {
  margin: var(--padding-2xl) 0;
}

.invitation-text {
  margin-bottom: var(--padding-2xl);
}

.name {
  font-family: var(--font-primary);
  font-size: 3.5rem;
  font-weight: var(--font-weight-bold);
  line-height: 1.2;
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.8);
  letter-spacing: 2px;
  margin: var(--padding-xs) 0;
}

.name.editable {
  cursor: pointer;
  transition: var(--transition-normal) var(--ease-in-out);
  border-radius: var(--radius-md);
  padding: var(--padding-xs) var(--padding-sm);
  margin: var(--padding-xs) calc(-1 * var(--padding-sm));
}

.name.editable:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: scale(1.02);
}

.name.editable:focus {
  outline: none;
  background: rgba(255, 255, 255, 0.15);
  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.3);
}

.ampersand {
  font-family: var(--font-secondary);
  font-size: 2.5rem;
  font-style: italic;
  font-weight: var(--font-weight-light);
  opacity: 0.9;
  margin: var(--padding-lg) 0;
  text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.7);
}

.date-section {
  position: relative;
  border-top: 1px solid rgba(255, 255, 255, 0.3);
  padding-top: var(--padding-xl);
  margin-top: var(--padding-xl);
}

.date-text {
  font-family: var(--font-secondary);
  font-size: 1.8rem;
  font-weight: var(--font-weight-medium);
  margin-bottom: var(--padding-sm);
  text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.7);
  letter-spacing: 1px;
}

.time-text {
  font-family: var(--font-secondary);
  font-size: 1.6rem;
  font-weight: var(--font-weight-light);
  opacity: 0.9;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.6);
  letter-spacing: 0.5px;
}

/* Editable date styles */
.date-text.editable {
  position: relative;
  cursor: pointer;
  transition: var(--transition-normal) var(--ease-in-out);
  border-radius: var(--radius-sm);
  padding: var(--padding-xs) var(--padding-sm);
  margin: var(--padding-xs) calc(-1 * var(--padding-sm));
  z-index: 10;
  pointer-events: auto;
}

.date-text.editable:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: scale(1.02);
}

.date-text.editable:focus {
  outline: none;
  background: rgba(255, 255, 255, 0.15);
  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.3);
}

/* Responsive design - maintain mobile-like appearance on all screens */
@media (max-width: 768px) {
  .hero-container {
  }


  .hero-photo-counter {
    top: 15px;
    right: 15px;
    padding: 6px 10px;
    font-size: 12px;
  }

  .invitation-container {
    padding: var(--padding-2xl) var(--padding-lg);
  }

  .name {
    font-size: 2.8rem;
  }

  .date-text {
    font-size: 1.5rem;
  }

  .time-text {
    font-size: 1.3rem;
  }

  .decorative-line {
    width: var(--size-2xl);
  }
}

@media (max-width: 480px) {
  .hero-container {
  }

  .hero-image {
  }


  .hero-photo-counter {
    top: 10px;
    right: 10px;
    padding: 4px 8px;
    font-size: 11px;
  }

  .name {
    font-size: 2.2rem;
  }

  .date-text {
    font-size: 1.3rem;
  }

  .time-text {
    font-size: 1.1rem;
  }
}


.common-gallery {
  width: 100%;
  margin: 0;
  padding: var(--padding-lg) var(--padding-lg);
}

.gallery-header {
  text-align: center;
  margin-bottom: var(--padding-lg);
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
  gap: var(--padding-sm);
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


/* Resim ekle butonu */
.add-photo-item {
  aspect-ratio: 4/3;
  border-radius: var(--radius-xl);
  cursor: pointer;
  border: 2px dashed #667eea;
  background: var(--gradient-hover);
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
  color: #667eea;
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
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 0;
  margin: 0;
  width: 100vw;
  height: 100vh;
}

/* Gallery container styles */
.gallery-container {
  display: flex;
  width: 100vw;
  height: 100vh;
  overflow-x: auto;
  overflow-y: hidden;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
  position: relative;
  align-items: center;
  justify-content: flex-start;
}

.gallery-photo {
  flex: 0 0 100vw;
  width: 100vw;
  height: auto;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  scroll-snap-align: start;
  margin-right: 20px;
}

.gallery-image {
  width: 100vw;
  height: auto;
  max-height: 100vh;
  object-fit: contain;
  display: block;
}

/* Three dots menu button */
.three-dots-btn {
  position: fixed;
  top: 20px;
  right: 20px;
  width: 40px;
  height: 40px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  z-index: 1002;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.three-dots-btn:hover {
  background: rgba(0, 0, 0, 0.9);
  transform: scale(1.1);
}

/* Dropdown menu */
.dropdown-menu {
  position: fixed;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  z-index: 1003;
  min-width: 150px;
  overflow: hidden;
}

.delete-btn {
  width: calc(100% - 16px);
  padding: 8px 16px;
  background: none;
  border: none;
  color: #dc2626;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
  margin: 8px;
  border-radius: 4px;
}

.delete-btn:hover {
  background: #dc2626;
  color: white;
}


/* Fotoğraf sayacı */
.photo-counter {
  position: fixed;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 12px 20px;
  border-radius: 25px;
  font-size: 16px;
  font-weight: 500;
  z-index: 1001;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}


/* Responsive tasarım - her satırda 3 fotoğraf */
@media (max-width: 768px) {
  .gallery-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: var(--padding-xs);
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
    gap: var(--padding-xs);
    align-items: start;
  }

  .gallery-header h2 {
    font-size: 2.2rem;
  }

  .add-icon {
    font-size: 2rem;
  }

  .common-gallery {
    padding: var(--padding-xs) var(--padding-xs);
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

