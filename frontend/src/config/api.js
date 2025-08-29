// API Configuration
const API_CONFIG = {
  // Development
  development: {
    baseURL: 'http://localhost:3005',
    uploadsURL: 'http://localhost:3005/uploads'
  },
  // Production (update with your actual production URL)
  production: {
    baseURL: import.meta.env.VITE_API_URL || 'https://your-production-api.com',
    uploadsURL: import.meta.env.VITE_UPLOADS_URL || 'https://your-production-api.com/uploads'
  }
};

// Get current environment
const environment = import.meta.env.MODE || 'development';

// Export current configuration
export const API_BASE_URL = API_CONFIG[environment].baseURL;
export const UPLOADS_URL = API_CONFIG[environment].uploadsURL;

// API endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  register: `${API_BASE_URL}/account/register`,
  login: `${API_BASE_URL}/account/login`,
  logout: `${API_BASE_URL}/account/logout`,
  verifyEmailOTP: `${API_BASE_URL}/account/verify-email-otp`,
  resendOTP: `${API_BASE_URL}/account/resend-otp`,
  verifyOTP: `${API_BASE_URL}/account/verify-otp`,
  sendOTP: `${API_BASE_URL}/account/send-otp-password`,
  resetPassword: `${API_BASE_URL}/account/reset-password`,
  
  // Student verification endpoints
  uploadStudentID: `${API_BASE_URL}/account/upload-student-id`,
  getVerificationStatus: `${API_BASE_URL}/account/verification-status`,
  getPendingVerifications: `${API_BASE_URL}/account/pending-verifications`,
  verifyStudentID: `${API_BASE_URL}/account/verify-student-id`,
  
  // Product endpoints
  getProducts: `${API_BASE_URL}/account/get-product`,
  getProduct: (id) => `${API_BASE_URL}/account/get-product/${id}`,
  postProduct: `${API_BASE_URL}/account/post-product`,
  
  // User endpoints
  getProfile: `${API_BASE_URL}/user/get-profile`,
  updateProfile: `${API_BASE_URL}/user/update-profile`,
  getSeller: (id) => `${API_BASE_URL}/user/get-seller/${id}`,
  sellerProducts: `${API_BASE_URL}/user/seller-products`,
  deleteProduct: (id) => `${API_BASE_URL}/user/delete-product/${id}`,
  viewProduct: (id) => `${API_BASE_URL}/user/view-product/${id}`,
  editProduct: (id) => `${API_BASE_URL}/user/edit-product/${id}`,
  getComments: (id) => `${API_BASE_URL}/user/get-comments/${id}`,
  createComment: (id) => `${API_BASE_URL}/user/create-comment/${id}`,
  
  // Category endpoints
  category: (category) => `${API_BASE_URL}/category/${category}`,
  
  // Message endpoints
  chattedUsers: `${API_BASE_URL}/message/chatted-users`,
  getMessages: (id) => `${API_BASE_URL}/message/${id}`,
  sendMessage: (id) => `${API_BASE_URL}/message/send/${id}`,
  
  // Search endpoints
  searchTitle: (query) => `${API_BASE_URL}/search/title/${query}`,
  searchLocation: (query) => `${API_BASE_URL}/search/location/${query}`,
  searchCategory: (query) => `${API_BASE_URL}/search/category/${query}`,
  searchAll: (query) => `${API_BASE_URL}/search/all/${query}`,
  
  // Chatbot endpoint
  chatbot: `${API_BASE_URL}/chatbot`,
};

// Helper function to get image URL
export const getImageURL = (imagePath) => {
  if (!imagePath) return '';
  return `${UPLOADS_URL}/${imagePath}`;
};

export default API_CONFIG;
