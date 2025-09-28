<template>
  <v-container fluid class="pa-0" style="display: flex;justify-content: center;">
    <v-row>
      <v-col
        cols="14"
        md="4" class="mx-auto"
      >
        <HeroSection></HeroSection>
        <SpecialGallerySection></SpecialGallerySection>
        <SaidYesVideoSection></SaidYesVideoSection>
        <CounterSection></CounterSection>
        <CommonGalerySection></CommonGalerySection>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import HeroSection from '../components/HeroSection.vue'
import SpecialGallerySection from '../components/SpecialGallerySection.vue'
import CommonGalerySection from '@/components/CommonGalerySection.vue'
import SaidYesVideoSection from '@/components/SaidYesVideoSection.vue'
import CounterSection from '@/components/CounterSection.vue'
</script>

<style scoped>


/* Mobil uyumluluk için */
@media (max-width: 768px) {
  .page-container {
    padding: 0 1rem;
  }
}
</style>
