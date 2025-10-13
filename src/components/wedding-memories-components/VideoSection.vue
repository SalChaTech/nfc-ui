<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import evlilikVideo from '../../assets/say_yes.mp4'

interface Video {
  id: string | null
  name: string | null
  url: string | null
}

const props = defineProps<{
  editable: boolean, video: Video | null
}>()

const emit = defineEmits(['update:video'])

const videoRef = ref(null)
const videoFile = ref<Video>({
  id: props.video?.id || '4',
  name: props.video?.name || 'video',
  url: props.video?.url || (props.editable ? evlilikVideo : null)
})

// Props değiştiğinde videoFile'ı güncelle
watch(() => [props.video, props.editable], async ([newVideo, editable]) => {
  if (newVideo && newVideo.url) {
    // URL'den ID'yi çıkar
    const videoId = newVideo.url.split('/').pop()?.split('?')[0]

    if (videoId) {
      // Yeni URL oluştur
      const videoUrl = `http://localhost:8080/api/drive/video/${videoId}`

      videoFile.value = {
        id: newVideo.id || '4',
        name: newVideo.name || 'video',
        url: videoUrl
      }
    } else {
      // ID çıkarılamazsa orijinal URL'i kullan
      videoFile.value = {
        id: newVideo.id || '4',
        name: newVideo.name || 'video',
        url: newVideo.url
      }
    }
  } else if (editable) {
    videoFile.value = {
      id: '4',
      name: 'video',
      url: evlilikVideo
    }
  } else {
    videoFile.value = {
      id: '4',
      name: 'video',
      url: null
    }
  }
}, { immediate: true })


const switchVideoVisible = ref(true)
const title = ref('Ölümsüz An')
const isEditingTitle = ref(false)
const titleRef = ref(null)

// Three dots menu state
const showMenu = ref(false)
const menuPosition = ref({ x: 0, y: 0 })

const emitVideo = () => {
  emit('update:video', videoFile.value)
}

// Debug için
console.log('VideoSection - props.editable:', props.editable)


function handleVideoUpload(event: any) {
  const file = event.target.files[0]
  if (file && file.type.startsWith('video/')) {
    videoFile.value = {
      id: videoFile.value?.id || '4',      // eski id'yi koru
      name: videoFile.value?.name || 'video', // eski name varsa onu kullan, yoksa dosya adını al
      url: URL.createObjectURL(file)        // yeni url
    }
    emitVideo()
  }
}

function triggerVideoUpload() {
  const input = videoRef.value
  if (input) {
    input.click()
  } else {
    console.warn('videoRef boş!')
  }
}

function onVideoEnded() {
  // Video ended handler
}

function removeVideo() {
  videoFile.value = {
    id: '4',
    name: 'video',
    url: null
  }
  emitVideo()
  showMenu.value = false
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

const showVideoControls = computed(() => props.editable)

const showVideoHeader = computed(() => {
  return (props.editable && switchVideoVisible.value) || (!props.editable && !!videoFile.value?.url)
})

const showVideoPlayer = computed(() => {
  return switchVideoVisible.value && !!videoFile.value?.url
})

const showUploadArea = computed(() => {
  return props.editable && switchVideoVisible.value && !videoFile.value?.url
})


// Menü dışında tıklayınca kapat
onMounted(() => {
  document.addEventListener('click', (event) => {
    // Menü dışında herhangi bir yere tıklayınca kapat
    if (showMenu.value && !event.target.closest('.dropdown-menu') && !event.target.closest('.three-dots-btn')) {
      closeMenu()
    }
  })
})

onUnmounted(() => {
  document.removeEventListener('click', closeMenu)
})


</script>

<template>
  <div class="video-section">
    <!-- Video görünürlük kontrolü -->
    <div v-if="showVideoControls" class="video-controls">
      <div class="control-item">
        <label class="control-label">
          <input
            type="checkbox"
            v-model="switchVideoVisible"
            class="control-checkbox"
          />
          <span class="control-text">Video Bölümünü Göster</span>
        </label>
      </div>
    </div>

    <div v-if="showVideoHeader" class="video-header">
      <h2 class="editable" @click="props.editable ? editTitle : null"
          @blur="props.editable ? saveTitle : null"
          @keydown.enter="props.editable ? saveTitle : null"
          :contenteditable="props.editable ? isEditingTitle : null"
          ref="titleRef">{{ title }}</h2>
    </div>

    <!-- Video oynatıcı -->
    <div v-if="showVideoPlayer" class="video-wrapper">
      <video class="video-player" :src="videoFile.url" @ended="onVideoEnded"
             controls preload="metadata">
        Tarayıcınız video oynatmayı desteklemiyor.
      </video>

      <!-- Three dots menu button - video player üstünde -->
      <button class="three-dots-btn"
              @click="toggleMenu"
              v-if="props.editable === true"
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
        <button class="delete-btn" @click="removeVideo">
          Videoyu sil
        </button>
      </div>
    </div>

    <!-- Video yükleme alanı -->
    <div v-if="showUploadArea" class="video-upload-area" @click="triggerVideoUpload">
      <div class="upload-content">
        <div class="upload-icon">+</div>
        <div class="upload-text">Video Yükle</div>
      </div>
    </div>

    <!-- Gizli dosya input -->
    <input type="file" ref="videoRef" @change="handleVideoUpload" accept="video/*"
           style="display: none;" />

  </div>
</template>

<style scoped>
.video-section {
  background: transparent;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--padding-4xl) var(--padding-lg);
  width: 100%;
}

