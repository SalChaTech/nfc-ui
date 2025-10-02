<template>
  <div class="page-container">
    <HeroSection v-if="heroFetched" :editable="editable" @update:data="onHeroDataUpdate"
                 :hero_image="heroImage">

    </HeroSection>
    <SpecialGallerySection :editable="editable"
                           @update:special_gallery_photos="handleSpecialGalleryPhotosUpdate"
                           :special_gallery_photos="specialGalleryPhotos"></SpecialGallerySection>
    <VideoSection :editable="editable" @update:video="handleWeddingVideoUpdate"></VideoSection>
    <CounterSection></CounterSection>
    <CommonGalerySection :editable="editable"
                         @update:special_gallery_photos="handleCommonGalleryPhotosUpdate"></CommonGalerySection>
    <SaveMemoriesSection :memoriesData="memoriesData"></SaveMemoriesSection>
  </div>
</template>

<script setup lang="ts">
import HeroSection from '../components/HeroSection.vue'
import SpecialGallerySection from '../components/SpecialGallerySection.vue'
import CommonGalerySection from '@/components/CommonGalerySection.vue'
import VideoSection from '@/components/VideoSection.vue'
import CounterSection from '@/components/CounterSection.vue'
import SaveMemoriesSection from '@/components/SaveMemoriesSection.vue'
import { useRoute } from 'vue-router'
import { onMounted, reactive, ref } from 'vue'
import axios from 'axios'


const route = useRoute()

const editable = ref(false)
if (route.path.startsWith('/upload/')) {
  editable.value = true
} else if (route.path.startsWith('/show/')) {
  editable.value = false
}

interface Photo {
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
  commonGalleryPhotos: [] as any[],
  weddingVideo: null as string | null
})

const onHeroDataUpdate = (data) => {
  memoriesData.hero.names = data.names
  memoriesData.hero.date = data.date
  memoriesData.hero.image = data.image
}


function handleSpecialGalleryPhotosUpdate(updatedPhotos: any[]) {
  memoriesData.specialGalleryPhotos = updatedPhotos
}


function handleWeddingVideoUpdate(updatedVideo: string | null) {
  memoriesData.weddingVideo = updatedVideo
}


function handleCommonGalleryPhotosUpdate(updatedPhotos: any[]) {
  memoriesData.commonGalleryPhotos = updatedPhotos
}

const heroFetched = ref(false)

const heroImage = ref<Photo | null>(null)
const specialGalleryPhotos = ref<Photo[]>([]) // Reactive ref olarak tanımlanmalı


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
      (f: any) => f.name.toLowerCase() === 'hero.jpg' || f.name.toLowerCase() === 'hero.png'
    )
    if (heroFile) {
      heroImage.value = {
        id: heroFile.id,
        name: heroFile.name,
        url: `https://lh3.googleusercontent.com/d/${heroFile.id}`
      }
    }

    const special1Photo = files.find(
      (f: any) => f.name.toLowerCase() === 'special-1.png'
    )
    specialGalleryPhotos.value.push(special1Photo ? {
      id: special1Photo.id,
      name: special1Photo.name,
      url: `https://lh3.googleusercontent.com/d/${special1Photo.id}`
    } : null)
    const special2Photo = files.find(
      (f: any) => f.name.toLowerCase() === 'special-2.png'
    )
    specialGalleryPhotos.value.push(special2Photo ? {
      id: special2Photo.id,
      name: special2Photo.name,
      url: `https://lh3.googleusercontent.com/d/${special2Photo.id}`
    } : null)
    const special3Photo = files.find(
      (f: any) => f.name.toLowerCase() === 'special-3.png'
    )
    specialGalleryPhotos.value.push(special3Photo ? {
      id: special3Photo.id,
      name: special3Photo.name,
      url: `https://lh3.googleusercontent.com/d/${special3Photo.id}`
    } : null)


  } catch (err) {
    console.error('Drive dosya çekme hatası:', err)
    memoriesData.hero.image = null
  } finally {
    heroFetched.value = true
  }
})


</script>

<style scoped>
.page-container {
  max-width: 100%;
  margin: 0;
  padding: 0;
  background: var(--gradient-primary);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Desktop'ta mobil genişliğinde göster */
@media (min-width: 769px) {
  .page-container {
    max-width: 480px;
    margin: 0 auto;
    box-shadow: 0 0 20px var(--shadow-light);
  }
}

/* Component arası boşlukları kaldır ve arka planları sıfırla */
.page-container > * {
  margin: 0;
  border-radius: 0;
  background: transparent !important;
}

/* Hero section yüksekliği */
.page-container > *:first-child {
  height: 75vh;
  min-height: 75vh;
}

/* İlk component hariç üst margin ekle */
.page-container > *:not(:first-child) {
  margin-top: 0;
}

/* Mobil uyumluluk için */
@media (max-width: 768px) {
  .page-container {
    padding: 0;
  }
}
</style>
