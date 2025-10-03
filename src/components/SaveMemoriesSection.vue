<script setup lang="ts">
import { computed } from 'vue'
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


const uploadToDrive = async () => {
  try {
    const filesToUpload = []

    console.log('hero : ', props.memoriesData.hero.image)
    console.log('hero : ', props.memoriesData.hero.names)
    console.log('special-1 : ', props.memoriesData.specialGalleryPhotos[0])
    console.log('special-2 : ', props.memoriesData.specialGalleryPhotos[1])
    console.log('special-3 : ', props.memoriesData.specialGalleryPhotos[1])
    console.log('video : ', props.memoriesData.weddingVideo?.name)
    console.log('added common gallery : ', props.memoriesData.addedCommonGalleryPhotos)
    console.log('deleted common gallery : ', props.memoriesData.deletedCommonGalleryPhotos)

    if (props.memoriesData.hero.image != undefined) {
      const file = props.memoriesData.hero.image
      const res = await fetch(file.url)
      const blob = await res.blob()
      let fileName = file.name || 'untitled'
      if (!fileName.includes('.')) {
        // Eğer uzantı yoksa blob.type'dan al
        const extension = blob.type ? '.' + blob.type.split('/')[1] : ''
        fileName += extension
      }
      const uploadFile = new File([blob], fileName, { type: blob.type })
      const formData = new FormData()
      formData.append('file', uploadFile)
      if (file.id) formData.append('fileId', file.id)
      // formData.append('toUploadSubfolder', true)
      const response = await axios.post('http://localhost:8080/api/drive/upload', formData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      console.log('Başarıyla yüklendi:', file.fileName, response.data)

    }

    if (props.memoriesData.specialGalleryPhotos != undefined) {
      for (const photo of props.memoriesData.specialGalleryPhotos) {
        const file = photo
        const res = await fetch(file.url)
        const blob = await res.blob()
        let fileName = file.name || 'untitled'
        if (!fileName.includes('.')) {
          // Eğer uzantı yoksa blob.type'dan al
          const extension = blob.type ? '.' + blob.type.split('/')[1] : ''
          fileName += extension
        }
        const uploadFile = new File([blob], fileName, { type: blob.type })
        const formData = new FormData()
        formData.append('file', uploadFile)
        if (file.id) formData.append('fileId', file.id)
        // formData.append('toUploadSubfolder', true)
        const response = await axios.post('http://localhost:8080/api/drive/upload', formData, {
          withCredentials: true,
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        console.log('Başarıyla yüklendi:', file.fileName, response.data)
      }
    }

    if (props.memoriesData.weddingVideo != undefined) {
      const file = props.memoriesData.weddingVideo
      const res = await fetch(file.url)
      const blob = await res.blob()
      let fileName = file.name || 'untitled'
      if (!fileName.includes('.')) {
        // Eğer uzantı yoksa blob.type'dan al
        const extension = blob.type ? '.' + blob.type.split('/')[1] : ''
        fileName += extension
      }
      const uploadFile = new File([blob], fileName, { type: blob.type })
      const formData = new FormData()
      formData.append('file', uploadFile)
      if (file.id) formData.append('fileId', file.id)
      // formData.append('toUploadSubfolder', true)
      const response = await axios.post('http://localhost:8080/api/drive/upload', formData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      console.log('Başarıyla yüklendi:', file.fileName, response.data)

    }


    if (props.memoriesData.addedCommonGalleryPhotos != undefined) {
      for (const photo of props.memoriesData.addedCommonGalleryPhotos) {
        const file = photo
        const res = await fetch(file.url)
        const blob = await res.blob()
        let fileName = file.name || 'untitled'
        if (!fileName.includes('.')) {
          // Eğer uzantı yoksa blob.type'dan al
          const extension = blob.type ? '.' + blob.type.split('/')[1] : ''
          fileName += extension
        }
        const uploadFile = new File([blob], fileName, { type: blob.type })
        const formData = new FormData()
        formData.append('file', uploadFile)
        if (file.id) formData.append('fileId', file.id)
        formData.append('toUploadSubfolder', true)
        const response = await axios.post('http://localhost:8080/api/drive/upload', formData, {
          withCredentials: true,
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        console.log('Başarıyla yüklendi:', file.fileName, response.data)
      }
    }

    if (props.memoriesData.deletedCommonGalleryPhotos != undefined) {
      for (const photo of props.memoriesData.deletedCommonGalleryPhotos) {
        const file = photo
        const response = await axios.delete(`http://localhost:8080/api/drive/files/${file.id}`,  {
          withCredentials: true,
        })
        console.log('Başarıyla silindi:', response.data)
      }
    }


    // const file = props.memoriesData.hero.image
    // const res = await fetch(file.url)
    // const blob = await res.blob()
    // const uploadFile = new File([blob], file.name, { type: blob.type })
    //
    // const formData = new FormData()
    // formData.append('file', uploadFile)
    // if (file.fileId) formData.append('fileId', file.id)
    // formData.append('toUploadSubfolder', true)
    //
    // const response = await axios.post('http://localhost:8080/api/drive/upload', formData, {
    //   withCredentials: true,
    //   headers: { 'Content-Type': 'multipart/form-data' }
    // })
    // console.log('Başarıyla yüklendi:', file.fileName, response.data)

    //   // --- Hero image ---
    //   if (props.memoriesData.hero.image.source) {
    //     console.log('Dosyalar1:', props.memoriesData.hero.image)
    //
    //     filesToUpload.push({ fileName: 'hero.png', dataUrl: props.memoriesData.hero.image , fileId: props.memoriesData.hero.id})
    //   }
    //
    //   // --- Special Gallery ---
    //   props.memoriesData.specialGalleryPhotos.forEach((photo, index) => {
    //     if (photo.source) {
    //       console.log('Dosyalar2:', photo)
    //
    //       filesToUpload.push({ fileName: `special-${index + 1}.png`, dataUrl: photo.source ,fileId: photo.id})
    //     }
    //   })
    //
    //   // --- Common Gallery (isteğe bağlı) ---
    //   props.memoriesData.commonGalleryPhotos.forEach((photo, index) => {
    //     if (photo.url) {
    //       filesToUpload.push({ fileName: `common-${index + 1}.png`, dataUrl: photo.url })
    //     }
    //   })
    //
    //   // --- Upload işlemi ---
    //   for (const file of filesToUpload) {
    //     // base64 veya URL ise Blob'a çevir
    //     const res = await fetch(file.dataUrl)
    //     const blob = await res.blob()
    //     const uploadFile = new File([blob], file.fileName, { type: blob.type })
    //
    //     const formData = new FormData()
    //     formData.append('file', uploadFile)
    //     if (file.fileId) formData.append('fileId', file.fileId)
    //
    //     const response = await axios.post('http://localhost:8080/api/drive/upload', formData, {
    //       withCredentials: true,
    //       headers: { 'Content-Type': 'multipart/form-data' }
    //     })
    //     console.log('Başarıyla yüklendi:', file.fileName, response.data)
    //     if (file.fileName === 'hero.png') {
    //       props.memoriesData.hero.id = response.data.id
    //     } else if (file.fileName.startsWith('special')) {
    //       const index = parseInt(file.fileName.split('-')[1]) - 1
    //       props.memoriesData.specialGalleryPhotos[index].id = response.data.id
    //     } else if (file.fileName.startsWith('common')) {
    //       const index = parseInt(file.fileName.split('-')[1]) - 1
    //       props.memoriesData.commonGalleryPhotos[index].id = response.data.id
    //     }
    //   }
    //
    //   console.log('Tüm dosyalar Drive’a yüklendi!')
  } catch (error) {
    console.error('Yükleme hatası:', error)
  }
}

</script>

<template>
  <div>
    <h2>Kaydedilecek Veriler</h2>
    <!--    <p>İsimler: {{ props.memoriesData.hero.names.first }} & {{ props.memoriesData.hero.names.second-->
    <!--      }}</p>-->
    <!--    <p>Tarih: {{ props.memoriesData.hero.date }}</p>-->
    <!--    <p>Resim: {{ props.memoriesData.hero.image }}</p>-->

    <!--    <h3>Special Gallery ({{ props.memoriesData.specialGalleryPhotos.length }} fotoğraf)</h3>-->
    <!--    <h3>Common Gallery ({{ props.memoriesData.commonGalleryPhotos.length }} fotoğraf)</h3>-->

    <div v-if="props.memoriesData.weddingVideo">
      <video :src="props.memoriesData.weddingVideo" controls style="max-width:300px" />
    </div>
    <v-btn @click="uploadToDrive" class="ma-0 mb-16 bg-green-400:10">
      Drive’a Yükle
    </v-btn>
  </div>
</template>

<style scoped>

</style>
