<template>
  <div class="template-editor">
    <!-- Sidebar - Araçlar ve Yükleme -->
    <div class="sidebar" :class="{ collapsed: sidebarCollapsed }">
      <div class="sidebar-header">
        <h2>✨ Template Editor</h2>
        <button @click="sidebarCollapsed = !sidebarCollapsed" class="collapse-btn">
          {{ sidebarCollapsed ? '→' : '←' }}
        </button>
      </div>

      <div class="sidebar-content" v-if="!sidebarCollapsed">
        <!-- Fotoğraf Yükleme -->
        <div class="section">
          <h3>📸 Fotoğraflar</h3>
          <div class="upload-area">
            <input
              ref="fileInput"
              type="file"
              multiple
              accept="image/*"
              @change="handleFileUpload"
              style="display: none"
            >
            <button @click="$refs.fileInput.click()" class="upload-btn">
              Fotoğraf Yükle
            </button>
          </div>

          <!-- Yüklenen Fotoğraflar -->
          <div class="uploaded-photos" v-if="uploadedPhotos.length">
            <div
              v-for="(photo, index) in uploadedPhotos"
              :key="index"
              class="photo-thumb"
              @dragstart="startDrag($event, photo)"
              draggable="true"
            >
              <img :src="photo.url" :alt="`Photo ${index + 1}`">
              <button @click="removePhoto(index)" class="remove-photo">×</button>
            </div>
          </div>
        </div>

        <!-- Text Ekleme -->
        <div class="section">
          <h3>📝 Metin Ekle</h3>
          <input
            v-model="newTextInput"
            placeholder="Metin yazın..."
            @keyup.enter="addText"
            class="text-input"
          >
          <button @click="addText" class="add-text-btn">Ekle</button>
        </div>

        <!-- Araçlar -->
        <div class="section">
          <h3>🛠️ Araçlar</h3>
          <div class="tools">
            <button @click="clearTemplate" class="tool-btn danger">
              🗑️ Temizle
            </button>
            <button @click="exportTemplate" class="tool-btn success">
              💾 İndir
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Ana Template Alanı -->
    <div class="main-canvas" :style="{ marginLeft: sidebarCollapsed ? '60px' : '320px' }">
      <div class="canvas-header">
        <h1>Vintage Memories</h1>
        <div class="canvas-controls">
          <button @click="zoomOut" :disabled="zoom <= 0.5">-</button>
          <span>{{ Math.round(zoom * 100) }}%</span>
          <button @click="zoomIn" :disabled="zoom >= 2">+</button>
        </div>
      </div>

      <!-- Template Canvas -->
      <div
        ref="templateCanvas"
        class="template-canvas"
        :style="{ transform: `scale(${zoom})` }"
        @drop="onDrop"
        @dragover="onDragOver"
      >
        <!-- Arka Plan Tekstürü -->
        <div class="canvas-background"></div>

        <!-- Dekoratif Elementler -->
        <div class="decorative-elements">
          <div class="tape tape-1"></div>
          <div class="tape tape-2"></div>
          <div class="flower flower-1">🌸</div>
          <div class="flower flower-2">🌿</div>
          <div class="flower flower-3">🌻</div>
        </div>

        <!-- Yerleştirilen Elementler -->
        <div
          v-for="(element, index) in templateElements"
          :key="element.id"
          :class="['template-element', element.type, { selected: selectedElement?.id === element.id }]"
          :style="{
            left: element.x + 'px',
            top: element.y + 'px',
            width: element.width + 'px',
            height: element.height + 'px',
            transform: `rotate(${element.rotation}deg)`,
            zIndex: element.zIndex
          }"
          @mousedown="selectElement($event, element)"
          @click="selectElement($event, element)"
        >
          <!-- Fotoğraf Elementi -->
          <div v-if="element.type === 'photo'" class="photo-element">
            <div class="polaroid-frame">
              <img :src="element.src" :alt="`Photo ${index + 1}`">
            </div>
          </div>

          <!-- Text Elementi -->
          <div
            v-if="element.type === 'text'"
            class="text-element"
            :contenteditable="selectedElement?.id === element.id"
            @blur="updateText($event, element)"
            @input="updateText($event, element)"
          >
            {{ element.content }}
          </div>

          <!-- Seçili Element Kontrolleri -->
          <div v-if="selectedElement?.id === element.id" class="element-controls">
            <div class="resize-handle resize-nw" @mousedown="startResize($event, 'nw')"></div>
            <div class="resize-handle resize-ne" @mousedown="startResize($event, 'ne')"></div>
            <div class="resize-handle resize-sw" @mousedown="startResize($event, 'sw')"></div>
            <div class="resize-handle resize-se" @mousedown="startResize($event, 'se')"></div>
            <div class="rotate-handle" @mousedown="startRotate($event)">↻</div>
            <button class="delete-handle" @click="deleteElement(element)">×</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading Overlay -->
    <div v-if="isExporting" class="export-overlay">
      <div class="export-spinner">
        <div class="spinner"></div>
        <p>Template hazırlanıyor...</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, nextTick, onMounted, onUnmounted } from 'vue'

