<template>
  <div :class="['page-container', { blurred: saveLoading }]">
    <div v-if="!allFetched">
      <LoadingProcess />
    </div>
    <div v-else>
      <HeroSection v-if="heroFetched" :editable="editable" @update:data="onHeroDataUpdate"
                   :hero_image="heroImage">

      </HeroSection>
      <div class="mt-16">
        <SpecialGallerySection v-if="specialGalleryFetched" :editable="editable"
                               @update:special_gallery_photos="handleSpecialGalleryPhotosUpdate"
                               :special_gallery_photos="specialGalleryPhotos"></SpecialGallerySection>
      </div>
      <div class="mt-16">
        <VideoSection v-if="videoFetched" :editable="editable"
                      @update:video="handleWeddingVideoUpdate"
                      :video="video"></VideoSection>
      </div>
      <div class="mt-16">
        <CounterSection></CounterSection>
      </div>
      <div class="mt-16">
        <CommonGalerySection v-if="commonGalleryFetched" :editable="editable"
                             @update:added_common_gallery_photos="handleAddedCommonGalleryPhotosUpdate"
                             @update:deleted_common_gallery_photos="handleDeletedCommonGalleryPhotosUpdate"
                             :common_gallery_photos="commonGalleryPhotos"></CommonGalerySection>
      </div>
      <div v-if="editable" class="mt-16">
        <SaveMemoriesSection @update:loading="onLoadingUpdate"
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
import { useRoute } from 'vue-router'
import { computed, onMounted, reactive, ref } from 'vue'
import axios from 'axios'


const route = useRoute()

const editable = ref(false)
if (route.path.startsWith('/upload/')) {
  editable.value = true
} else if (route.path.startsWith('/show/')) {
  editable.value = false
}

const saveLoading = ref(false)

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

const onHeroDataUpdate = (data) => {
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

const onLoadingUpdate = (isLoading: boolean) => {
  saveLoading.value = isLoading
}

const heroFetched = ref(false)
const specialGalleryFetched = ref(false)
const videoFetched = ref(false)
const commonGalleryFetched = ref(false)

const allFetched = computed(() =>
  heroFetched.value && specialGalleryFetched.value && videoFetched.value && commonGalleryFetched.value
)

const heroImage = ref<Photo | null>(null)
const specialGalleryPhotos = ref<Photo[]>([]) // Reactive ref olarak tanımlanmalı
const video = ref<Video[]>([]) // Reactive ref olarak tanımlanmalı
const commonGalleryPhotos = ref<Photo[]>([]) // Reactive ref olarak tanımlanmalı


onMounted(async () => {
  try {
    const response = await axios.get('http://localhost:8080/api/drive/files', {
      // headers: {
      //   Authorization: 'Bearer ' + token, // token varsa
      // },
      withCredentials: true // cookie ile auth kullanıyorsan
    })
    const files = response.data // Backend dosya listesi döndürmeli: [{name, url}, ...]


    const heroFile = files.find(
      (f: any) => f.name.startsWith('hero-image')
    )
    if (heroFile) {

      heroImage.value = {
        id: heroFile.id,
        name: heroFile.name,
        url: `https://lh3.googleusercontent.com/d/${heroFile.id}`
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

    const response2 = await axios.get('http://localhost:8080/api/drive/gallery-files', {
      // headers: {
      //   Authorization: 'Bearer ' + token, // token varsa
      // },
      withCredentials: true // cookie ile auth kullanıyorsan
    })
    const galleryFiles = response2.data // Backend dosya listesi döndürmeli: [{name, url}, ...]


    commonGalleryPhotos.value = galleryFiles.map((f: any) => ({
      id: f.id,
      name: f.name,
      url: `https://lh3.googleusercontent.com/d/${f.id}`
    }))

  } catch (err) {
    console.error('Drive dosya çekme hatası:', err)
    memoriesData.hero.image = null
  } finally {
    heroFetched.value = true
    specialGalleryFetched.value = true
    videoFetched.value = true
    commonGalleryFetched.value = true
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
