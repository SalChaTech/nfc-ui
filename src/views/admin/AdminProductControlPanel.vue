<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import Sidebar from '@/components/admin-components/Sidebar.vue'

const router = useRouter()

// Product management state
const products = ref([
  { id: 1, name: 'iPhone 15 Pro', price: 999.99, description: 'Latest iPhone with advanced camera system', stockquantity: 50, category: 'Electronics' },
  { id: 2, name: 'MacBook Air M2', price: 1199.99, description: 'Lightweight laptop with M2 chip', stockquantity: 25, category: 'Electronics' },
  { id: 3, name: 'Nike Air Max', price: 129.99, description: 'Comfortable running shoes', stockquantity: 100, category: 'Shoes' },
  { id: 4, name: 'Samsung Galaxy S24', price: 899.99, description: 'Android smartphone with AI features', stockquantity: 75, category: 'Electronics' },
  { id: 5, name: 'Adidas T-Shirt', price: 29.99, description: 'Comfortable cotton t-shirt', stockquantity: 200, category: 'Clothing' },
  { id: 6, name: 'Sony WH-1000XM5', price: 399.99, description: 'Noise-canceling wireless headphones', stockquantity: 30, category: 'Electronics' }
])

const searchQuery = ref('')
const categoryFilter = ref('')
const selectedProducts = ref([])
const sortField = ref('id')
const sortDirection = ref('asc')
const currentPage = ref(1)
const itemsPerPage = ref(10)

// Modal state
const showAddModal = ref(false)
const showEditModal = ref(false)
const newProduct = ref({
  name: '',
  price: '',
  description: '',
  stockquantity: '',
  category: '',
  images: []
})
const editProduct = ref({
  id: null,
  name: '',
  price: '',
  description: '',
  stockquantity: '',
  category: '',
  images: []
})
const isSubmitting = ref(false)

