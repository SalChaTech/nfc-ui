<script setup lang="ts">
import { ref } from 'vue'

const videoRef = ref(null)
const isPlaying = ref(false)
const videoFile = ref(null)
const showModal = ref(false)

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
  const video = document.querySelector('.video-player')
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
</script>

<template>
  <div class="video-section">
    <div class="video-header">
      <h2>Ölümsüz An</h2>
    </div>
    
    <div class="video-container">
      <!-- Video oynatıcı -->
      <div v-if="videoFile" class="video-wrapper">
        <video 
          class="video-player"
          :src="videoFile"
          @ended="onVideoEnded"
          @play="isPlaying = true"
          @pause="isPlaying = false"
          controls
          preload="metadata"
          @click="handleVideoClick"
        >
          Tarayıcınız video oynatmayı desteklemiyor.
        </video>
        
        <!-- Video silme butonu -->
        <button 
          class="remove-btn" 
          @click="removeVideo"
          title="Videoyu sil"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14zM10 11v6M14 11v6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
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
      <input 
        type="file" 
        ref="videoRef"
        @change="handleVideoUpload"
        accept="video/*"
        style="display: none;"
      />
    </div>
    
    <!-- Video modal -->
    <div v-if="showModal" class="video-modal" @click="closeVideoModal">
      <div class="modal-content" @click.stop>
        <button class="close-btn" @click="closeVideoModal">&times;</button>
        <video 
          class="modal-video"
          :src="videoFile"
          controls
          autoplay
        >
          Tarayıcınız video oynatmayı desteklemiyor.
        </video>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap');

.video-section {
  padding: 60px 20px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.video-header {
  text-align: center;
  margin-bottom: 40px;
}

.video-header h2 {
  font-family: 'Dancing Script', cursive;
  font-size: 3.5rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
}

.video-container {
  width: 100%;
  max-width: 800px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  position: relative;
}

.video-wrapper {
  position: relative;
  width: 100%;
  aspect-ratio: 16/9;
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

.video-wrapper:hover .remove-btn {
  opacity: 1;
}

.remove-btn:hover {
  background: #dc3545;
  transform: scale(1.1);
}

.remove-btn:hover svg {
  stroke: white;
}

.remove-btn svg {
  width: 16px;
  height: 16px;
  stroke: #dc3545;
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
  background: #f8f9fa;
  border: 2px dashed #dee2e6;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.video-upload-area:hover {
  border-color: #adb5bd;
  background: #e9ecef;
}

.upload-content {
  text-align: center;
  color: #6c757d;
  z-index: 10;
  position: relative;
}

.upload-icon {
  font-size: 4rem;
  margin-bottom: 20px;
  animation: pulse 2s infinite;
}

.upload-text {
  font-family: 'Playfair Display', serif;
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 0;
  color: #495057;
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
  background: black;
  border-radius: 15px;
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
  width: 40px;
  height: 40px;
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
  z-index: 1001;
}

.close-btn:hover {
  background: rgba(0, 0, 0, 0.9);
  transform: scale(1.1);
}

/* Responsive tasarım */
@media (max-width: 768px) {
  .video-section {
    padding: 40px 15px;
  }
  
  .video-header h2 {
    font-size: 2.5rem;
  }
  
  .video-container {
    max-width: 100%;
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
    padding: 30px 10px;
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
</style>
