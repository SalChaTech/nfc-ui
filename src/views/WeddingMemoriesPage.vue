<template>
  <div :class="['page-container', { blurred: saveLoading }]">
    <div v-if="!allFetched">
      <LoadingProcess />
    </div>
    <div v-else>
      <HeroSection :editable="editable" @update:data="handleHeroDataUpdate"
                   :hero_image="heroImage" :female-name="femaleName"
                   :male-name="maleName"
                   :date="date">

      </HeroSection>
      <div class="mt-16">
        <SpecialGallerySection :editable="editable"
                               @update:special_gallery_photos="handleSpecialGalleryPhotosUpdate"
                               :special_gallery_photos="specialGalleryPhotos"></SpecialGallerySection>
      </div>
      <div class="mt-16">
        <VideoSection :editable="editable"
                      @update:video="handleWeddingVideoUpdate"
                      :video="video"></VideoSection>
      </div>
      <div class="mt-16">
        <CounterSection></CounterSection>
      </div>
      <div class="mt-16">
        <CommonGalerySection :editable="editable"
                             @update:added_common_gallery_photos="handleAddedCommonGalleryPhotosUpdate"
                             @update:deleted_common_gallery_photos="handleDeletedCommonGalleryPhotosUpdate"
                             :common_gallery_photos="commonGalleryPhotos"></CommonGalerySection>
      </div>
      <div v-if="editable" class="mt-16">
        <SaveMemoriesSection @update:loading="handleLoadingUpdate"
                             :memoriesData="memoriesData"></SaveMemoriesSection>
      </div>
    </div>

    <div v-if="saveLoading">
      <LoadingProcess />
    </div>

  </div>
</template>

<script setup lang="ts">
import LoadingProcess from '../components/LoadingProcess.vue'
import HeroSection from '../components/wedding-memories-components/HeroSection.vue'
import SpecialGallerySection
  from '../components/wedding-memories-components/SpecialGallerySection.vue'
import CommonGalerySection from '@/components/wedding-memories-components/CommonGalerySection.vue'
import VideoSection from '@/components/wedding-memories-components/VideoSection.vue'
import CounterSection from '@/components/wedding-memories-components/CounterSection.vue'
import SaveMemoriesSection from '@/components/wedding-memories-components/SaveMemoriesSection.vue'
import { useRoute, useRouter } from 'vue-router'
import { computed, onMounted, reactive, ref } from 'vue'
import axios from 'axios'
import { API_ENDPOINTS } from '../config/apiEndpoints'
import { useToast } from 'vue-toastification'

const toast = useToast()
const route = useRoute()
const router = useRouter()

const saveLoading = ref(false)
const editable = ref(false)

const metaFetched = ref(false)
const driveFilesFetched = ref(false)
const allFetched = computed(() =>
  metaFetched.value && driveFilesFetched.value
)

const heroImage = ref<Photo | null>(null)
const femaleName = ref('')
const maleName = ref('')
const date = ref('')
const specialGalleryPhotos = ref<Photo[]>([]) // Reactive ref olarak tanımlanmalı
const video = ref<Video[]>([]) // Reactive ref olarak tanımlanmalı
const commonGalleryPhotos = ref<Photo[]>([]) // Reactive ref olarak tanımlanmalı


interface Photo {
  id: string | null;
  name: string | null;
  url: string | null;
}

interface Video {
  id: string | null;
  name: string | null;
  url: string | null;
}

const memoriesData = reactive({
  hero: {
    names: { first: '', second: '' },
    date: '',
    image: null as Photo | null
  },
  specialGalleryPhotos: [] as Photo[],
  addedCommonGalleryPhotos: [] as Photo[],
  deletedCommonGalleryPhotos: [] as Photo[],
  weddingVideo: null as Video | null
})

function handleHeroDataUpdate(data) {
  if (data.names !== undefined) {
    memoriesData.hero.names = data.names
  }
  if (data.date !== undefined) {
    memoriesData.hero.date = data.date
  }
  if (data.image !== undefined) {
    memoriesData.hero.image = data.image
  }
}

function handleSpecialGalleryPhotosUpdate(updatedPhotos: any[]) {
  memoriesData.specialGalleryPhotos = updatedPhotos
}

function handleWeddingVideoUpdate(updatedVideo: Video | null) {
  memoriesData.weddingVideo = updatedVideo
}

function handleAddedCommonGalleryPhotosUpdate(updatedPhotos: any[]) {
  memoriesData.addedCommonGalleryPhotos = updatedPhotos
}

function handleDeletedCommonGalleryPhotosUpdate(updatedPhotos: any[]) {
  memoriesData.deletedCommonGalleryPhotos = updatedPhotos
}

function handleLoadingUpdate(isLoading: boolean) {
  saveLoading.value = isLoading
}