export default {
  name: 'TemplateEditor',
  setup() {
    // Reactive state
    const sidebarCollapsed = ref(false)
    const uploadedPhotos = ref([])
    const newTextInput = ref('')
    const templateElements = ref([])
    const selectedElement = ref(null)
    const zoom = ref(1)
    const isExporting = ref(false)

    // Canvas references
    const templateCanvas = ref(null)
    const fileInput = ref(null)

    // Drag & Drop state
    const dragState = reactive({
      isDragging: false,
      isResizing: false,
      isRotating: false,
      startX: 0,
      startY: 0,
      startWidth: 0,
      startHeight: 0,
      startRotation: 0,
      resizeDirection: null
    })

    let elementIdCounter = 0

    // Fotoğraf yükleme
    const handleFileUpload = (event) => {
      const files = Array.from(event.target.files)
      files.forEach(file => {
        if (file.type.startsWith('image/')) {
          const reader = new FileReader()
          reader.onload = (e) => {
            uploadedPhotos.value.push({
              id: Date.now() + Math.random(),
              name: file.name,
              url: e.target.result
            })
          }
          reader.readAsDataURL(file)
        }
      })
    }

    // Fotoğraf silme
    const removePhoto = (index) => {
      uploadedPhotos.value.splice(index, 1)
    }

    // Drag başlangıç
    const startDrag = (event, photo) => {
      event.dataTransfer.setData('application/json', JSON.stringify({
        type: 'photo',
        ...photo
      }))
    }

    // Drop işlemi
    const onDrop = (event) => {
      event.preventDefault()
      const rect = templateCanvas.value.getBoundingClientRect()
      const x = (event.clientX - rect.left) / zoom.value
      const y = (event.clientY - rect.top) / zoom.value

      try {
        const data = JSON.parse(event.dataTransfer.getData('application/json'))
        if (data.type === 'photo') {
          addPhotoElement(data, x, y)
        }
      } catch (error) {
        console.error('Drop error:', error)
      }
    }

    const onDragOver = (event) => {
      event.preventDefault()
    }

    // Fotoğraf elementi ekleme
    const addPhotoElement = (photo, x, y) => {
      const element = {
        id: ++elementIdCounter,
        type: 'photo',
        src: photo.url,
        x: Math.max(0, x - 75),
        y: Math.max(0, y - 100),
        width: 150,
        height: 200,
        rotation: Math.random() * 10 - 5, // Rastgele hafif eğim
        zIndex: templateElements.value.length + 1
      }
      templateElements.value.push(element)
      selectedElement.value = element
    }

    // Text ekleme
    const addText = () => {
      if (!newTextInput.value.trim()) return

      const element = {
        id: ++elementIdCounter,
        type: 'text',
        content: newTextInput.value,
        x: 100,
        y: 100,
        width: 200,
        height: 50,
        rotation: 0,
        zIndex: templateElements.value.length + 1
      }
      templateElements.value.push(element)
      selectedElement.value = element
      newTextInput.value = ''
    }

    // Element seçme
    const selectElement = (event, element) => {
      event.stopPropagation()
      selectedElement.value = element

      // Drag başlatma
      dragState.isDragging = true
      dragState.startX = event.clientX
      dragState.startY = event.clientY
      const elementRect = event.currentTarget.getBoundingClientRect()
      dragState.offsetX = event.clientX - elementRect.left
      dragState.offsetY = event.clientY - elementRect.top
    }

    // Element silme
    const deleteElement = (element) => {
      const index = templateElements.value.findIndex(el => el.id === element.id)
      if (index > -1) {
        templateElements.value.splice(index, 1)
        selectedElement.value = null
      }
    }

    // Text güncelleme
    const updateText = (event, element) => {
      element.content = event.target.textContent
    }

    // Resize başlatma
    const startResize = (event, direction) => {
      event.stopPropagation()
      dragState.isResizing = true
      dragState.resizeDirection = direction
      dragState.startX = event.clientX
      dragState.startY = event.clientY
      dragState.startWidth = selectedElement.value.width
      dragState.startHeight = selectedElement.value.height
    }

    // Rotate başlatma
    const startRotate = (event) => {
      event.stopPropagation()
      dragState.isRotating = true
      dragState.startX = event.clientX
      dragState.startY = event.clientY
      dragState.startRotation = selectedElement.value.rotation
    }

    // Mouse move handler
    const handleMouseMove = (event) => {
      if (!selectedElement.value) return

      const deltaX = event.clientX - dragState.startX
      const deltaY = event.clientY - dragState.startY

      if (dragState.isDragging && !dragState.isResizing && !dragState.isRotating) {
        selectedElement.value.x += deltaX / zoom.value
        selectedElement.value.y += deltaY / zoom.value
        dragState.startX = event.clientX
        dragState.startY = event.clientY
      } else if (dragState.isResizing) {
        const direction = dragState.resizeDirection
        if (direction.includes('e')) {
          selectedElement.value.width = Math.max(50, dragState.startWidth + deltaX / zoom.value)
        }
        if (direction.includes('s')) {
          selectedElement.value.height = Math.max(30, dragState.startHeight + deltaY / zoom.value)
        }
      } else if (dragState.isRotating) {
        const angle = Math.atan2(deltaY, deltaX) * 180 / Math.PI
        selectedElement.value.rotation = dragState.startRotation + angle
      }
    }

    // Mouse up handler
    const handleMouseUp = () => {
      dragState.isDragging = false
      dragState.isResizing = false
      dragState.isRotating = false
    }

    // Canvas tıklama - seçimi temizle
    const handleCanvasClick = (event) => {
      if (event.target === templateCanvas.value || event.target.classList.contains('canvas-background')) {
        selectedElement.value = null
      }
    }

    // Zoom kontrolleri
    const zoomIn = () => {
      if (zoom.value < 2) zoom.value += 0.1
    }

    const zoomOut = () => {
      if (zoom.value > 0.5) zoom.value -= 0.1
    }

    // Template temizleme
    const clearTemplate = () => {
      if (confirm('Tüm elementleri silmek istediğinizden emin misiniz?')) {
        templateElements.value = []
        selectedElement.value = null
      }
    }

    // Template export
    const exportTemplate = async () => {
      isExporting.value = true
      selectedElement.value = null

      try {
        await nextTick()

        // Canvas'ı görüntü olarak yakalama (basit implementasyon)
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        canvas.width = 800
        canvas.height = 1000

        // Arka plan
        ctx.fillStyle = '#f5f1eb'
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        // Elementleri çiz
        for (const element of templateElements.value) {
          ctx.save()
          ctx.translate(element.x + element.width/2, element.y + element.height/2)
          ctx.rotate(element.rotation * Math.PI / 180)
          ctx.translate(-element.width/2, -element.height/2)

          if (element.type === 'photo') {
            const img = new Image()
            await new Promise(resolve => {
              img.onload = () => {
                ctx.fillStyle = '#fff'
                ctx.fillRect(-10, -10, element.width + 20, element.height + 20)
                ctx.drawImage(img, 0, 0, element.width - 20, element.height - 40)
                resolve()
              }
              img.src = element.src
            })
          } else if (element.type === 'text') {
            ctx.fillStyle = '#2c1810'
            ctx.font = '24px "Dancing Script", cursive'
            ctx.fillText(element.content, 0, 30)
          }

          ctx.restore()
        }

        // İndir
        const link = document.createElement('a')
        link.download = `vintage-template-${Date.now()}.png`
        link.href = canvas.toDataURL()
        link.click()

      } catch (error) {
        console.error('Export error:', error)
        alert('Export işleminde hata oluştu!')
      } finally {
        isExporting.value = false
      }
    }

    // Lifecycle
    onMounted(() => {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      templateCanvas.value?.addEventListener('click', handleCanvasClick)
    })

    onUnmounted(() => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    })

    return {
      // Refs
      sidebarCollapsed,
      uploadedPhotos,
      newTextInput,
      templateElements,
      selectedElement,
      zoom,
      isExporting,
      templateCanvas,
      fileInput,

      // Methods
      handleFileUpload,
      removePhoto,
      startDrag,
      onDrop,
      onDragOver,
      addText,
      selectElement,
      deleteElement,
      updateText,
      startResize,
      startRotate,
      zoomIn,
      zoomOut,
      clearTemplate,
      exportTemplate
    }
  }
}
</script>

