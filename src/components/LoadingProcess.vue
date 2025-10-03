<script setup lang="ts">

</script>

<template>
  <div class="loading-screen">
    <v-progress-circular
      :size="70"
      :width="7"
      color="purple"
      indeterminate
    ></v-progress-circular>
  </div>
</template>

<style scoped>
.loading-screen {
  position: fixed;       /* ekranın üzerine kapla */
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;   /* dikey ortala */
  justify-content: center; /* yatay ortala */
  background-color: rgba(255, 255, 255, 0.8); /* isteğe bağlı yarı saydam arka plan */
  z-index: 9999;         /* diğer içeriklerin üstünde olsun */
}
</style>
