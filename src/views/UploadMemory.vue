<template>
  <div class="items-center justify-center flex-1">
    <UploadPhoto/>
  </div>
</template>
<script>
import UploadPhoto from '@/components/UploadPhoto.vue';
export default {
  name: 'UploadMemory',
  components: {UploadPhoto},
  data() {
    return {
      // Define your component data here
    };
  },
  methods: {

  }
};
</script>
