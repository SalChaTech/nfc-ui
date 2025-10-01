<script setup lang="ts">
import { ref, onMounted } from 'vue'
import evlilikVideo from '../assets/say_yes.mp4'

const videoRef = ref(null)
const isPlaying = ref(false)
const videoFile = ref(null)
const showModal = ref(false)

// Editable title
const title = ref('Ölümsüz An')
const isEditingTitle = ref(false)
const titleRef = ref(null)

// Sayfa yüklendiğinde default video'yu yükle
onMounted(() => {
  videoFile.value = evlilikVideo
})

function handleVideoUpload(event: any) {
  const file = event.target.files[0]
  if (file && file.type.startsWith('video/')) {
    videoFile.value = URL.createObjectURL(file)
  }
}

function triggerVideoUpload() {
  if (videoRef.value) {
    videoRef.value.click()
  }
}

function togglePlay() {
  const video = document.querySelector('.video-player') as HTMLVideoElement
  if (video) {
    if (isPlaying.value) {
      video.pause()
    } else {
      video.play()
    }
    isPlaying.value = !isPlaying.value
  }
}

function onVideoEnded() {
  isPlaying.value = false
}

function openVideoModal() {
  showModal.value = true
}

function closeVideoModal() {
  showModal.value = false
}

function removeVideo() {
  videoFile.value = null
  showModal.value = false
}

function handleVideoClick(event: Event) {
  // Sadece mobilde modal aç
  if (window.innerWidth <= 768) {
    event.preventDefault()
    openVideoModal()
  }
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
</script>

<template>
  <div class="video-section">
    <div class="video-header">
      <h2 class="editable" @click="editTitle" @blur="saveTitle" @keydown.enter="saveTitle"
        :contenteditable="isEditingTitle" ref="titleRef">{{ title }}</h2>
    </div>

    <!-- Video oynatıcı -->
    <div v-if="videoFile" class="video-wrapper">
      <video class="video-player" :src="videoFile" @ended="onVideoEnded" @play="isPlaying = true"
        @pause="isPlaying = false" controls preload="metadata" @click="handleVideoClick">
        Tarayıcınız video oynatmayı desteklemiyor.
      </video>

      <!-- Video silme butonu -->
      <button class="remove-btn" @click="removeVideo" title="Videoyu sil">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14zM10 11v6M14 11v6"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>
    </div>

    <!-- Video yükleme alanı -->
    <div v-else class="video-upload-area" @click="triggerVideoUpload">
      <div class="upload-content">
        <div class="upload-icon">+</div>
        <div class="upload-text">Video Yükle</div>
      </div>
    </div>

    <!-- Gizli dosya input -->
    <input type="file" ref="videoRef" @change="handleVideoUpload" accept="video/*" style="display: none;" />

    <!-- Video modal -->
    <div v-if="showModal" class="video-modal" @click="closeVideoModal">
      <div class="modal-content" @click.stop>
        <button class="close-btn" @click="closeVideoModal">&times;</button>
        <video class="modal-video" :src="videoFile" controls autoplay>
          Tarayıcınız video oynatmayı desteklemiyor.
        </video>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Font import'ları artık theme.css'de */

.video-section {
  background: var(--gradient-primary);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--padding-4xl) var(--padding-lg);
  width: 100%;
}

.video-header {
  text-align: center;
  margin-bottom: var(--padding-xl);
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
  z-index: var(--z-tooltip);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.video-wrapper:hover .remove-btn {
  opacity: 1;
}

.remove-btn:hover {
  background: var(--color-danger);
  transform: scale(1.1);
}

.remove-btn:hover svg {
  stroke: white;
}

.remove-btn svg {
  width: var(--size-md);
  height: var(--size-md);
  stroke: var(--color-danger);
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

  0%,
  100% {
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

/* Çok küçük ekranlar için */
@media (max-width: 360px) {
  .video-section {
    padding: var(--padding-lg) var(--padding-sm);
    width: 100%;
  }
}
</style>
