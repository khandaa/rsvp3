import api from './api';

const eventService = {
  // Get all events 
  getEvents: async () => {
    const response = await api.get('/api/events');
    return response.data;
  },
  
  // Get event by ID
  getEventById: async (id) => {
    const response = await api.get(`/api/events/${id}`);
    return response.data;
  },
  
  // Create new event
  createEvent: async (eventData) => {
    const response = await api.post('/api/events', eventData);
    return response.data;
  },
  
  // Update event
  updateEvent: async (id, eventData) => {
    const response = await api.put(`/api/events/${id}`, eventData);
    return response.data;
  },
  
  // Delete event
  deleteEvent: async (id) => {
    const response = await api.delete(`/api/events/${id}`);
    return response.data;
  },
  
  // Get public event
  getPublicEvent: async (id) => {
    const response = await api.get(`/api/events/public/${id}`);
    return response.data;
  }
};

export default eventService;
