import api from './api';

const userService = {
  // Get all users
  getUsers: async () => {
    const response = await api.get('/api/users');
    return response.data;
  },
  
  // Get user by ID
  getUserById: async (id) => {
    const response = await api.get(`/api/users/${id}`);
    return response.data;
  },
  
  // Create new user
  createUser: async (userData) => {
    const response = await api.post('/api/users', userData);
    return response.data;
  },
  
  // Update user
  updateUser: async (id, userData) => {
    const response = await api.put(`/api/users/${id}`, userData);
    return response.data;
  },
  
  // Delete user
  deleteUser: async (id) => {
    const response = await api.delete(`/api/users/${id}`);
    return response.data;
  },
  
  // Get current user profile
  getCurrentUser: async () => {
    const response = await api.get('/api/users/me');
    return response.data;
  },
  
  // Update current user profile
  updateProfile: async (profileData) => {
    const response = await api.put('/api/users/profile', profileData);
    return response.data;
  },
  
  // Change password
  changePassword: async (passwordData) => {
    const response = await api.post('/api/users/change-password', passwordData);
    return response.data;
  }
};

export default userService;
