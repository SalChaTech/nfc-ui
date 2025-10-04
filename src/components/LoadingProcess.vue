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
  position: fixed;       /* ekranın her yerine sabit */
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%); /* ortala */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  background-color: rgba(255, 255, 255, 0.2);
}
</style>
