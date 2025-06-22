import api from './api';

const logsService = {
  // Get all activity logs
  getLogs: async (params = {}) => {
    const response = await api.get('/api/logs', { params });
    return response.data;
  },
  
  // Get log by ID
  getLogById: async (id) => {
    const response = await api.get(`/api/logs/${id}`);
    return response.data;
  },
  
  // Get logs by user ID
  getLogsByUser: async (userId) => {
    const response = await api.get(`/api/logs/user/${userId}`);
    return response.data;
  },
  
  // Get logs by event ID
  getLogsByEvent: async (eventId) => {
    const response = await api.get(`/api/logs/event/${eventId}`);
    return response.data;
  },
  
  // Delete logs older than X days
  deleteOldLogs: async (days) => {
    const response = await api.delete(`/api/logs/older-than/${days}`);
    return response.data;
  },
  
  // Export logs to CSV
  exportLogs: async (filters = {}) => {
    const response = await api.get('/api/logs/export', { 
      params: filters,
      responseType: 'blob'
    });
    return response.data;
  }
};

export default logsService;
