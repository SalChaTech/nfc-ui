<template>
  <div class="d-flex" @click="changeImage('heroImage')">
    <v-img class="photo-height" cover :src=resim></v-img>
    <input ref="imageInput" type="file" accept="image/*" @change="onImageChange" style="display: none" />

  </div>
</template>
<script setup lang="ts"> import resim from '../assets/ress.jpg'
import { ref, onMounted } from 'vue'

const imgHeight = ref('100vh') // Başlangıçta 75% viewport height

const currentImage = ref(resim)

const changeImage = (key, index = null) => {
  currentImageKey.value = key
  currentImageIndex.value = index
  imageInput.value.click()
}

const onImageChange = (event) => {
  const file = event.target.files[0]
  if (!file) return

  const url = URL.createObjectURL(file)

  if (currentImageIndex.value !== null) {
    content[currentImageKey.value][currentImageIndex.value] = url
  } else {
    content[currentImageKey.value] = url
  }

  event.target.value = ''
}

</script>
<style scoped> @media (max-width: 1600px) {
  .photo-height {
    height: 80vh;
  }
} </style>
