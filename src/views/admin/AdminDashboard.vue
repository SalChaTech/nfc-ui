<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const navigateToProducts = () => {
  router.push('/admin/products')
}

const navigateToUsers = () => {
  router.push('/admin/users')
}

const logout = () => {
  if (confirm('Çıkış yapmak istediğinizden emin misiniz?')) {
    // Clear any stored auth data
    localStorage.removeItem('adminToken')
    localStorage.removeItem('userToken')
    router.push('/login')
  }
}
</script>

<template>
  <div class="dashboard-container">
    <!-- Header -->
    <div class="dashboard-header">
      <div class="header-content">
        <h1 class="dashboard-title">Admin Paneli</h1>
        <button class="logout-btn" @click="logout">
          <span class="logout-icon">🚪</span>
          Çıkış Yap
        </button>
      </div>
    </div>

    <!-- Welcome Section -->
    <div class="welcome-section">
      <h2 class="welcome-title">Hoş Geldiniz!</h2>
      <p class="welcome-subtitle">Admin paneline hoş geldiniz. Aşağıdaki seçeneklerden birini seçerek işlemlerinizi gerçekleştirebilirsiniz.</p>
    </div>

    <!-- Navigation Cards -->
    <div class="navigation-grid">
      <!-- Product Management Card -->
      <div class="nav-card product-card" @click="navigateToProducts">
        <div class="card-icon">
          <span class="icon">📦</span>
        </div>
        <div class="card-content">
          <h3 class="card-title">Ürün Yönetimi</h3>
          <p class="card-description">
            Ürünleri ekleyin, düzenleyin ve stok durumlarını yönetin. Fotoğraf yükleme ve detaylı ürün bilgileri.
          </p>
          <div class="card-features">
            <span class="feature-tag">Ürün Ekleme</span>
            <span class="feature-tag">Stok Yönetimi</span>
            <span class="feature-tag">Fotoğraf Yükleme</span>
          </div>
        </div>
        <div class="card-arrow">
          <span>→</span>
        </div>
      </div>

      <!-- User Management Card -->
      <div class="nav-card user-card" @click="navigateToUsers">
        <div class="card-icon">
          <span class="icon">👥</span>
        </div>
        <div class="card-content">
          <h3 class="card-title">Kullanıcı Yönetimi</h3>
          <p class="card-description">
            Kullanıcıları görüntüleyin, düzenleyin ve yönetin. Kullanıcı bilgileri ve yetkilendirme işlemleri.
          </p>
          <div class="card-features">
            <span class="feature-tag">Kullanıcı Listesi</span>
            <span class="feature-tag">Yetki Yönetimi</span>
            <span class="feature-tag">Hesap İşlemleri</span>
          </div>
        </div>
        <div class="card-arrow">
          <span>→</span>
        </div>
      </div>
    </div>

    <!-- Quick Stats -->
    <div class="quick-stats">
      <div class="stat-item">
        <div class="stat-icon">📊</div>
        <div class="stat-info">
          <h4>Toplam Ürün</h4>
          <p>Yönetimde olan ürün sayısı</p>
        </div>
      </div>
      <div class="stat-item">
        <div class="stat-icon">👤</div>
        <div class="stat-info">
          <h4>Aktif Kullanıcılar</h4>
          <p>Sistemde kayıtlı kullanıcılar</p>
        </div>
      </div>
      <div class="stat-item">
        <div class="stat-icon">📸</div>
        <div class="stat-info">
          <h4>Toplam Fotoğraf</h4>
          <p>Yüklenen fotoğraf sayısı</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  padding: 24px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.dashboard-header {
  margin-bottom: 40px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  padding: 24px 32px;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
}

.dashboard-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #2d3748;
  margin: 0;
  background: linear-gradient(135deg, #d4af8c, #b8956a);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.logout-btn {
  background: linear-gradient(135deg, #ef4444, #dc2626);
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

.logout-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(239, 68, 68, 0.3);
}

.logout-icon {
  font-size: 1.2rem;
}

.welcome-section {
  text-align: center;
  margin-bottom: 48px;
  background: white;
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
}

.welcome-title {
  font-size: 2rem;
  font-weight: 700;
  color: #2d3748;
  margin: 0 0 16px 0;
}

.welcome-subtitle {
  font-size: 1.1rem;
  color: #4a5568;
  margin: 0;
  line-height: 1.6;
}

.navigation-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 24px;
  margin-bottom: 48px;
}

.nav-card {
  background: white;
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 24px;
  position: relative;
  overflow: hidden;
}

.nav-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(135deg, #d4af8c, #b8956a);
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.nav-card:hover::before {
  transform: scaleX(1);
}

.nav-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
}

.product-card:hover {
  border-color: #d4af8c;
}

.user-card:hover {
  border-color: #3b82f6;
}

.card-icon {
  flex-shrink: 0;
}

.card-icon .icon {
  font-size: 3rem;
  display: block;
}

.card-content {
  flex: 1;
}

.card-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #2d3748;
  margin: 0 0 12px 0;
}

.card-description {
  color: #4a5568;
  margin: 0 0 16px 0;
  line-height: 1.5;
}

.card-features {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.feature-tag {
  background: #f1f5f9;
  color: #475569;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
}

.card-arrow {
  flex-shrink: 0;
  font-size: 1.5rem;
  color: #94a3b8;
  transition: all 0.3s ease;
}

.nav-card:hover .card-arrow {
  color: #d4af8c;
  transform: translateX(4px);
}

.quick-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
}

.stat-item {
  background: white;
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat-icon {
  font-size: 2.5rem;
  background: linear-gradient(135deg, #d4af8c, #b8956a);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.stat-info h4 {
  margin: 0 0 4px 0;
  color: #2d3748;
  font-size: 1.1rem;
  font-weight: 600;
}

.stat-info p {
  margin: 0;
  color: #64748b;
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .dashboard-container {
    padding: 16px;
  }

  .header-content {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }

  .dashboard-title {
    font-size: 2rem;
  }

  .navigation-grid {
    grid-template-columns: 1fr;
  }

  .nav-card {
    flex-direction: column;
    text-align: center;
    gap: 16px;
  }

  .card-arrow {
    display: none;
  }

  .welcome-section {
    padding: 24px;
  }

  .welcome-title {
    font-size: 1.5rem;
  }

  .quick-stats {
    grid-template-columns: 1fr;
  }
}
</style>
