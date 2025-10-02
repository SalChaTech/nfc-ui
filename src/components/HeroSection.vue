<template>
  <div class="hero-container">
    <img :src="currentImage" @click="props.editable ? triggerImageUpload() : null"
         class="hero-image" alt="Hero Image">
    <!-- Overlay içerik -->
    <div class="invitation-container">
      <!-- Decorative top element -->
      <div class="decorative-top">
        <div class="decorative-line"></div>
        <div class="decorative-dot"></div>
        <div class="decorative-line"></div>
      </div>

      <!-- Main invitation text -->
      <div class="invitation-content">
        <div class="invitation-text">
          <div class="name editable" @click="props.editable ? editName('first') : null"
               @blur="props.editable ? saveName('first') : null"
               @keydown.enter="props.editable ? saveName('first') : null"
               :contenteditable="props.editable && editingName === 'first'"
               ref="firstNameRef">{{
              names.first }}
          </div>
          <div class="ampersand">&</div>
          <div class="name editable" @click="props.editable ? editName('second') : null"
               @blur="props.editable ? saveName('second') : null"
               @keydown.enter="props.editable ? saveName('second') : null"
               :contenteditable="props.editable && editingName === 'second'"
               ref="secondNameRef">{{
              names.second }}
          </div>
        </div>

        <!-- Date section -->
        <div class="date-section">
          <div class="date-text editable"  @click="props.editable ? showDatePicker() : null">{{ formattedDate }}</div>
          <div class="time-text">{{ day }}</div>
        </div>

        <!-- Date picker -->
        <input type="date" ref="datePickerRef"   @change="props.editable ? updateDate($event) : null" :value="selectedDate"
               style="position: absolute; opacity: 0; pointer-events: none; z-index: 1000;" />

        <!-- Hidden image upload -->
        <input type="file" ref="imageUploadRef" @change="handleImageUpload" accept="image/*"
               style="position: absolute; opacity: 0; pointer-events: none;" />
      </div>

      <!-- Decorative bottom element -->
      <div class="decorative-bottom">
        <div class="decorative-line"></div>
        <div class="decorative-dot"></div>
        <div class="decorative-line"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import hero from '../assets/hero.jpg'
import { useDateStore } from '../composables/useDateStore.js'

// Tarih store'unu kullan
const { updateDate: setStoreDate } = useDateStore()

const props = defineProps({
  editable: {
    type: Boolean,
    default: false
  },
  hero_image: {
    type: Object,  // `String` yerine `Object` tipi kullanacağız
    default: () => ({
      id: null,
      name: null,
      url: null
    })
  }
})

const emit = defineEmits(['update:data'])
const emitData = (type) => {
  if (type === 'names') {
    emit('update:data', { names: { ...names } })
  } else if (type === 'image') {
    emit('update:data', { image: currentImage.value })
  } else if (type === 'date') {
    emit('update:data', { date: selectedDate.value })
  }
}
// const emitData = () => {
//   emit('update:data', {
//     names: { ...names },
//     date: selectedDate.value,
//     image: currentImage.value
//   })
// }



const currentImage = ref(props.hero_image?.url || hero)
// Reactive names data
const names = reactive({
  first: 'Çağla',
  second: 'Salih'
})

// Reactive date data
const selectedDate = ref('2024-07-17') // ISO format for date picker
const day = ref('Cumartesi')

// Editing state
const editingName = ref(null)
const firstNameRef = ref(null)
const secondNameRef = ref(null)
const datePickerRef = ref(null)
const imageUploadRef = ref(null)

// Computed properties
const formattedDate = computed(() => {
  if (!selectedDate.value) return '15/07/2024'
  const date = new Date(selectedDate.value)
  const day = date.getDate().toString().padStart(2, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const year = date.getFullYear()
  return `${day}/${month}/${year}`
})

// Methods for editing names
const editName = (nameType) => {
  editingName.value = nameType
  // Focus the element after a short delay to ensure contenteditable is set
  setTimeout(() => {
    if (nameType === 'first' && firstNameRef.value) {
      firstNameRef.value.focus()
      selectAllText(firstNameRef.value)
    } else if (nameType === 'second' && secondNameRef.value) {
      secondNameRef.value.focus()
      selectAllText(secondNameRef.value)
    }
  }, 10)
}

const saveName = (nameType) => {
  const element = nameType === 'first' ? firstNameRef.value : secondNameRef.value
  if (element) {
    const newName = element.textContent.trim()
    if (newName && newName !== names[nameType]) {
      names[nameType] = newName
    } else {
      // Reset to original if empty or same
      element.textContent = names[nameType]
    }
  }
  editingName.value = null
  emitData('names')
}

// Methods for date picker
const showDatePicker = () => {
  if (datePickerRef.value) {
    // Date picker'ı tetikle
    datePickerRef.value.focus()

    // showPicker() metodunu dene (bazı tarayıcılarda desteklenmeyebilir)
    if (typeof datePickerRef.value.showPicker === 'function') {
      try {
        datePickerRef.value.showPicker()
      } catch (error) {
        console.log('showPicker() desteklenmiyor, click() kullanılıyor')
        datePickerRef.value.click()
      }
    } else {
      // showPicker() desteklenmiyorsa click() kullan
      datePickerRef.value.click()
    }
  }
}

const updateDate = (event) => {
  selectedDate.value = event.target.value
  // Update day of week based on selected date
  if (selectedDate.value) {
    const date = new Date(selectedDate.value)
    const days = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi']
    day.value = days[date.getDay()]
    setStoreDate(selectedDate.value)
    emitData('date')
  }
}

// Methods for image upload
const triggerImageUpload = () => {
  if (imageUploadRef.value) {
    imageUploadRef.value.click()
  }
}

const handleImageUpload = (event) => {
  const file = event.target.files[0]
  if (file && file.type.startsWith('image/')) {
    const reader = new FileReader()
    reader.onload = (e) => {
      currentImage.value = e.target.result
      emitData('image')
    }
    reader.readAsDataURL(file)
  }
}


// Helper function to select all text
const selectAllText = (element) => {
  if (window.getSelection) {
    const selection = window.getSelection()
    const range = document.createRange()
    range.selectNodeContents(element)
    selection.removeAllRanges()
    selection.addRange(range)
  }
}

// Component mount edildiğinde başlangıç tarihini store'a kaydet
onMounted(() => {
  // if (props.hero_image) {
  //   currentImage.value = props.hero_image
  // }else {
  //   currentImage.value = hero
  // }
  setStoreDate(selectedDate.value)
})
</script>

<style scoped>
/* Font import'ları artık theme.css'de */

.hero-container {
  position: relative;
  width: 100%;
  height: 60vh;
  overflow: hidden;
}

.hero-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  cursor: pointer;
  transition: all 0.3s ease;
}

