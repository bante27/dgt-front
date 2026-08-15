import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const homeVideoAPI = {
  getHomeVideo: () => api.get('/home-video'),
};

export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  verifyRegistrationOtp: (data) => api.post('/auth/verify-registration', data),
  login: (credentials) => api.post('/auth/login', credentials),
  googleAuth: (token) => api.post('/auth/google', { token }),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (formData) => api.put('/auth/profile', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
  forgotPassword: (data) => api.post('/auth/forgot-password', data),
  resetPassword: (data) => api.post('/auth/reset-password', data),
};

export const courseAPI = {
  getCourses: () => api.get('/courses'),
  getCourseById: (id) => api.get(`/courses/${id}`),
  createCourse: (courseData) => api.post('/courses', courseData),
  getLessonVideoToken: (courseId, lessonId) => api.get(`/courses/${courseId}/lessons/${lessonId}/video`),
};

export const assetAPI = {
  getAssets: (params) => api.get('/assets', { params }),
  getAssetState: (id) => api.get(`/assets/${id}`),
  createAsset: (assetData) => api.post('/assets', assetData),
};

export const paymentAPI = {
  initializeChapa: (paymentData) => api.post('/payments/initialize', paymentData),
  verifyPayment: (tx_ref) => api.get(`/payments/verify/${tx_ref}`),
  simulatePayment: (tx_ref) => api.post('/payments/simulate-success', { tx_ref }),
};

export const serviceAPI = {
  submitInquiry: (inquiryData) => api.post('/services/inquiry', inquiryData),
  getInquiries: () => api.get('/services/inquiries'),
};

export const portfolioAPI = {
  getPortfolio: () => api.get('/portfolio'),
  getPortfolioById: (id) => api.get(`/portfolio/${id}`),
  createPortfolioItem: (data) => api.post('/portfolio', data),
};

export const reviewAPI = {
  createReview: (reviewData) => api.post('/reviews', reviewData),
  getReviewsByTarget: (targetId) => api.get(`/reviews/${targetId}`),
};

export const contactAPI = {
  submitContact: (data) => api.post('/contact', data),
};

export const newsletterAPI = {
  subscribe: (email) => api.post('/newsletter/subscribe', { email }),
};

export const statsAPI = {
  getStats: () => api.get('/stats'),
};

export const editingAPI = {
  getPlans: () => api.get('/editing/plans'),
  createOrder: (orderData) => api.post('/editing/orders', orderData),
  initializePayment: (orderData) => api.post('/editing/orders/initialize', orderData),
  verifyPayment: (tx_ref) => api.get(`/editing/orders/verify/${tx_ref}`),
  simulatePayment: (tx_ref) => api.post('/editing/orders/simulate-success', { tx_ref }),
  getMyOrders: () => api.get('/editing/orders/my-orders'),
};

export const editingOrdersAPI = {
  createOrder: (orderData) => api.post('/editing/orders', orderData),
  getMyOrders: () => api.get('/editing/orders/my-orders'),
  getOrders: () => api.get('/editing/orders'),
  updateOrderStatus: (id, status) => api.put(`/editing/orders/${id}/status`, { status }),
};

export default api;