// File upload handlers
const handleImageUpload = (event, isEdit = false) => {
  const files = event.target.files
  if (files && files.length > 0) {
    Array.from(files).forEach((file) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const imageData = {
            id: `local-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
            name: file.name,
            url: e.target.result,
            file: file
          }
          
          if (isEdit) {
            editProduct.value.images.push(imageData)
          } else {
            newProduct.value.images.push(imageData)
          }
        }
        reader.readAsDataURL(file)
      }
    })
  }
}

// Remove image function
const removeImage = (imageId, isEdit = false) => {
  if (isEdit) {
    editProduct.value.images = editProduct.value.images.filter(img => img.id !== imageId)
  } else {
    newProduct.value.images = newProduct.value.images.filter(img => img.id !== imageId)
  }
}

// Computed properties
const filteredProducts = computed(() => {
  let filtered = products.value

  // Search filter
  if (searchQuery.value) {
    filtered = filtered.filter(product =>
      product.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  // Category filter
  if (categoryFilter.value) {
    filtered = filtered.filter(product => product.category === categoryFilter.value)
  }

  // Sort
  filtered.sort((a, b) => {
    let aVal = a[sortField.value]
    let bVal = b[sortField.value]

    if (sortDirection.value === 'asc') {
      return aVal > bVal ? 1 : -1
    } else {
      return aVal < bVal ? 1 : -1
    }
  })

  return filtered
})

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredProducts.value.slice(start, end)
})

const totalPages = computed(() => {
  return Math.ceil(filteredProducts.value.length / itemsPerPage.value)
})

const logout = () => {
  if (confirm('Çıkış yapmak istediğinizden emin misiniz?')) {
    // Clear any stored auth data
    localStorage.removeItem('adminToken')
    localStorage.removeItem('userToken')
    router.push('/login')
  }
}

// Product management functions
const sortBy = (field: string) => {
  if (sortField.value === field) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortField.value = field
    sortDirection.value = 'asc'
  }
}

const toggleSelectAll = () => {
  if (selectedProducts.value.length === filteredProducts.value.length) {
    selectedProducts.value = []
  } else {
    selectedProducts.value = filteredProducts.value.map(product => product.id)
  }
}

const toggleProductSelection = (productId: number) => {
  const index = selectedProducts.value.indexOf(productId)
  if (index > -1) {
    selectedProducts.value.splice(index, 1)
  } else {
    selectedProducts.value.push(productId)
  }
}

const bulkDelete = () => {
  if (confirm(`${selectedProducts.value.length} ürünü silmek istediğinizden emin misiniz?`)) {
    products.value = products.value.filter(product => !selectedProducts.value.includes(product.id))
    selectedProducts.value = []
  }
}

// Modal functions
const openAddModal = () => {
  showAddModal.value = true
  newProduct.value = {
    name: '',
    price: '',
    description: '',
    stockquantity: '',
    category: '',
    images: []
  }
}

const closeAddModal = () => {
  showAddModal.value = false
  newProduct.value = {
    name: '',
    price: '',
    description: '',
    stockquantity: '',
    category: '',
    images: []
  }
}

const addNewProduct = async () => {
  if (!newProduct.value.name || !newProduct.value.price || !newProduct.value.description || !newProduct.value.stockquantity || !newProduct.value.category || newProduct.value.images.length === 0) {
    alert('Lütfen tüm alanları doldurun.')
    return
  }

  isSubmitting.value = true
  
  try {
    // Generate new ID
    const newId = Math.max(...products.value.map(p => p.id)) + 1
    
    // Add new product (images will be stored as array for now)
    products.value.push({
      id: newId,
      name: newProduct.value.name,
      price: parseFloat(newProduct.value.price),
      description: newProduct.value.description,
      stockquantity: parseInt(newProduct.value.stockquantity),
      category: newProduct.value.category,
      images: newProduct.value.images
    })
    
    // Close modal and reset form
    closeAddModal()
    
    // Show success message
    alert('Ürün başarıyla eklendi!')
  } catch (error) {
    alert('Ürün eklenirken bir hata oluştu.')
  } finally {
    isSubmitting.value = false
  }
}

// Edit functions
const openEditModal = (product) => {
  showEditModal.value = true
  editProduct.value = {
    id: product.id,
    name: product.name,
    price: product.price.toString(),
    description: product.description,
    stockquantity: product.stockquantity.toString(),
    category: product.category,
    images: product.images || []
  }
}

const closeEditModal = () => {
  showEditModal.value = false
  editProduct.value = {
    id: null,
    name: '',
    price: '',
    description: '',
    stockquantity: '',
    category: '',
    images: []
  }
}

const updateProduct = async () => {
  if (!editProduct.value.name || !editProduct.value.price || !editProduct.value.description || !editProduct.value.stockquantity || !editProduct.value.category || editProduct.value.images.length === 0) {
    alert('Lütfen tüm alanları doldurun.')
    return
  }

  isSubmitting.value = true
  
  try {
    // Find and update product
    const productIndex = products.value.findIndex(p => p.id === editProduct.value.id)
    if (productIndex !== -1) {
      products.value[productIndex] = {
        id: editProduct.value.id,
        name: editProduct.value.name,
        price: parseFloat(editProduct.value.price),
        description: editProduct.value.description,
        stockquantity: parseInt(editProduct.value.stockquantity),
        category: editProduct.value.category,
        images: editProduct.value.images
      }
    }
    
    // Close modal and reset form
    closeEditModal()
    
    // Show success message
    alert('Ürün başarıyla güncellendi!')
  } catch (error) {
    alert('Ürün güncellenirken bir hata oluştu.')
  } finally {
    isSubmitting.value = false
  }
}

// Delete function
const deleteProduct = (productId) => {
  const product = products.value.find(p => p.id === productId)
  if (product && confirm(`${product.name} ürününü silmek istediğinizden emin misiniz?`)) {
    products.value = products.value.filter(p => p.id !== productId)
    alert('Ürün başarıyla silindi!')
  }
}

</script>

<template>
  <div class="antialiased bg-gray-50 dark:bg-gray-900">
    <Sidebar/>

    <main class="p-4 md:ml-64 h-auto pt-20">
      <!-- Breadcrumb -->
      <nav class="flex mb-4" aria-label="Breadcrumb">
        <ol class="inline-flex items-center space-x-1 md:space-x-3">
          <li class="inline-flex items-center">
            <a href="#" class="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white">
              <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
              </svg>
              Home
            </a>
          </li>
          <li>
            <div class="flex items-center">
              <svg class="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
              </svg>
              <a href="#" class="ml-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ml-2 dark:text-gray-400 dark:hover:text-white">Platform</a>
            </div>
          </li>
          <li aria-current="page">
            <div class="flex items-center">
              <svg class="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
              </svg>
              <span class="ml-1 text-sm font-medium text-gray-500 md:ml-2 dark:text-gray-400">Products</span>
            </div>
          </li>
        </ol>
      </nav>

      <!-- Page Header -->
      <div class="flex justify-between items-center mb-6">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">All Products</h1>
        </div>
        <button @click="openAddModal" class="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
          <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd"></path>
          </svg>
          Yeni Ürün Ekle
        </button>
      </div>

      <!-- Filters -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <!-- Search -->
          <div class="lg:col-span-2">
            <label for="search" class="block text-sm font-medium text-gray-900 dark:text-white mb-2">Search</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"></path>
                </svg>
              </div>
              <input
                type="text"
                id="search"
                v-model="searchQuery"
                class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Search by name, description, or category..."
              />
            </div>
          </div>

          <!-- Category Filter -->
          <div>
            <label for="category" class="block text-sm font-medium text-gray-900 dark:text-white mb-2">Category</label>
            <select
              id="category"
              v-model="categoryFilter"
              class="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            >
              <option value="">All Categories</option>
              <option value="Electronics">Electronics</option>
              <option value="Shoes">Shoes</option>
              <option value="Clothing">Clothing</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Bulk Actions -->
      <div v-if="selectedProducts.length > 0" class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <span class="text-sm font-medium text-blue-800 dark:text-blue-200">
              {{ selectedProducts.length }} product(s) selected
            </span>
          </div>
          <div class="flex space-x-2">
            <button
              @click="bulkDelete"
              class="inline-flex items-center px-3 py-2 text-sm font-medium text-red-700 bg-red-100 rounded-lg hover:bg-red-200 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30"
            >
              <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" clip-rule="evenodd"></path>
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
              </svg>
              Delete
            </button>
          </div>
        </div>
      </div>

      <!-- Products Table -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" class="p-4">
                <div class="flex items-center">
                  <input
                    type="checkbox"
                    class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    :checked="selectedProducts.length === filteredProducts.length && filteredProducts.length > 0"
                    @change="toggleSelectAll"
                  />
                </div>
              </th>
              <th scope="col" class="px-6 py-3 cursor-pointer" @click="sortBy('id')">
                <div class="flex items-center">
                  ID
                  <svg class="w-3 h-3 ml-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 12a1 1 0 102 0V6.414l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L5 6.414V12zM15 8a1 1 0 10-2 0v5.586l-1.293-1.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L15 13.586V8z"></path>
                  </svg>
                </div>
              </th>
              <th scope="col" class="px-6 py-3 cursor-pointer" @click="sortBy('name')">
                <div class="flex items-center">
                  Name
                  <svg class="w-3 h-3 ml-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 12a1 1 0 102 0V6.414l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L5 6.414V12zM15 8a1 1 0 10-2 0v5.586l-1.293-1.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L15 13.586V8z"></path>
                  </svg>
                </div>
              </th>
              <th scope="col" class="px-6 py-3 cursor-pointer" @click="sortBy('price')">
                <div class="flex items-center">
                  Price
                  <svg class="w-3 h-3 ml-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 12a1 1 0 102 0V6.414l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L5 6.414V12zM15 8a1 1 0 10-2 0v5.586l-1.293-1.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L15 13.586V8z"></path>
                  </svg>
                </div>
              </th>
              <th scope="col" class="px-6 py-3 cursor-pointer" @click="sortBy('stockquantity')">
                <div class="flex items-center">
                  Stock
                  <svg class="w-3 h-3 ml-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 12a1 1 0 102 0V6.414l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L5 6.414V12zM15 8a1 1 0 10-2 0v5.586l-1.293-1.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L15 13.586V8z"></path>
                  </svg>
                </div>
              </th>
              <th scope="col" class="px-6 py-3 cursor-pointer" @click="sortBy('category')">
                <div class="flex items-center">
                  Category
                  <svg class="w-3 h-3 ml-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 12a1 1 0 102 0V6.414l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L5 6.414V12zM15 8a1 1 0 10-2 0v5.586l-1.293-1.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L15 13.586V8z"></path>
                  </svg>
                </div>
              </th>
              <th scope="col" class="px-6 py-3">
                Actions
              </th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="product in paginatedProducts" :key="product.id" class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
              <td class="w-4 p-4">
                <div class="flex items-center">
                  <input
                    type="checkbox"
                    class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    :checked="selectedProducts.includes(product.id)"
                    @change="toggleProductSelection(product.id)"
                  />
                </div>
              </td>
              <td class="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                {{ product.id }}
              </td>
              <td class="px-6 py-4">
                <div class="flex flex-col">
                  <div class="text-sm font-medium text-gray-900 dark:text-white">{{ product.name }}</div>
                  <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ product.description }}</div>
                </div>
              </td>
              <td class="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                ${{ product.price.toFixed(2) }}
              </td>
              <td class="px-6 py-4">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" :class="product.stockquantity > 50 ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' : product.stockquantity > 10 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'">
                  {{ product.stockquantity }}
                </span>
              </td>
              <td class="px-6 py-4">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                  {{ product.category }}
                </span>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center space-x-2">
                  <button @click="openEditModal(product)" class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300" title="Düzenle">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path>
                    </svg>
                  </button>
                  <button @click="deleteProduct(product.id)" class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300" title="Sil">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fill-rule="evenodd" d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" clip-rule="evenodd"></path>
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="flex items-center justify-between p-4 border-t border-gray-200 dark:border-gray-700">
          <div class="flex items-center text-sm text-gray-700 dark:text-gray-400">
            Showing {{ (currentPage - 1) * itemsPerPage + 1 }} to {{ Math.min(currentPage * itemsPerPage, filteredProducts.length) }} of {{ filteredProducts.length }} results
          </div>
          <div class="flex items-center space-x-2">
            <button
              @click="currentPage = Math.max(1, currentPage - 1)"
              :disabled="currentPage === 1"
              class="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd"></path>
              </svg>
              Previous
            </button>
            <button
              @click="currentPage = Math.min(totalPages, currentPage + 1)"
              :disabled="currentPage === totalPages"
              class="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
              <svg class="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </main>

    <!-- Add Product Modal -->
    <div v-if="showAddModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" @click="closeAddModal">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white dark:bg-gray-800" @click.stop>
        <div class="mt-3">
          <!-- Modal Header -->
          <div class="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-700">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">
              Yeni Ürün Ekle
            </h3>
            <button @click="closeAddModal" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <!-- Modal Body -->
          <div class="mt-4 space-y-4">
            <!-- Name Field -->
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Ürün Adı *
              </label>
              <input
                type="text"
                id="name"
                v-model="newProduct.name"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Ürün adını girin"
                required
              />
            </div>

            <!-- Price Field -->
            <div>
              <label for="price" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Fiyat *
              </label>
              <input
                type="number"
                step="0.01"
                id="price"
                v-model="newProduct.price"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="0.00"
                required
              />
            </div>

            <!-- Description Field -->
            <div>
              <label for="description" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Açıklama *
              </label>
              <textarea
                id="description"
                v-model="newProduct.description"
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Ürün açıklaması"
                required
              ></textarea>
            </div>

            <!-- Stock Quantity Field -->
            <div>
              <label for="stockquantity" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Stok Miktarı *
              </label>
              <input
                type="number"
                id="stockquantity"
                v-model="newProduct.stockquantity"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="0"
                required
              />
            </div>

            <!-- Category Field -->
            <div>
              <label for="category" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Kategori *
              </label>
              <select
                id="category"
                v-model="newProduct.category"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                required
              >
                <option value="">Kategori seçin</option>
                <option value="Electronics">Electronics</option>
                <option value="Shoes">Shoes</option>
                <option value="Clothing">Clothing</option>
              </select>
            </div>

            <!-- Images Field -->
            <div>
              <label for="images" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Ürün Resimleri *
              </label>
              <input
                type="file"
                id="images"
                accept="image/*"
                multiple
                @change="handleImageUpload($event, false)"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                required
              />
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Birden fazla resim seçebilirsiniz</p>
              
              <!-- Image Gallery -->
              <div v-if="newProduct.images.length > 0" class="mt-4">
                <div class="grid grid-cols-3 gap-2">
                  <div v-for="(image, index) in newProduct.images" :key="image.id" class="relative group">
                    <img 
                      :src="image.url" 
                      :alt="image.name" 
                      class="w-full h-20 object-cover rounded-lg border border-gray-300"
                    />
                    <button 
                      @click="removeImage(image.id, false)"
                      class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                      title="Resmi kaldır"
                    >
                      ×
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Modal Footer -->
          <div class="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              @click="closeAddModal"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-500"
            >
              İptal
            </button>
            <button
              @click="addNewProduct"
              :disabled="isSubmitting"
              class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="isSubmitting">Ekleniyor...</span>
              <span v-else>Ekle</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Product Modal -->
    <div v-if="showEditModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" @click="closeEditModal">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white dark:bg-gray-800" @click.stop>
        <div class="mt-3">
          <!-- Modal Header -->
          <div class="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-700">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">
              Ürün Düzenle
            </h3>
            <button @click="closeEditModal" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <!-- Modal Body -->
          <div class="mt-4 space-y-4">
            <!-- Name Field -->
            <div>
              <label for="edit-name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Ürün Adı *
              </label>
              <input
                type="text"
                id="edit-name"
                v-model="editProduct.name"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Ürün adını girin"
                required
              />
            </div>

            <!-- Price Field -->
            <div>
              <label for="edit-price" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Fiyat *
              </label>
              <input
                type="number"
                step="0.01"
                id="edit-price"
                v-model="editProduct.price"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="0.00"
                required
              />
            </div>

            <!-- Description Field -->
            <div>
              <label for="edit-description" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Açıklama *
              </label>
              <textarea
                id="edit-description"
                v-model="editProduct.description"
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Ürün açıklaması"
                required
              ></textarea>
            </div>

            <!-- Stock Quantity Field -->
            <div>
              <label for="edit-stockquantity" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Stok Miktarı *
              </label>
              <input
                type="number"
                id="edit-stockquantity"
                v-model="editProduct.stockquantity"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="0"
                required
              />
            </div>

            <!-- Category Field -->
            <div>
              <label for="edit-category" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Kategori *
              </label>
              <select
                id="edit-category"
                v-model="editProduct.category"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                required
              >
                <option value="">Kategori seçin</option>
                <option value="Electronics">Electronics</option>
                <option value="Shoes">Shoes</option>
                <option value="Clothing">Clothing</option>
              </select>
            </div>

            <!-- Images Field -->
            <div>
              <label for="edit-images" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Ürün Resimleri *
              </label>
              <input
                type="file"
                id="edit-images"
                accept="image/*"
                multiple
                @change="handleImageUpload($event, true)"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                required
              />
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Birden fazla resim seçebilirsiniz</p>
              
              <!-- Image Gallery -->
              <div v-if="editProduct.images.length > 0" class="mt-4">
                <div class="grid grid-cols-3 gap-2">
                  <div v-for="(image, index) in editProduct.images" :key="image.id" class="relative group">
                    <img 
                      :src="image.url" 
                      :alt="image.name" 
                      class="w-full h-20 object-cover rounded-lg border border-gray-300"
                    />
                    <button 
                      @click="removeImage(image.id, true)"
                      class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                      title="Resmi kaldır"
                    >
                      ×
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Modal Footer -->
          <div class="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              @click="closeEditModal"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-500"
            >
              İptal
            </button>
            <button
              @click="updateProduct"
              :disabled="isSubmitting"
              class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="isSubmitting">Güncelleniyor...</span>
              <span v-else>Güncelle</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
/* Product Management Styles */
</style>