<style scoped>
.template-editor {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 0;
  background: linear-gradient(135deg, #f5f1eb 0%, #e8e0d4 100%);
  display: flex;
  font-family: 'Inter', sans-serif;
  overflow: hidden;
}

/* Sidebar */
.sidebar {
  width: 320px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-right: 1px solid rgba(139, 121, 94, 0.2);
  transition: all 0.3s ease;
  overflow-y: auto;
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  z-index: 100;
}

.sidebar.collapsed {
  width: 60px;
}

.sidebar-header {
  padding: 20px;
  border-bottom: 1px solid rgba(139, 121, 94, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.sidebar-header h2 {
  font-size: 18px;
  color: #2c1810;
  margin: 0;
}

.collapse-btn {
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
  color: #8b795e;
  padding: 5px;
}

.sidebar-content {
  padding: 20px;
}

.section {
  margin-bottom: 30px;
}

.section h3 {
  font-size: 14px;
  color: #2c1810;
  margin-bottom: 15px;
  font-weight: 600;
}

/* Upload Area */
.upload-area {
  margin-bottom: 15px;
}

.upload-btn {
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, #d4b5a0, #c29d85);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}

.upload-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(196, 157, 133, 0.3);
}

/* Uploaded Photos */
.uploaded-photos {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.photo-thumb {
  position: relative;
  aspect-ratio: 1;
  border-radius: 6px;
  overflow: hidden;
  cursor: grab;
  transition: transform 0.2s ease;
}

.photo-thumb:hover {
  transform: scale(1.05);
}

.photo-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.remove-photo {
  position: absolute;
  top: 5px;
  right: 5px;
  width: 20px;
  height: 20px;
  background: rgba(220, 53, 69, 0.9);
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Text Input */
.text-input {
  width: 100%;
  padding: 10px;
  border: 1px solid rgba(139, 121, 94, 0.3);
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.8);
  margin-bottom: 10px;
}

.add-text-btn {
  width: 100%;
  padding: 8px;
  background: #8b795e;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

/* Tools */
.tools {
  display: flex;
  gap: 10px;
}

.tool-btn {
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
}

.tool-btn.danger {
  background: #dc3545;
  color: white;
}

.tool-btn.success {
  background: #28a745;
  color: white;
}

/* Main Canvas */
.main-canvas {
  flex: 1;
  padding: 20px;
  transition: margin-left 0.3s ease;
  overflow: auto;
}

.canvas-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.canvas-header h1 {
  font-family: 'Dancing Script', cursive;
  font-size: 32px;
  color: #2c1810;
  margin: 0;
}

.canvas-controls {
  display: flex;
  align-items: center;
  gap: 10px;
}

.canvas-controls button {
  width: 30px;
  height: 30px;
  border: 1px solid #8b795e;
  background: white;
  border-radius: 4px;
  cursor: pointer;
}

/* Template Canvas */
.template-canvas {
  position: relative;
  width: 800px;
  height: 1000px;
  margin: 0 auto;
  transform-origin: top center;
  transition: transform 0.3s ease;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.canvas-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background:
    radial-gradient(circle at 20% 30%, rgba(139, 121, 94, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 70%, rgba(212, 181, 160, 0.1) 0%, transparent 50%),
    linear-gradient(135deg, #f5f1eb 0%, #e8e0d4 100%);
  background-size: 200px 200px, 300px 300px, 100% 100%;
}

/* Decorative Elements */
.decorative-elements {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.tape {
  position: absolute;
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(139, 121, 94, 0.2);
  backdrop-filter: blur(5px);
}

.tape-1 {
  width: 120px;
  height: 25px;
  top: 100px;
  left: 50px;
  transform: rotate(-8deg);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.tape-2 {
  width: 100px;
  height: 25px;
  bottom: 150px;
  right: 80px;
  transform: rotate(12deg);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.flower {
  position: absolute;
  font-size: 24px;
  opacity: 0.6;
  transform-origin: center;
  animation: gentle-float 6s ease-in-out infinite;
}

.flower-1 {
  top: 80px;
  right: 100px;
  animation-delay: 0s;
}

.flower-2 {
  bottom: 200px;
  left: 60px;
  animation-delay: 2s;
}

.flower-3 {
  top: 400px;
  left: 50%;
  animation-delay: 4s;
}

@keyframes gentle-float {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-10px) rotate(5deg);
  }
}

/* Template Elements */
.template-element {
  position: absolute;
  cursor: move;
  user-select: none;
}

.template-element.selected {
  outline: 2px dashed #8b795e;
  outline-offset: 4px;
}

.photo-element {
  width: 100%;
  height: 100%;
}

.polaroid-frame {
  width: 100%;
  height: 100%;
  background: white;
  padding: 10px;
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transform: rotate(0.5deg);
}

.polaroid-frame img {
  width: 100%;
  height: calc(100% - 30px);
  object-fit: cover;
  border-radius: 2px;
}

.text-element {
  font-family: 'Dancing Script', cursive;
  font-size: 24px;
  color: #2c1810;
  background: rgba(255, 255, 255, 0.9);
  padding: 8px 12px;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  min-width: 100px;
  min-height: 30px;
  outline: none;
  line-height: 1.2;
}

/* Element Controls */
.element-controls {
  position: absolute;
  top: -10px;
  left: -10px;
  right: -10px;
  bottom: -10px;
  pointer-events: none;
}

.resize-handle {
  position: absolute;
  width: 8px;
  height: 8px;
  background: #8b795e;
  border: 2px solid white;
  border-radius: 50%;
  pointer-events: all;
  cursor: nw-resize;
}

.resize-nw { top: -4px; left: -4px; }
.resize-ne { top: -4px; right: -4px; cursor: ne-resize; }
.resize-sw { bottom: -4px; left: -4px; cursor: sw-resize; }
.resize-se { bottom: -4px; right: -4px; cursor: se-resize; }

.rotate-handle {
  position: absolute;
  top: -25px;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 20px;
  background: #8b795e;
  color: white;
  border: none;
  border-radius: 50%;
  cursor: crosshair;
  pointer-events: all;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.delete-handle {
  position: absolute;
  top: -25px;
  right: -10px;
  width: 20px;
  height: 20px;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  pointer-events: all;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Export Overlay */
.export-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.export-spinner {
  background: white;
  padding: 40px;
  border-radius: 12px;
  text-align: center;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #8b795e;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Responsive */
@media (max-width: 1200px) {
  .sidebar {
    width: 280px;
  }

  .template-canvas {
    width: 600px;
    height: 750px;
  }
}

@media (max-width: 768px) {
  .sidebar {
    width: 100%;
    height: auto;
    position: relative;
  }

  .main-canvas {
    margin-left: 0 !important;
  }

  .template-canvas {
    width: 400px;
    height: 500px;
  }
}
</style>
