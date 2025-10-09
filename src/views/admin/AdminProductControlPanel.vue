<template>
  <div class="dashboard-container">
    <!-- Header -->
    <div class="dashboard-header">
      <div class="header-left">
        <button class="back-btn" @click="goToDashboard">
          <span class="back-icon">←</span>
          Ana Sayfa
        </button>
        <h1 class="dashboard-title">Ürün Yönetimi</h1>
      </div>
      <button class="add-user-btn" @click="openAddModal">
        <span class="btn-icon">+</span>
        Yeni Ürün Ekle
      </button>
    </div>

    <!-- Stats Cards -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon">📦</div>
        <div class="stat-content">
          <h3>Toplam Ürün</h3>
          <p class="stat-number">{{ products.length }}</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">📸</div>
        <div class="stat-content">
          <h3>Toplam Fotoğraf</h3>
          <p class="stat-number">{{ totalPhotos }}</p>
        </div>
      </div>
    </div>

    <!-- Products Table -->
    <div class="table-container">
      <div class="table-header">
        <h2>Ürün Listesi</h2>
        <div class="search-box">
          <input
            type="text"
            placeholder="Ürün ara..."
            v-model="searchQuery"
            class="search-input"
          />
        </div>
      </div>

      <div class="table-wrapper">
        <table class="users-table">
          <thead>
          <tr>
            <th>ID</th>
            <th>Ürün Adı</th>
            <th>Açıklama</th>
            <th>Fiyat</th>
            <th>Stok</th>
            <th>Fotoğraf Sayısı</th>
            <th>Oluşturma Tarihi</th>
            <th>İşlemler</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="product in filteredProducts" :key="product.id">
            <td>{{ product.id }}</td>
            <td>{{ product.name }}</td>
            <td class="description-cell">{{ product.description }}</td>
            <td>{{ product.price }}₺</td>
            <td>
              <span class="stock-badge" :class="{ 'low-stock': product.stock <= 5, 'out-of-stock': product.stock === 0 }">
                {{ product.stock }}
              </span>
            </td>
            <td>
              <span class="photo-count-badge">{{ product.photos.length }}/10</span>
            </td>
            <td>{{ formatDate(product.createdAt) }}</td>
            <td>
              <div class="action-buttons">
                <button class="edit-btn" @click="editProduct(product)">✏️</button>
                <button class="delete-btn" @click="deleteProduct(product.id)">🗑️</button>
              </div>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content large-modal" @click.stop>
        <div class="modal-header">
          <h3>{{ isEditing ? 'Ürün Düzenle' : 'Yeni Ürün Ekle' }}</h3>
          <button class="close-btn" @click="closeModal">×</button>
        </div>

        <form class="modal-form" @submit.prevent="saveProduct">
          <div class="form-group">
            <label>Ürün Adı</label>
            <input
              type="text"
              v-model="formData.name"
              required
              class="form-input"
              placeholder="Ürün adını girin"
            />
          </div>

          <div class="form-group">
            <label>Açıklama</label>
            <textarea
              v-model="formData.description"
              required
              class="form-input"
              rows="3"
              placeholder="Ürün açıklamasını girin"
            ></textarea>
          </div>

          <div class="form-group">
            <label>Fiyat (₺)</label>
            <input
              type="number"
              v-model="formData.price"
              required
              class="form-input"
              placeholder="0"
              min="0"
              step="0.01"
            />
          </div>

          <div class="form-group">
            <label>Stok Adedi</label>
            <input
              type="number"
              v-model="formData.stock"
              required
              class="form-input"
              placeholder="0"
              min="0"
            />
          </div>

          <div class="form-group">
            <label>Ürün Fotoğrafları (Maksimum 10 adet)</label>
            <div class="photo-upload-section">
              <div class="photo-upload-area" @click="triggerFileInput" :class="{ 'disabled': formData.photos.length >= 10 }">
                <input
                  ref="fileInput"
                  type="file"
                  multiple
                  accept="image/*"
                  @change="handleFileUpload"
                  style="display: none"
                />
                <div class="upload-content">
                  <span class="upload-icon">📷</span>
                  <p>Fotoğraf Seç ({{ formData.photos.length }}/10)</p>
                </div>
              </div>
              
              <div class="photo-preview-grid" v-if="formData.photos.length > 0">
                <div v-for="(photo, index) in formData.photos" :key="index" class="photo-preview-item">
                  <img :src="photo.url" :alt="`Photo ${index + 1}`" class="photo-preview" />
                  <button type="button" class="remove-photo-btn" @click="removePhoto(index)">×</button>
                </div>
              </div>
            </div>
          </div>

          <div class="modal-actions">
            <button type="button" class="cancel-btn" @click="closeModal">İptal</button>
            <button type="submit" class="save-btn">
              {{ isEditing ? 'Güncelle' : 'Kaydet' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Reactive data
const products = ref([
  { 
    id: 1, 
    name: 'Düğün Fotoğraf Paketi', 
    description: 'Profesyonel düğün fotoğrafçılığı hizmeti', 
    price: 2500, 
    stock: 15,
    photos: [
      { url: '/src/assets/g1.jpg', name: 'photo1.jpg' },
      { url: '/src/assets/g2.jpg', name: 'photo2.jpg' }
    ], 
    createdAt: '2024-01-15' 
  },
  { 
    id: 2, 
    name: 'Nişan Fotoğraf Paketi', 
    description: 'Nişan töreni fotoğrafçılığı', 
    price: 1500, 
    stock: 8,
    photos: [
      { url: '/src/assets/g3.jpg', name: 'photo3.jpg' }
    ], 
    createdAt: '2024-01-20' 
  },
  { 
    id: 3, 
    name: 'Aile Fotoğraf Çekimi', 
    description: 'Aile fotoğraf çekimi hizmeti', 
    price: 800, 
    stock: 0,
    photos: [], 
    createdAt: '2024-02-01' 
  }
])

const searchQuery = ref('')
const showModal = ref(false)
const isEditing = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)
const formData = ref({
  id: null,
  name: '',
  description: '',
  price: 0,
  stock: 0,
  photos: [] as Array<{ url: string; name: string; file?: File }>
})

// Computed properties
const filteredProducts = computed(() => {
  if (!searchQuery.value) return products.value
  return products.value.filter(product =>
    product.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const totalPhotos = computed(() => {
  return products.value.reduce((total, product) => total + product.photos.length, 0)
})

// Methods
const openAddModal = () => {
  isEditing.value = false
  formData.value = { 
    id: null, 
    name: '', 
    description: '', 
    price: 0, 
    stock: 0,
    photos: [] 
  }
  showModal.value = true
}

const editProduct = (product: any) => {
  isEditing.value = true
  formData.value = { ...product }
  showModal.value = true
}

const saveProduct = () => {
  if (isEditing.value) {
    const index = products.value.findIndex(product => product.id === formData.value.id)
    if (index !== -1) {
      products.value[index] = { ...formData.value }
    }
  } else {
    const newProduct = {
      ...formData.value,
      id: Math.max(...products.value.map(p => p.id)) + 1,
      createdAt: new Date().toISOString().split('T')[0]
    }
    products.value.push(newProduct)
  }
  closeModal()
}

const deleteProduct = (id: number) => {
  if (confirm('Bu ürünü silmek istediğinizden emin misiniz?')) {
    products.value = products.value.filter(product => product.id !== id)
  }
}

const closeModal = () => {
  showModal.value = false
  formData.value = { 
    id: null, 
    name: '', 
    description: '', 
    price: 0, 
    stock: 0,
    photos: [] 
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('tr-TR')
}

// Photo management methods
const triggerFileInput = () => {
  if (formData.value.photos.length < 10) {
    fileInput.value?.click()
  }
}

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = target.files
  
  if (files) {
    const remainingSlots = 10 - formData.value.photos.length
    const filesToAdd = Array.from(files).slice(0, remainingSlots)
    
    filesToAdd.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const url = e.target?.result as string
          formData.value.photos.push({
            url,
            name: file.name,
            file
          })
        }
        reader.readAsDataURL(file)
      }
    })
  }
  
  // Reset file input
  if (target) {
    target.value = ''
  }
}

