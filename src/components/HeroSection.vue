<template>
  <div class="hero-container">
    <img
      :src="currentImage"
      @click="props.editable ? triggerImageUpload() : null"
      class="hero-image"
      alt="Hero Image"
    >
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
            <div
              class="name editable"
              @click="props.editable ? editName('first') : null"
              @blur="props.editable ? saveName('first') : null"
              @keydown.enter="props.editable ? saveName('first') : null"
              :contenteditable="props.editable && editingName === 'first'"
              ref="firstNameRef"
            >{{ names.first }}</div>
            <div class="ampersand">&</div>
            <div
              class="name editable"
              @click="props.editable ? editName('second') : null"
              @blur="props.editable ? saveName('second') : null"
              @keydown.enter="props.editable ? saveName('second') : null"
              :contenteditable="props.editable && editingName === 'second'"
              ref="secondNameRef"
            >{{ names.second }}</div>
          </div>

          <!-- Date section -->
          <div class="date-section">
            <div
              class="date-text editable"
              @click="props.editable ? showDatePicker() : null"
            >{{ formattedDate }}</div>
            <div class="time-text">{{ day }}</div>
          </div>

          <!-- Hidden date picker -->
          <input
            type="date"
            ref="datePickerRef"
            @change="props.editable ? handleImageUpload($event) : null"
            style="position: absolute; opacity: 0; pointer-events: none;"
          />

          <!-- Hidden image upload -->
          <input
            type="file"
            ref="imageUploadRef"
            @change="handleImageUpload"
            accept="image/*"
            style="position: absolute; opacity: 0; pointer-events: none;"
          />
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
import { ref, reactive, computed } from 'vue'

import { IMAGES} from '@/constants/images.js';


const props = defineProps({
  editable: {
    type: Boolean,
    default: false
  }
})

const currentImage = ref(IMAGES[0])

// Reactive names data
const names = reactive({
  first: 'Çağla',
  second: 'Salih'
})

// Reactive date data
const selectedDate = ref('2024-07-15') // ISO format for date picker
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
}

// Methods for date picker
const showDatePicker = () => {
  if (datePickerRef.value) {
    datePickerRef.value.showPicker()
  }
}

const updateDate = (event) => {
  selectedDate.value = event.target.value
  // Update day of week based on selected date
  if (selectedDate.value) {
    const date = new Date(selectedDate.value)
    const days = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi']
    day.value = days[date.getDay()]
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
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap');

.hero-container {
  position: relative;
  width: 100%;
  height: 60vh;
  overflow: hidden;
  border-radius: 0 0 25px 25px;
}

.hero-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 0 0 25px 25px;
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
  padding: 30px 15px;
  background: rgba(0, 0, 0, 0.15);
  border-radius: 20px;
  backdrop-filter: blur(3px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.decorative-top,
.decorative-bottom {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 20px 0;
}

.decorative-line {
  width: 60px;
  height: 1px;
  background: linear-gradient(90deg, transparent, white, transparent);
  margin: 0 10px;
}

.decorative-dot {
  width: 8px;
  height: 8px;
  background: white;
  border-radius: 50%;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
}

.invitation-content {
  margin: 30px 0;
}

.invitation-text {
  margin-bottom: 30px;
}

.name {
  font-family: 'Dancing Script', cursive;
  font-size: 3.5rem;
  font-weight: 700;
  line-height: 1.2;
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.8);
  letter-spacing: 2px;
  margin: 5px 0;
}

.name.editable {
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 8px;
  padding: 5px 10px;
  margin: 5px -10px;
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
  font-family: 'Playfair Display', serif;
  font-size: 2.5rem;
  font-style: italic;
  font-weight: 300;
  opacity: 0.9;
  margin: 15px 0;
  text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.7);
}

.date-section {
  border-top: 1px solid rgba(255, 255, 255, 0.3);
  padding-top: 25px;
  margin-top: 25px;
}

.date-text {
  font-family: 'Playfair Display', serif;
  font-size: 1.8rem;
  font-weight: 500;
  margin-bottom: 8px;
  text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.7);
  letter-spacing: 1px;
}

.time-text {
  font-family: 'Playfair Display', serif;
  font-size: 1.2rem;
  font-weight: 300;
  opacity: 0.9;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.6);
  letter-spacing: 0.5px;
}

/* Editable date styles */
.date-text.editable {
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 6px;
  padding: 3px 8px;
  margin: 2px -8px;
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
    border-radius: 0 0 20px 20px;
  }

  .hero-image {
    border-radius: 0 0 20px 20px;
  }

  .invitation-container {
    padding: 30px 15px;
  }

  .name {
    font-size: 2.8rem;
  }

  .date-text {
    font-size: 1.5rem;
  }

  .time-text {
    font-size: 1rem;
  }

  .decorative-line {
    width: 40px;
  }
}

@media (max-width: 480px) {
  .hero-container {
    border-radius: 0 0 15px 15px;
  }

  .hero-image {
    border-radius: 0 0 15px 15px;
  }

  .name {
    font-size: 2.2rem;
  }

  .date-text {
    font-size: 1.3rem;
  }

  .time-text {
    font-size: 0.9rem;
  }
}

/* Large screens - maintain mobile-like width */
@media (min-width: 1200px) {
  .invitation-container {
    max-width: 320px;
    width: 320px;
  }
}
</style>
