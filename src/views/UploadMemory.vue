<template>
  <div class="page-container">
    <HeroSection :editable="editable" />
    <SpecialGallerySection></SpecialGallerySection>
    <SaidYesVideoSection></SaidYesVideoSection>
    <CounterSection></CounterSection>
    <CommonGalerySection></CommonGalerySection>
  </div>
</template>

<script setup lang="ts">
import HeroSection from '../components/HeroSection.vue'
import SpecialGallerySection from '../components/SpecialGallerySection.vue'
import CommonGalerySection from '@/components/CommonGalerySection.vue'
import SaidYesVideoSection from '@/components/SaidYesVideoSection.vue'
import CounterSection from '@/components/CounterSection.vue'
import { useRoute } from 'vue-router'
import { ref } from 'vue'

const route = useRoute()

const editable = ref(false)
if (route.path.startsWith('/upload/')) {
  editable.value = true
} else if (route.path.startsWith('/show/')) {
  editable.value = false
}


</script>

<style scoped>
.page-container {
  max-width: 100%;
  margin: 0;
  padding: 0;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
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
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
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
