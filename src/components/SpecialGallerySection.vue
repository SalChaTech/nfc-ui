<template>
  <div class="full-container">
    <!-- Ana büyük fotoğraf (sol taraf) -->
    <div class="left-side" @click="props.editable ? itemClickHandler(photos[0], 0) : null">
      <img :src="photos[0]?.url || g1Image" alt="Ana düğün fotoğrafı" />
      <div class="photo-border"></div>
    </div>

    <!-- Sağ taraf fotoğrafları -->
    <div class="right-side">
      <!-- Üst sağ fotoğraf -->
      <div class="top-img" @click="props.editable ? itemClickHandler(photos[1], 1) : null">
        <img :src="photos[1]?.url || g2Image" alt="Düğün anı" />
        <div class="photo-border"></div>
      </div>

      <!-- Alt sağ fotoğraf -->
      <div class="bottom-img" @click="props.editable ? itemClickHandler(photos[2], 2) : null">
        <img :src="photos[2]?.url || g3Image" alt="Çift anı" />
        <div class="photo-border"></div>
      </div>
    </div>
  </div>

  <!-- Gizli dosya input -->
  <input type="file" ref="photoInputRef" @change="handlePhotoChange" @click="props.editable ? handlePhotoChange : null" accept="image/*" style="display: none;" />

</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import g1Image from '../assets/g3.jpg'
import g2Image from '../assets/g2.jpg'
import g3Image from '../assets/g1.jpg'

const props = defineProps({
  editable: {
    type: Boolean,
    default: false
  },
  special_gallery_photos: {
    type: Array,
    default: () => []
  }
})

// const photos = ref(props.special_gallery_photos);

interface Photo {
  id: string | null
  name: string | null
  url: string | null
}

// Varsayılan 3 foto
const defaultPhotos: Photo[] = [
  { id: "2", name: 'special-1-image', url: null },
  { id: "3", name: 'special-2-image', url: null },
  { id: "4", name: 'special-3-image', url: null }
]

// photos ref
const photos = ref<Photo[]>([])

const emit = defineEmits(['update:special_gallery_photos'])

const emitPhotos = () => {
  const filteredPhotos = photos.value.filter((photo: any) => {
    return photo.url && photo.url.startsWith('data:image');
  });

  emit('update:special_gallery_photos', filteredPhotos);
}

const photoInputRef = ref(null)
const selectedPhotoIndex = ref(0)

function itemClickHandler(photo: any, index: number) {
  // Hangi fotoğrafa tıklandığını kaydet
  selectedPhotoIndex.value = index
  // Fotoğraf değiştirme için input'u tetikle
  if (photoInputRef.value) {
    photoInputRef.value.click()
  }
}

function handlePhotoChange(event: any) {
  const file = event.target.files[0]
  if (file && file.type.startsWith('image/')) {
    const reader = new FileReader()
    reader.onload = (e: any) => {
      // Tıklanan fotoğrafı değiştir
      photos.value[selectedPhotoIndex.value].url = e.target.result
      emitPhotos()
    }
    reader.readAsDataURL(file)
  }

}

watch(
  () => props.special_gallery_photos,
  (newPhotos) => {
    if (!newPhotos || newPhotos.length === 0 || newPhotos.every(p => p === null)) {
      photos.value = [...defaultPhotos]
    } else {
      photos.value = defaultPhotos.map(def => {
        const matched = newPhotos.find((p: Photo) => p && p.name?.startsWith(def.name))
        return matched ? { ...matched } : def
      })
    }
  },
  { immediate: true } // component mount olduğunda da çalışsın
)

</script>

<style scoped>
.full-container {
  display: flex;
  flex-direction: row;
  width: 100vw;
  height: 75vh;
  overflow: hidden;
}

/* Sol taraf */
.left-side {
  width: 50%;
  height: 100%;
}

.left-side img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-top-right-radius: 12px;
  border-bottom-right-radius: 12px;
}

/* Sağ taraf */
.right-side {
  width: 50%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-left: 16px;
}

.top-img,
.bottom-img {
  height: 50%;
}

.top-img img,
.bottom-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-top-left-radius: 12px;
  border-bottom-left-radius: 12px;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .full-container {
    flex-direction: row;
    height: 50vh;
  }

  .left-side {
    width: 50%;
    height: 100%;
  }

  .right-side {
    width: 50%;
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding-left: 16px;
  }

  .left-side img {
    height: 100%;
    border-top-right-radius: 12px;
    border-bottom-right-radius: 12px;
  }

  .top-img,
  .bottom-img {
    height: 50%;
  }

  .top-img img,
  .bottom-img img {
    height: 100%;
    border-top-left-radius: 12px;
    border-bottom-left-radius: 12px;
  }
}
</style>
