import api from './api';

const guestService = {
  // Get all guests
  getGuests: async () => {
    const response = await api.get('/api/guests');
    return response.data;
  },
  
  // Get guest by ID
  getGuestById: async (id) => {
    const response = await api.get(`/api/guests/${id}`);
    return response.data;
  },
  
  // Create guest
  createGuest: async (guestData) => {
    const response = await api.post('/api/guests', guestData);
    return response.data;
  },
  
  // Update guest
  updateGuest: async (id, guestData) => {
    const response = await api.put(`/api/guests/${id}`, guestData);
    return response.data;
  },
  
  // Delete guest
  deleteGuest: async (id) => {
    const response = await api.delete(`/api/guests/${id}`);
    return response.data;
  },
  
  // Get guests by event ID
  getGuestsByEvent: async (eventId) => {
    const response = await api.get(`/api/events/${eventId}/guests`);
    return response.data;
  },
  
  // Import guests
  importGuests: async (eventId, fileData) => {
    const formData = new FormData();
    formData.append('file', fileData);
    const response = await api.post(`/api/events/${eventId}/guests/import`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
};

export default guestService;