.hero-image:hover {
  transform: scale(1.01);
  filter: brightness(1.1);
}

.invitation-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: white;
  max-width: 320px;
  width: 80%;
  padding: var(--padding-2xl) var(--padding-lg);
  background: rgba(0, 0, 0, 0.15);
  border-radius: var(--radius-2xl);
  backdrop-filter: blur(3px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.decorative-top,
.decorative-bottom {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: var(--padding-lg) 0;
}

.decorative-line {
  width: 60px;
  height: 1px;
  background: linear-gradient(90deg, transparent, white, transparent);
  margin: 0 var(--padding-sm);
}

.decorative-dot {
  width: var(--padding-sm);
  height: var(--padding-sm);
  background: white;
  border-radius: 50%;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
}

.invitation-content {
  margin: var(--padding-2xl) 0;
}

.invitation-text {
  margin-bottom: var(--padding-2xl);
}

.name {
  font-family: var(--font-primary);
  font-size: 3.5rem;
  font-weight: var(--font-weight-bold);
  line-height: 1.2;
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.8);
  letter-spacing: 2px;
  margin: var(--padding-xs) 0;
}

.name.editable {
  cursor: pointer;
  transition: var(--transition-normal) var(--ease-in-out);
  border-radius: var(--radius-md);
  padding: var(--padding-xs) var(--padding-sm);
  margin: var(--padding-xs) calc(-1 * var(--padding-sm));
}

.name.editable:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: scale(1.02);
}

.name.editable:focus {
  outline: none;
  background: rgba(255, 255, 255, 0.15);
  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.3);
}

.ampersand {
  font-family: var(--font-secondary);
  font-size: 2.5rem;
  font-style: italic;
  font-weight: var(--font-weight-light);
  opacity: 0.9;
  margin: var(--padding-lg) 0;
  text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.7);
}

.date-section {
  position: relative;
  border-top: 1px solid rgba(255, 255, 255, 0.3);
  padding-top: var(--padding-xl);
  margin-top: var(--padding-xl);
}

.date-text {
  font-family: var(--font-secondary);
  font-size: 1.8rem;
  font-weight: var(--font-weight-medium);
  margin-bottom: var(--padding-sm);
  text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.7);
  letter-spacing: 1px;
}

.time-text {
  font-family: var(--font-secondary);
  font-size: 1.6rem;
  font-weight: var(--font-weight-light);
  opacity: 0.9;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.6);
  letter-spacing: 0.5px;
}

/* Editable date styles */
.date-text.editable {
  position: relative;
  cursor: pointer;
  transition: var(--transition-normal) var(--ease-in-out);
  border-radius: var(--radius-sm);
  padding: var(--padding-xs) var(--padding-sm);
  margin: var(--padding-xs) calc(-1 * var(--padding-sm));
  z-index: 10;
  pointer-events: auto;
}

.date-text.editable:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: scale(1.02);
}

.date-text.editable:focus {
  outline: none;
  background: rgba(255, 255, 255, 0.15);
  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.3);
}

/* Responsive design - maintain mobile-like appearance on all screens */
@media (max-width: 768px) {
  .hero-container {
  }

  .invitation-container {
    padding: var(--padding-2xl) var(--padding-lg);
  }

  .name {
    font-size: 2.8rem;
  }

  .date-text {
    font-size: 1.5rem;
  }

  .time-text {
    font-size: 1.3rem;
  }

  .decorative-line {
    width: var(--size-2xl);
  }
}

@media (max-width: 480px) {
  .hero-container {
  }

  .hero-image {
  }

  .name {
    font-size: 2.2rem;
  }

  .date-text {
    font-size: 1.3rem;
  }

  .time-text {
    font-size: 1.1rem;
  }
}
</style>
