import axios from 'axios';

// Custom error logging function
const logError = (error) => {
  const errorContext = {
    message: error.message,
    code: error.code,
    status: error.response?.status,
    url: error.config?.url,
    method: error.config?.method,
    timestamp: new Date().toISOString()
  };

  // In a real-world app, you might send this to a logging service
  console.error('API Error:', JSON.stringify(errorContext, null, 2));

  return Promise.reject(error);
};

const api = axios.create({
  baseURL: process.env.NODE_ENV === 'development' 
    ? 'http://localhost:5001/api' 
    : '/api',
  timeout: 10000, // 10 seconds
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Add a request interceptor to include the token in every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return logError(error);
  }
);

// Add a response interceptor for global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle specific error scenarios
    if (error.response) {
      switch (error.response.status) {
        case 401: // Unauthorized
          // Clear token and redirect to login
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
          break;
        case 403: // Forbidden
          console.warn('You do not have permission to perform this action.');
          break;
        case 404: // Not Found
          console.warn('The requested resource was not found.');
          break;
        case 500: // Internal Server Error
          console.error('A server error occurred. Please try again later.');
          break;
      }
    } else if (error.request) {
      // Request made but no response received
      console.error('No response received from server');
    }

    return logError(error);
  }
);

// Pets API
export const getPets = (filters = {}) => {
  return api.get('/pets', { params: filters });
};

export const getPetById = (petId) => {
  return api.get(`/pets/${petId}`);
};

export const createPet = (petData) => {
  // Check if petData is FormData (for file uploads)
  const headers = petData instanceof FormData ? {
    'Content-Type': 'multipart/form-data'
  } : {};
  
  return api.post('/pets', petData, { headers });
};

export const updatePet = (petId, petData) => {
  // Check if petData is FormData (for file uploads)
  const headers = petData instanceof FormData ? {
    'Content-Type': 'multipart/form-data'
  } : {};
  
  return api.put(`/pets/${petId}`, petData, { headers });
};

export const deletePet = (petId) => {
  return api.delete(`/pets/${petId}`);
};

export const adoptPet = (petId) => {
  return api.patch(`/pets/${petId}/adopt`);
};

export const getMyPets = () => {
  return api.get('/pets/my-pets');
};

// Auth API functions
export const getCurrentUser = () => {
  return api.get('/auth/me');
};

// Admin API functions
export const getUsers = () => {
  return api.get('/users');
};

export const getUserById = (userId) => {
  return api.get(`/users/${userId}`);
};

export const updateUser = (userId, userData) => {
  return api.put(`/users/${userId}`, userData);
};

export const deleteUser = (userId) => {
  return api.delete(`/users/${userId}`);
};

export const getStats = () => {
  return api.get('/admin/stats');
};

export default api;
