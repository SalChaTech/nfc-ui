<template>
  <div class="dashboard-container">
    <!-- Header -->
    <div class="dashboard-header">
      <div class="header-left">
        <button class="back-btn" @click="goToDashboard">
          <span class="back-icon">←</span>
          Ana Sayfa
        </button>
        <h1 class="dashboard-title">Kullanıcı Yönetimi</h1>
      </div>
      <button class="add-user-btn" @click="openAddModal">
        <span class="btn-icon">+</span>
        Yeni Kullanıcı Ekle
      </button>
    </div>

    <!-- Stats Cards -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon">👥</div>
        <div class="stat-content">
          <h3>Toplam Kullanıcı</h3>
          <p class="stat-number">{{ users.length }}</p>
        </div>
      </div>

    </div>

    <!-- Users Table -->
    <div class="table-container">
      <div class="table-header">
        <h2>Kullanıcı Listesi</h2>
        <div class="search-box">
          <input
            type="text"
            placeholder="Kullanıcı ara..."
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
              <th>E-posta</th>
              <th>Product Id</th>
              <th>Drive Link</th>
              <th>Kayıt Tarihi</th>
              <th>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in filteredUsers" :key="user.id">
              <td>{{ user.id }}</td>
              <td>{{ user.email }}</td>
              <td>
                <span class="product-id-badge">{{ user.product_id }}</span>
              </td>
              <td>
                <span class="drive-link-badge" >
                  {{ user.drive_link }}
                </span>
              </td>
              <td>{{ formatDate(user.createdAt) }}</td>
              <td>
                <div class="action-buttons">
                  <button class="edit-btn" @click="editUser(user)">✏️</button>
                  <button class="delete-btn" @click="deleteUser(user.id)">🗑️</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>{{ isEditing ? 'Kullanıcı Düzenle' : 'Yeni Kullanıcı Ekle' }}</h3>
          <button class="close-btn" @click="closeModal">×</button>
        </div>

        <form class="modal-form" @submit.prevent="saveUser">
          <div class="form-group">
            <label>E-posta</label>
            <input
              type="email"
              v-model="formData.email"
              required
              class="form-input"
            />
          </div>

          <div class="form-group">
            <label>Password</label>
            <input
              type="password"
              v-model="formData.password"
              required
              class="form-input"
            />
          </div>

          <div class="form-group">
            <label>Product Id</label>
            <input
              type="text"
              v-model="formData.product_id"
              required
              class="form-input"
            />
          </div>

          <div class="form-group">
            <label>Drive Link</label>
            <input
              type="text"
              v-model="formData.drive_link"
              required
              class="form-input"
            />
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
const users = ref([
  { id: 1, name: 'Ahmet Yılmaz', email: 'ahmet@example.com', product_id: 'admin', drive_link: 'active', createdAt: '2024-01-15' },
  { id: 2, name: 'Fatma Demir', email: 'fatma@example.com', product_id: 'user', drive_link: 'active', createdAt: '2024-01-20' },
  { id: 3, name: 'Mehmet Kaya', email: 'mehmet@example.com', product_id: 'moderator', drive_link: 'inactive', createdAt: '2024-02-01' },
  { id: 4, name: 'Ayşe Özkan', email: 'ayse@example.com', product_id: 'user', drive_link: 'active', createdAt: '2024-02-10' }
])

const searchQuery = ref('')
const showModal = ref(false)
const isEditing = ref(false)
const formData = ref({
  id: null,
  name: '',
  email: '',
  password: '',
  product_id: '',
  drive_link: ''
})

// Computed properties

const filteredUsers = computed(() => {
  if (!searchQuery.value) return users.value
  return users.value.filter(user =>
    user.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

// Methods
const openAddModal = () => {
  isEditing.value = false
  formData.value = { id: null, name: '', email: '',password: '', product_id: '', drive_link: '' }
  showModal.value = true
}

const editUser = (user: any) => {
  isEditing.value = true
  formData.value = { ...user }
  showModal.value = true
}

const saveUser = () => {
  if (isEditing.value) {
    const index = users.value.findIndex(user => user.id === formData.value.id)
    if (index !== -1) {
      users.value[index] = { ...formData.value }
    }
  } else {
    const newUser = {
      ...formData.value,
      id: Math.max(...users.value.map(u => u.id)) + 1,
      createdAt: new Date().toISOString().split('T')[0]
    }
    users.value.push(newUser)
  }
  closeModal()
}

const deleteUser = (id: number) => {
  if (confirm('Bu kullanıcıyı silmek istediğinizden emin misiniz?')) {
    users.value = users.value.filter(user => user.id !== id)
  }
}

const closeModal = () => {
  showModal.value = false
  formData.value = { id: null, name: '', email: '',password: '', product_id: 'user', drive_link: 'active' }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('tr-TR')
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
</style>