const removePhoto = (index: number) => {
  formData.value.photos.splice(index, 1)
}

// Navigation method
const goToDashboard = () => {
  router.push('/admin')
}
</script>

<style scoped>
.dashboard-container {
  min-height: 100vh;
  background: #f8fafc;
  padding: 24px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  padding-bottom: 20px;
  border-bottom: 2px solid #e2e8f0;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 24px;
}

.back-btn {
  background: linear-gradient(135deg, #6b7280, #4b5563);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.back-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(107, 114, 128, 0.3);
  background: linear-gradient(135deg, #4b5563, #374151);
}

.back-icon {
  font-size: 1.1rem;
}

.dashboard-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #2d3748;
  margin: 0;
}

.add-user-btn {
  background: linear-gradient(135deg, #4ade80, #22c55e);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.add-user-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(74, 222, 128, 0.3);
}

.btn-icon {
  font-size: 1.2rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
}

.stat-card {
  background: white;
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  gap: 16px;
  border: 1px solid #e2e8f0;
}

.stat-icon {
  font-size: 2.5rem;
  background: linear-gradient(135deg, #d4af8c, #b8956a);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.stat-content h3 {
  margin: 0 0 8px 0;
  color: #4a5568;
  font-size: 0.9rem;
  font-weight: 600;
}

.stat-number {
  margin: 0;
  font-size: 2rem;
  font-weight: 700;
  color: #2d3748;
}

.table-container {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  border: 1px solid #e2e8f0;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid #e2e8f0;
}

.table-header h2 {
  margin: 0;
  color: #2d3748;
  font-size: 1.5rem;
}

.search-input {
  padding: 10px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.9rem;
  width: 250px;
  transition: border-color 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #d4af8c;
}

.table-wrapper {
  overflow-x: auto;
}

.users-table {
  width: 100%;
  border-collapse: collapse;
}

.users-table th {
  background: #f8fafc;
  padding: 16px;
  text-align: left;
  font-weight: 600;
  color: #4a5568;
  border-bottom: 1px solid #e2e8f0;
}

.users-table td {
  padding: 16px;
  border-bottom: 1px solid #f1f5f9;
  color: #2d3748;
}

.product-id-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  background: #f0f9ff;
  color: #2563eb;
}

.drive-link-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  background: #f0fdf4;
  color: #16a34a;
}


.action-buttons {
  display: flex;
  gap: 8px;
}

.edit-btn, .delete-btn {
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.edit-btn {
  background: #fef3c7;
  color: #d97706;
}

.edit-btn:hover {
  background: #fde68a;
}

.delete-btn {
  background: #fef2f2;
  color: #dc2626;
}

.delete-btn:hover {
  background: #fecaca;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 16px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.large-modal {
  max-width: 800px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid #e2e8f0;
}

.modal-header h3 {
  margin: 0;
  color: #2d3748;
  font-size: 1.3rem;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #718096;
  padding: 4px;
}

.modal-form {
  padding: 24px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #4a5568;
}

.form-input, .form-select {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
  box-sizing: border-box;
}

.form-input:focus, .form-select:focus {
  outline: none;
  border-color: #d4af8c;
}

.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
}

.cancel-btn, .save-btn {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cancel-btn {
  background: #f1f5f9;
  color: #64748b;
}

.cancel-btn:hover {
  background: #e2e8f0;
}

.save-btn {
  background: linear-gradient(135deg, #4ade80, #22c55e);
  color: white;
}

.save-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(74, 222, 128, 0.3);
}

@media (max-width: 768px) {
  .dashboard-container {
    padding: 16px;
  }

  .dashboard-header {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }

  .table-header {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }

  .search-input {
    width: 100%;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }
}

/* Photo upload styles */
.photo-upload-section {
  margin-top: 8px;
}

.photo-upload-area {
  border: 2px dashed #d4af8c;
  border-radius: 12px;
  padding: 24px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #fefefe;
}

.photo-upload-area:hover:not(.disabled) {
  border-color: #b8956a;
  background: #f8f9fa;
}

.photo-upload-area.disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background: #f5f5f5;
}

.upload-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.upload-icon {
  font-size: 2rem;
  color: #d4af8c;
}

.upload-content p {
  margin: 0;
  color: #4a5568;
  font-weight: 500;
}

.photo-preview-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 12px;
  margin-top: 16px;
}

.photo-preview-item {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.photo-preview {
  width: 100%;
  height: 120px;
  object-fit: cover;
  display: block;
}

.remove-photo-btn {
  position: absolute;
  top: 4px;
  right: 4px;
  background: rgba(220, 38, 38, 0.9);
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  transition: all 0.2s ease;
}

.remove-photo-btn:hover {
  background: rgba(220, 38, 38, 1);
  transform: scale(1.1);
}

.photo-count-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  background: #f0f9ff;
  color: #2563eb;
}

.stock-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  background: #f0fdf4;
  color: #16a34a;
}

.stock-badge.low-stock {
  background: #fef3c7;
  color: #d97706;
}

.stock-badge.out-of-stock {
  background: #fef2f2;
  color: #dc2626;
}

.description-cell {
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

textarea.form-input {
  resize: vertical;
  min-height: 80px;
}
</style>
