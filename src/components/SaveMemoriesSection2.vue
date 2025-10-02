<template>
  <div class="save-memories">
    <h2>Upload Files to Google Drive</h2>

    <input type="file" @change="handleFileSelect" />
    <button @click="uploadFile" :disabled="!selectedFile || isUploading">
      {{ isUploading ? 'Uploading...' : 'Upload' }}
    </button>

    <h3>Uploaded Files</h3>
    <ul>
      <li v-for="file in files" :key="file.id">
        <a :href="file.webViewLink" target="_blank">{{ file.name }}</a>
        <button @click="deleteFile(file.id)">Delete</button>
      </li>
    </ul>

    <div v-if="errorMsg" class="error">{{ errorMsg }}</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const files = ref([])
const selectedFile = ref(null)
const isUploading = ref(false)
const errorMsg = ref('')

const fetchFiles = async () => {
  try {
    const res = await axios.get('http://localhost:8080/api/drive/files', {
      withCredentials: true, // **cookie gönder**
    })
    files.value = res.data
  } catch (err) {
    console.error('Dosyalar alınamadı: ', err)
    errorMsg.value = 'Dosyalar alınamadı.'
  }
}

const handleFileSelect = (event) => {
  selectedFile.value = event.target.files[0]
}

const uploadFile = async () => {
  if (!selectedFile.value) return
  isUploading.value = true
  errorMsg.value = ''

  try {
    const formData = new FormData()
    formData.append('file', selectedFile.value)

    const res = await axios.post('http://localhost:8080/api/drive/upload', formData, {
      withCredentials: true,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    console.log('Yükleme sonucu:', res.data)
    selectedFile.value = null
    await fetchFiles()
  } catch (err) {
    console.error('Yükleme hatası:', err)
    errorMsg.value = 'Dosya yüklenemedi.'
  } finally {
    isUploading.value = false
  }
}

const deleteFile = async (fileId) => {
  try {
    await axios.delete(`http://localhost:8080/api/drive/files/${fileId}`, {
      withCredentials: true,
    })
    files.value = files.value.filter(f => f.id !== fileId)
  } catch (err) {
    console.error('Dosya silme hatası:', err)
    errorMsg.value = 'Dosya silinemedi.'
  }
}

onMounted(() => {
  fetchFiles()
})
</script>

<style scoped>
.save-memories {
  max-width: 600px;
  margin: 0 auto;
}
.error {
  color: red;
  margin-top: 10px;
}
</style>
