<template>
  <div class="">
    <HeroSection />
    <SpecialGallerySection />
  </div>
</template>
<script>
import UploadPhoto from '@/components/UploadPhoto.vue'
import HeroSection from '@/components/HeroSection.vue'
import SpecialGallerySection from '@/components/SpecialGallerySection.vue'

export default {
  name: 'UploadMemory',
  components: { SpecialGallerySection, HeroSection, UploadPhoto },
  data() {
    return {
      // Define your component data here
    }
  },
  methods: {}
}
</script>