const fetchHeroMeta = async () => {
  try {

    const api = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL
    })


    const response = await api.get(API_ENDPOINTS.WEDDING_MEMORY_DATA.GET_BY_PRODUCT_ID(route.params.id))

    femaleName.value = response.data.femaleName
    maleName.value = response.data.maleName
    date.value = response.data.date

  } catch (error) {
    toast.error('Kayıtlara ulaşılamadı!')
    console.error('Get Wedding Memories Error : ', error)
  } finally {
    metaFetched.value = true
  }
}

const fetchDriveFiles = async () => {
  try {

    const api = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL
    })
    const driveApplicationFolderIdResponse = await api.get(API_ENDPOINTS.USER_PRODUCT.GET_BY_ID(route.params.id))

    const driveApplicationFolderId = driveApplicationFolderIdResponse.data.driveApplicationFolderId

    if (driveApplicationFolderId) {
      const response = await api.get(API_ENDPOINTS.DRIVE.GET_FILES(driveApplicationFolderId))
      const files = response.data // Backend dosya listesi döndürmeli: [{name, url}, ...]


      const heroFile = files.find(
        (f: any) => f.name.startsWith('hero-image')
      )
      if (heroFile) {

        heroImage.value = {
          id: heroFile.id,
          name: heroFile.name,
          url: `https://lh3.googleusercontent.com/d/${heroFile.id}?t=${new Date().getTime()}`
        }
      }

      const special1Photo = files.find(
        (f: any) => f.name.startsWith('special-1-image')
      )
      specialGalleryPhotos.value.push(special1Photo ? {
        id: special1Photo.id,
        name: special1Photo.name,
        url: `https://lh3.googleusercontent.com/d/${special1Photo.id}?t=${new Date().getTime()}`
      } : null)
      const special2Photo = files.find(
        (f: any) => f.name.startsWith('special-2-image')
      )
      specialGalleryPhotos.value.push(special2Photo ? {
        id: special2Photo.id,
        name: special2Photo.name,
        url: `https://lh3.googleusercontent.com/d/${special2Photo.id}?t=${new Date().getTime()}`
      } : null)
      const special3Photo = files.find(
        (f: any) => f.name.startsWith('special-3-image')
      )
      specialGalleryPhotos.value.push(special3Photo ? {
        id: special3Photo.id,
        name: special3Photo.name,
        url: `https://lh3.googleusercontent.com/d/${special3Photo.id}?t=${new Date().getTime()}`
      } : null)

      const videoFile = files.find(
        (f: any) => f.name.startsWith('video')
      )
      if (videoFile) {

        video.value = {
          id: videoFile.id,
          name: videoFile.name,
          url: `https://lh3.googleusercontent.com/d/${videoFile.id}?t=${new Date().getTime()}`
        }
      }

      const gallerFolder = files.find(
        (f: any) => f.name.startsWith('Gallery')
      )
      if (gallerFolder) {

        const gallerFolderId = gallerFolder.id

        const response = await api.get(API_ENDPOINTS.DRIVE.GET_FILES(gallerFolderId))

        const galleryFiles = response.data // Backend dosya listesi döndürmeli: [{name, url}, ...]


        commonGalleryPhotos.value = galleryFiles.map((f: any) => ({
          id: f.id,
          name: f.name,
          url: `https://lh3.googleusercontent.com/d/${f.id}?t=${new Date().getTime()}`
        }))
      }


    }


  } catch (err) {
    toast.error('Kayıtlara ulaşılamadı!')

    console.error('Drive dosya çekme hatası:', err)
    memoriesData.hero.image = null
  } finally {
    driveFilesFetched.value = true
  }
}


onMounted(async () => {

  if (route.path.startsWith('/upload/')) {
    try {
      const api = axios.create({
        baseURL: import.meta.env.VITE_API_BASE_URL,
        withCredentials: true
      })
      const id = route.params.id
      const response = await api.put(API_ENDPOINTS.USER_PRODUCT.CLAIM_PRODUCT(id))
      console.log('Claim Product Response : ', response)
      if (response.data.folder_id !== '') {
        await fetchDriveFiles()
        await fetchHeroMeta()
        saveLoading.value = false

      } else {
        await fetchHeroMeta()
        driveFilesFetched.value = true
        saveLoading.value = false

      }

    } catch (error) {
      console.error('Claim Product Error : ', error)
      router.push({ name: 'NotFound' })
    }

    editable.value = true


  } else if (route.path.startsWith('/show/')) {
    await fetchDriveFiles()
    await fetchHeroMeta()
    editable.value = false
  }

})


</script>

<style scoped>
.page-container.blurred {
  filter: blur(4px);
  pointer-events: none; /* blur sırasında tıklamayı engelle */
  user-select: none;
}

.page-container {
  min-width: 100%;
  max-width: 100%;
  margin: 0;
  padding: 0;
  background: var(--gradient-primary);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.page-container > * {
  margin-bottom: 24px;
}

.page-container > *:last-child {
  margin-bottom: 0;
}

/* Desktop'ta mobil genişliğinde göster */
@media (min-width: 769px) {
  .page-container {
    max-width: 480px;
    margin: 0 auto;
    box-shadow: 0 0 20px var(--shadow-light);
  }
}


</style>
