<script setup lang="ts">
import { computed, ref } from 'vue'
import axios from 'axios'

interface Video {
  id: string | null
  name: string | null
  url: string | null
}

interface Photo {
  id: string | null
  name: string | null
  url: string | null
}

const props = defineProps<{
  memoriesData: {
    hero: {
      names: { first: string; second: string }
      date: string
      image: Photo  // Hero image artık Photo tipi olacak
      id?: string
    }
    specialGalleryPhotos: Photo[]  // Bu da bir Photo array olacak
    addedCommonGalleryPhotos: any[]  // Burası sizin ihtiyaçlarınıza göre değişebilir
    deletedCommonGalleryPhotos: any[]  // Burası sizin ihtiyaçlarınıza göre değişebilir
    weddingVideo: Video
  }
}>()

const emit = defineEmits<{
  (e: 'update:loading', value: boolean): void
}>()

const loading = ref(false)
const showSuccessAlert = ref(false)
const showErrorAlert = ref(false)

const uploadFileToDrive = async (file: Photo | Video, toSubfolder = false) => {
  if (!file || !file.url) return

  // 1. Fetch ve blob
  const res = await fetch(file.url)
  const blob = await res.blob()

  // 2. Dosya adı ve uzantı kontrolü
  let fileName = file.name || 'untitled'
  if (!fileName.includes('.') && blob.type) {
    const extension = '.' + blob.type.split('/')[1]
    fileName += extension
  }

  // 3. FormData oluştur
  const formData = new FormData()
  formData.append('file', new File([blob], fileName, { type: blob.type }))
  if (file.id) formData.append('fileId', file.id)
  if (toSubfolder) formData.append('toUploadSubfolder', 'true')

  // 4. Upload
  const response = await axios.post('http://localhost:8080/api/drive/upload', formData, {
    withCredentials: true,
    headers: { 'Content-Type': 'multipart/form-data' }
  })

  console.log('Başarıyla yüklendi:', fileName, response.data)
  return response.data
}

const uploadToDrive = async () => {
  try {
    loading.value = true
    emit('update:loading', true)

    if (props.memoriesData.hero.image) {
      await uploadFileToDrive(props.memoriesData.hero.image)
    }

    // Special gallery
    for (const photo of props.memoriesData.specialGalleryPhotos) {
      if (photo) await uploadFileToDrive(photo)
    }

    // Wedding video
    if (props.memoriesData.weddingVideo) {
      await uploadFileToDrive(props.memoriesData.weddingVideo)
    }

    // Added common gallery (opsiyonel subfolder)
    for (const photo of props.memoriesData.addedCommonGalleryPhotos) {
      if (photo) await uploadFileToDrive(photo, true)
    }

    console.log('Tüm dosyalar yüklendi!')

    if (props.memoriesData.deletedCommonGalleryPhotos != undefined) {
      for (const photo of props.memoriesData.deletedCommonGalleryPhotos) {
        const file = photo
        const response = await axios.delete(`http://localhost:8080/api/drive/files/${file.id}`, {
          withCredentials: true
        })
        console.log('Başarıyla silindi:', response.data)
      }
    }
  } catch (error) {
    console.error('Yükleme hatası:', error)

    // Hata durumunda error alert göster
    showErrorAlert.value = true

    // 5 saniye sonra alert'i kapat
    setTimeout(() => {
      showErrorAlert.value = false
    }, 5000)
  } finally {
    loading.value = false
    emit('update:loading', false)

    // Başarılı yükleme sonrası alert göster (sadece hata yoksa)
    if (!showErrorAlert.value) {
      showSuccessAlert.value = true

      // 5 saniye sonra alert'i kapat
      setTimeout(() => {
        showSuccessAlert.value = false
      }, 5000)
    }
  }
}

</script>

<template>
  <div>
    <button @click="uploadToDrive" class="upload-button">
      <div class="button-content">
        <svg class="button-icon" width="24" height="24" viewBox="0 0 24 24" fill="none"
             xmlns="http://www.w3.org/2000/svg">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" stroke-width="2"
                stroke-linecap="round" stroke-linejoin="round" />
          <polyline points="7,10 12,15 17,10" stroke="currentColor" stroke-width="2"
                    stroke-linecap="round" stroke-linejoin="round" />
          <line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" stroke-width="2"
                stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <span class="button-text">Yayınla</span>
      </div>
    </button>
    <div v-if="showSuccessAlert" class="alert-container">
      <v-alert
        type="success"
        variant="outlined"
        transition="fade"
      >
        Fotoğraflar başarıyla yayınlandı!
      </v-alert>
    </div>

    <div v-if="showErrorAlert" class="alert-container">
      <v-alert
        type="error"
        variant="outlined"
        transition="fade"
      >
        Yükleme sırasında bir hata oluştu. Lütfen tekrar deneyin.
      </v-alert>
    </div>
  </div>
</template>

<style scoped>
.upload-button {
  width: 75%;
  height: 60px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border: none;
  border-radius: 16px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 15px rgba(16, 185, 129, 0.2);
  margin: 20px auto;
  display: block;
}

.upload-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.upload-button:hover::before {
  left: 100%;
}

.upload-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(16, 185, 129, 0.25);
}

.upload-button:active {
  transform: translateY(-1px);
  box-shadow: 0 3px 12px rgba(16, 185, 129, 0.2);
}

.button-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  height: 100%;
  position: relative;
  z-index: 2;
}

.button-icon {
  color: white;
  transition: transform 0.3s ease;
}

.upload-button:hover .button-icon {
  transform: scale(1.1) rotate(5deg);
}

.button-text {
  color: white;
  font-size: 1.3rem;
  font-weight: 800;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
}

.upload-button:hover .button-text {
  transform: translateX(2px);
}

/* Responsive */
@media (max-width: 768px) {
  .upload-button {
    width: 85%;
    height: 55px;
  }

  .button-text {
    font-size: 1.2rem;
  }
}

@media (max-width: 480px) {
  .upload-button {
    width: 90%;
    height: 50px;
  }

  .button-text {
    font-size: 1.1rem;
  }

  .button-icon {
    width: 20px;
    height: 20px;
  }
}

.alert-container {
  width: 75%;
  margin: 20px auto;
  display: block;
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive alert */
@media (max-width: 768px) {
  .alert-container {
    width: 85%;
  }
}

@media (max-width: 480px) {
  .alert-container {
    width: 90%;
  }
}
</style>