.video-header {
  text-align: center;
  margin-bottom: var(--padding-sm);
}

.video-header h2 {
  font-family: var(--font-primary);
  font-size: 3.5rem;
  font-weight: var(--font-weight-semibold);
  color: var(--color-primary);
  margin: 0;
  text-shadow: 2px 2px 4px var(--shadow-light);
}

.video-header h2.editable {
  cursor: pointer;
  transition: var(--transition-normal) var(--ease-in-out);
  border-radius: var(--radius-md);
  padding: var(--padding-xs) var(--padding-sm);
  margin: var(--padding-xs) calc(-1 * var(--padding-sm));
}

.video-header h2.editable:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: scale(1.02);
}

.video-header h2.editable:focus {
  outline: none;
  background: rgba(255, 255, 255, 0.15);
  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.3);
}

.video-wrapper {
  position: relative;
  width: 100%;
  aspect-ratio: 16/9;
  border-radius: var(--radius-2xl);
  overflow: hidden;
  margin: 0;
}

/* Three dots menu button */
.three-dots-btn {
  position: absolute;
  top: 15px;
  right: 15px;
  width: 40px;
  height: 40px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  z-index: 10;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
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
  z-index: 10001;
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

.video-player {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* Mobilde video'ya tıklama özelliği */
@media (max-width: 768px) {
  .video-player {
    cursor: pointer;
  }
}

.video-upload-area {
  aspect-ratio: 16/9;
  background: transparent;
  border: 2px dashed var(--color-text-light);
  border-radius: var(--radius-2xl);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: var(--transition-normal) var(--ease-in-out);
  position: relative;
  min-height: 200px;
  max-height: 400px;
  width: 100%;
  margin: 0;
}

.video-upload-area:hover {
  border-color: #667eea;
  background: var(--gradient-hover);
  transform: translateY(-5px);
  box-shadow: 0 10px 30px var(--shadow-blue);
}

.upload-content {
  text-align: center;
  color: var(--color-secondary);
  z-index: var(--z-tooltip);
  position: relative;
  transition: var(--transition-normal) var(--ease-in-out);
}

.upload-icon {
  font-size: 4rem;
  margin-bottom: 20px;
  animation: pulse var(--animation-very-slow) ease-in-out infinite;
  transition: var(--transition-normal) var(--ease-in-out);
}

.upload-text {
  font-family: var(--font-secondary);
  font-size: 2rem;
  font-weight: var(--font-weight-semibold);
  margin-bottom: 0;
  color: var(--color-text);
  transition: var(--transition-normal) var(--ease-in-out);
}

.video-upload-area:hover .upload-content {
  color: #667eea;
}

.video-upload-area:hover .upload-icon {
  transform: scale(1.1);
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

/* Video modal */
.video-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--bg-overlay);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: var(--z-modal);
  padding: var(--padding-lg);
  margin: 0;
  width: 100vw;
  height: 100vh;
}

.modal-content {
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
  background: black;
  border-radius: var(--radius-xl);
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.modal-video {
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
  width: var(--size-2xl);
  height: var(--size-2xl);
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border: none;
  border-radius: var(--radius-full);
  cursor: pointer;
  font-size: 24px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition-normal) var(--ease-in-out);
  z-index: var(--z-popover);
}

.close-btn:hover {
  background: var(--bg-overlay);
  transform: scale(1.1);
}

/* Responsive tasarım */
@media (max-width: 768px) {
  .video-section {
    padding: var(--padding-xl) var(--padding-lg);
    width: 100%;
  }

  .video-header h2 {
    font-size: 2.5rem;
  }

  .upload-icon {
    font-size: 3rem;
  }

  .upload-text {
    font-size: 1.5rem;
  }
}

@media (max-width: 480px) {
  .video-section {
    padding: var(--padding-lg) var(--padding-sm);
    width: 100%;
  }

  .video-header h2 {
    font-size: 2rem;
  }

  .upload-icon {
    font-size: 2.5rem;
  }

  .upload-text {
    font-size: 1.2rem;
  }
}

/* Video kontrol stilleri */
.video-controls {
  padding: var(--padding-sm);
  background: rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-xl);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.control-item {
  display: flex;
  align-items: center;
  justify-content: center;
}

.control-label {
  display: flex;
  align-items: center;
  gap: var(--padding-sm);
  cursor: pointer;
  transition: var(--transition-normal) var(--ease-in-out);
  padding: var(--padding-sm) var(--padding-md);
  border-radius: var(--radius-lg);
}

.control-label:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

.control-checkbox {
  width: 20px;
  height: 20px;
  accent-color: var(--color-primary);
  cursor: pointer;
  transform: scale(1.2);
}

.control-text {
  font-family: var(--font-secondary);
  font-size: 1.1rem;
  font-weight: var(--font-weight-medium);
  color: var(--color-text);
  user-select: none;
}

/* Çok küçük ekranlar için */
@media (max-width: 360px) {
  .video-section {
    padding: var(--padding-lg) var(--padding-sm);
    width: 100%;
  }
}
</style>
