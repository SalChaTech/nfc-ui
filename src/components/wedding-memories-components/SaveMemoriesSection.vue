<template>
  <div>
    <button @click="uploadChanges" class="upload-button">
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
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import axios from 'axios'
import { API_ENDPOINTS } from '../../config/apiEndpoints'

import { useRoute } from 'vue-router'
import { useToast } from 'vue-toastification'

const toast = useToast()
const route = useRoute()

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

const uploadedAtLeastOneFile = ref(null)
const applicationFolderId = ref(null)
const loading = ref(false)

const hasNames = computed(() => {
  const names = props.memoriesData?.hero?.names;
  return names?.first?.trim() || names?.second?.trim();
});


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
  const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true
  })

  const response = await api.post(API_ENDPOINTS.DRIVE.UPLOAD_FILE, formData, {
    withCredentials: true,
    headers: { 'Content-Type': 'multipart/form-data' }
  })

  uploadedAtLeastOneFile.value = true
  return response.data
}

const uploadChanges = async () => {
  try {
    loading.value = true
    emit('update:loading', true)


    if (hasNames.value) {
      const api = axios.create({
        baseURL: import.meta.env.VITE_API_BASE_URL,
        withCredentials: true
      })

      const firstName = props.memoriesData.hero.names.first
      const secondName = props.memoriesData.hero.names.second
      const requestBody = {
        maleName: secondName,       // değişecekse gönder
        femaleName: firstName,      // değişecekse gönder
        date: null       // değişecekse gönder
      }

      const response = await api.put(API_ENDPOINTS.WEDDING_MEMORY_DATA.UPDATE(route.params.id), requestBody)
    }

    if (props.memoriesData?.hero?.date?.trim()) {
      const api = axios.create({
        baseURL: import.meta.env.VITE_API_BASE_URL,
        withCredentials: true
      })

      const date = props.memoriesData.hero.date
      const requestBody = {
        maleName: null,       // değişecekse gönder
        femaleName: null,      // değişecekse gönder
        date: date       // değişecekse gönder
      }

      await api.put(API_ENDPOINTS.WEDDING_MEMORY_DATA.UPDATE(route.params.id), requestBody)
    }

    if (props.memoriesData.hero.image) {
      const response = await uploadFileToDrive(props.memoriesData.hero.image)
      applicationFolderId.value = response.folderId
    }

    // Special gallery
    for (const photo of props.memoriesData.specialGalleryPhotos) {
      if (photo) {
        const response = await uploadFileToDrive(photo)
        applicationFolderId.value = response.folderId
      }
    }

    // Wedding video
    if (props.memoriesData.weddingVideo) {
      const response = await uploadFileToDrive(props.memoriesData.weddingVideo)
      applicationFolderId.value = response.folderId
    }

    // Added common gallery (opsiyonel subfolder)
    for (const photo of props.memoriesData.addedCommonGalleryPhotos) {
      if (photo) {
        const response = await uploadFileToDrive(photo, true)
        applicationFolderId.value = response.folderId
      }
    }


    if (props.memoriesData.deletedCommonGalleryPhotos != undefined) {
      for (const photo of props.memoriesData.deletedCommonGalleryPhotos) {
        const file = photo
        const api = axios.create({
          baseURL: import.meta.env.VITE_API_BASE_URL
        })

        const response = await api.delete(API_ENDPOINTS.DRIVE.DELETE_FILE(file.id), {
          withCredentials: true
        })
      }
    }

    if (uploadedAtLeastOneFile.value) {
      const api = axios.create({
        baseURL: import.meta.env.VITE_API_BASE_URL,
        withCredentials: true
      })

      const requestBody = {
        folderId: applicationFolderId.value
      }

      await api.put(
        API_ENDPOINTS.USER_PRODUCT.UPDATE_FOLDER_ID(route.params.id), requestBody)

    }

    toast.info('Yükleme işlemi başarılı!')

  } catch (error) {
    toast.error('Yükleme işlemi başarısız!\n'+error.response.data.message)
    console.error('Yükleme hatası:', error)

  } finally {
    loading.value = false
    emit('update:loading', false)
  }
}

</script>

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
