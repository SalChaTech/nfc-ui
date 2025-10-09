<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <h1 class="login-title">Admin Girişi</h1>
        <p class="login-subtitle">Yönetim paneline erişim için giriş yapın</p>
      </div>
      
      <form class="login-form">
        <div class="form-group">
          <label for="username" class="form-label">Kullanıcı Adı</label>
          <input 
            type="text" 
            id="username" 
            class="form-input" 
            placeholder="Kullanıcı adınızı girin"
          />
        </div>
        
        <div class="form-group">
          <label for="password" class="form-label">Şifre</label>
          <input 
            type="password" 
            id="password" 
            class="form-input" 
            placeholder="Şifrenizi girin"
          />
        </div>
        
        <div class="form-options">
          <label class="checkbox-container">
            <input type="checkbox" class="checkbox-input">
            <span class="checkbox-text">Beni hatırla</span>
          </label>
          <a href="#" class="forgot-password">Şifremi unuttum</a>
        </div>
        
        <button type="submit" class="login-button">
          <span class="button-text">Giriş Yap</span>
          <div class="button-icon">→</div>
        </button>
      </form>
      
      <div class="login-footer">
        <p class="footer-text">© 2024 SalchaTech. Tüm hakları saklıdır.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f1eb 0%, #e8dcc0 100%);
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.login-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 40px;
  width: 100%;
  max-width: 420px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.login-title {
  font-size: 2.2rem;
  font-weight: 700;
  color: #2d3748;
  margin: 0 0 8px 0;
  background: linear-gradient(135deg, #d4af8c, #b8956a);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.login-subtitle {
  color: #718096;
  font-size: 0.95rem;
  margin: 0;
}

.login-form {
  margin-bottom: 30px;
}

.form-group {
  margin-bottom: 24px;
}

.form-label {
  display: block;
  font-weight: 600;
  color: #4a5568;
  margin-bottom: 8px;
  font-size: 0.9rem;
}

.form-input {
  width: 100%;
  padding: 14px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: #f8fafc;
  box-sizing: border-box;
}

.form-input:focus {
  outline: none;
  border-color: #d4af8c;
  background: white;
  box-shadow: 0 0 0 3px rgba(212, 175, 140, 0.1);
}

.form-input::placeholder {
  color: #a0aec0;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.checkbox-container {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.checkbox-input {
  margin-right: 8px;
  width: 16px;
  height: 16px;
  accent-color: #d4af8c;
}

.checkbox-text {
  font-size: 0.9rem;
  color: #4a5568;
}

.forgot-password {
  color: #d4af8c;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  transition: color 0.3s ease;
}

.forgot-password:hover {
  color: #b8956a;
}

.login-button {
  width: 100%;
  background: linear-gradient(135deg, #4ade80, #22c55e);
  color: white;
  border: none;
  padding: 16px;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  position: relative;
  overflow: hidden;
}

.login-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(74, 222, 128, 0.3);
}

.login-button:active {
  transform: translateY(0);
}

.button-text {
  z-index: 1;
}

.button-icon {
  font-size: 1.2rem;
  transition: transform 0.3s ease;
  z-index: 1;
}

.login-button:hover .button-icon {
  transform: translateX(4px);
}

.login-footer {
  text-align: center;
  padding-top: 20px;
  border-top: 1px solid #e2e8f0;
}

.footer-text {
  color: #a0aec0;
  font-size: 0.8rem;
  margin: 0;
}

/* Responsive Design */
@media (max-width: 480px) {
  .login-card {
    padding: 30px 20px;
    margin: 10px;
  }
  
  .login-title {
    font-size: 1.8rem;
  }
  
  .form-options {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }
}

/* Animation for card entrance */
@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.login-card {
  animation: slideInUp 0.6s ease-out;
}
</style>
