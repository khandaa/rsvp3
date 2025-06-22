import api from './api';

const settingsService = {
  // Get all system settings
  getSettings: async () => {
    const response = await api.get('/api/settings');
    return response.data;
  },
  
  // Get setting by key
  getSettingByKey: async (key) => {
    const response = await api.get(`/api/settings/${key}`);
    return response.data;
  },
  
  // Update settings
  updateSettings: async (settingsData) => {
    const response = await api.put('/api/settings', settingsData);
    return response.data;
  },
  
  // Reset settings to default
  resetSettings: async () => {
    const response = await api.post('/api/settings/reset');
    return response.data;
  },
  
  // Get email templates
  getEmailTemplates: async () => {
    const response = await api.get('/api/settings/email-templates');
    return response.data;
  },
  
  // Update email template
  updateEmailTemplate: async (templateId, templateData) => {
    const response = await api.put(`/api/settings/email-templates/${templateId}`, templateData);
    return response.data;
  }
};

export default settingsService;
