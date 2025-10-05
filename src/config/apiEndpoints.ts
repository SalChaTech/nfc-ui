export const API_ENDPOINTS = {
  DRIVE: {
    UPLOAD_FILE: '/drive/upload',
    GET_FILES: (folderId) => `/drive/files?folderId=${folderId}`,
    DELETE_FILE: (fileId) => `/drive/files/${fileId}`,
  },
  GOOGLE_AUTH: {
    GOOGLE:'/google-auth/google',
    CALLBACK: (code) => `/google-auth/callback?code=${code}`,
    ME:'/google-auth/me',
    LOGOUT:'/google-auth/logout',
    VALIDATE_TOKEN:'/google-auth/validate-token',
  },
  USER_AUTH: {
    GET_TOKEN: '/user-auth/token',
    VALIDATE_TOKEN: '/user-auth/validate-token',
  },
  USERS: {
    CREATE: '/users',
    GET_ALL: '/users',
    GET_BY_ID: (id) => `/users/${id}`,
    UPDATE_EMAIL_AND_APP_FOLDER_ID: '/users/update-email-and-drive-application-folder-id',
    GET_DRIVE_APPLICATION_FOLDER_ID: (productId) => `/users/drive-application-folder-id/${productId}`
  },
  WEDDING_MEMORIES: {
    GET_ALL: '/wedding-memories',
    GET_BY_USER: '/wedding-memories/by-user',
    UPDATE: '/wedding-memories/update',
  }
};
