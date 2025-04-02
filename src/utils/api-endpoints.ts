/**
 * API Endpoints for the Electronics Store Admin
 * Base URL: /api/v1
 */

export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: '/api/v1/auth/login',
  REFRESH_TOKEN: '/api/v1/auth/refresh-token',
  LOGOUT: '/api/v1/auth/logout',
  CHANGE_PASSWORD: '/api/v1/auth/change-password',
  FORGOT_PASSWORD: '/api/v1/auth/forgot-password',
  RESET_PASSWORD: '/api/v1/auth/reset-password',
  
  // Users endpoints
  USERS: '/api/v1/users',
  CREATE_USER: '/api/v1/users/create',
  USER_BY_ID: (id: number) => `/api/v1/users/${id}`,
  UPDATE_USER_STATUS: (id: number) => `/api/v1/users/${id}/status`,
  
  // Products endpoints
  PRODUCTS: '/api/v1/products',
  PRODUCT_BY_ID: (id: number) => `/api/v1/products/${id}`,
  UPLOAD_PRODUCT_IMAGE: '/api/v1/products/upload-image',
  UPDATE_PRODUCT_STATUS: (id: number) => `/api/v1/products/${id}/status`,
  CREATE_PRODUCT_WITH_IMAGES: '/api/v1/products/with-images',
  UPDATE_PRODUCT_WITH_IMAGES: (id: number) => `/api/v1/products/${id}/with-images`,
  
  // Categories endpoints
  CATEGORIES: '/api/v1/categories',
  CATEGORY_BY_ID: (id: number) => `/api/v1/categories/${id}`,
  CREATE_CATEGORY_WITH_IMAGE: '/api/v1/categories/with-image',
  UPDATE_CATEGORY_WITH_IMAGE: (id: number) => `/api/v1/categories/${id}/with-image`,
  
  // Health check endpoints
  HEALTH: '/api/v1/health',
  HEALTH_INFO: '/api/v1/health/info'
}; 