export const API_ENDPOINTS = {
  DRIVE: {
    UPLOAD_FILE: '/drive/upload',
    GET_FILES: (folderId) => `/drive/files?folderId=${folderId}`,
    DELETE_FILE: (fileId) => `/drive/files/${fileId}`
  },
  GOOGLE_AUTH: {
    GOOGLE: '/google-auth/google',
    CALLBACK: (code) => `/google-auth/callback?code=${code}`,
    ME: '/google-auth/me',
    LOGOUT: '/google-auth/logout',
    VALIDATE_TOKEN: '/google-auth/validate-token'
  },
  WEDDING_MEMORY_DATA: {
    GET_BY_PRODUCT_ID: (id) => `/wedding-memory-data/by-product-id/${id}`,
    UPDATE: (id) => `/wedding-memory-data/${id}/update`
  },

  USER_PRODUCT: {
    GET_BY_ID: (id) => `/user-product/${id}`,
    CLAIM_PRODUCT: (id) => `/user-product/${id}/claim`,
    UPDATE_FOLDER_ID: (id) => `/user-product/${id}/update-folder-id`,
  }
}
