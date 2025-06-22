import api from './api';

const rsvpService = {
  // Get all RSVPs
  getRsvps: async () => {
    const response = await api.get('/api/rsvps');
    return response.data;
  },
  
  // Get RSVP by ID
  getRsvpById: async (id) => {
    const response = await api.get(`/api/rsvps/${id}`);
    return response.data;
  },
  
  // Create RSVP
  createRsvp: async (rsvpData) => {
    const response = await api.post('/api/rsvps', rsvpData);
    return response.data;
  },
  
  // Update RSVP
  updateRsvp: async (id, rsvpData) => {
    const response = await api.put(`/api/rsvps/${id}`, rsvpData);
    return response.data;
  },
  
  // Delete RSVP
  deleteRsvp: async (id) => {
    const response = await api.delete(`/api/rsvps/${id}`);
    return response.data;
  },
  
  // Get RSVPs by event ID
  getRsvpsByEvent: async (eventId) => {
    const response = await api.get(`/api/events/${eventId}/rsvps`);
    return response.data;
  },
  
  // Get RSVPs by guest ID
  getRsvpsByGuest: async (guestId) => {
    const response = await api.get(`/api/guests/${guestId}/rsvps`);
    return response.data;
  },
  
  // Submit public RSVP
  submitPublicRsvp: async (eventId, rsvpData) => {
    const response = await api.post(`/api/events/${eventId}/public-rsvp`, rsvpData);
    return response.data;
  }
};

export default rsvpService;
