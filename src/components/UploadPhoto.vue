<template class="items-center justify-center flex-1">
  <v-row>
    <template v-for="(image, imgIdx) in imageLayout" :key="imgIdx">
      <v-col :cols="image.cols">
        <v-img
          :src="image.src"
          aspect-ratio="16/9"
          cover
          class="cursor-pointer"
          @click="triggerFileInput(imgIdx)"
        ></v-img>
      </v-col>

      <v-col v-if="image.children" class="d-flex flex-column" cols="6">
        <v-row>
          <v-col
            v-for="(children, childIdx) in image.children"
            :key="childIdx"
            :cols="children.cols"
          >
            <v-img
              :src="children.src"
              height="100%"
              cover
              class="cursor-pointer"
              @click="triggerFileInput(imgIdx, childIdx)"
            ></v-img>
          </v-col>
        </v-row>
      </v-col>
    </template>

    <!-- Gizli file input -->
    <input
      ref="fileInput"
      type="file"
      accept="image/*"
      class="d-none"
      @change="onFileChange"
    />
  </v-row>
</template>

<script setup>
import { ref } from 'vue'

const fileInput = ref(null)
const activeImage = ref({ parent: null, child: null })

const imageLayout = ref([
  { cols: 4, src: 'https://picsum.photos/500/300?image=20' },
  {
    cols: 8,
    children: [
      { cols: 12, src: 'https://picsum.photos/500/300?image=21' },
      { cols: 12, src: 'https://picsum.photos/500/300?image=22' },
    ],
  },
  { cols: 6, src: 'https://picsum.photos/500/300?image=23' },
  { cols: 3, src: 'https://picsum.photos/500/300?image=24' },
  { cols: 9, src: 'https://picsum.photos/500/300?image=25' },
  { cols: 4, src: 'https://picsum.photos/500/300?image=26' },
  { cols: 8, src: 'https://picsum.photos/500/300?image=27' },
])

const triggerFileInput = (parentIdx, childIdx = null) => {
  activeImage.value = { parent: parentIdx, child: childIdx }
  fileInput.value.click()
}

const onFileChange = (event) => {
  const file = event.target.files[0]
  if (!file) return

  const url = URL.createObjectURL(file)

  const { parent, child } = activeImage.value
  if (child === null) {
    imageLayout.value[parent].src = url
  } else {
    imageLayout.value[parent].children[child].src = url
  }

  // temizle ki aynı dosya tekrar seçilirse de çalışsın
  event.target.value = ''
}
</script>
