import api from './api';

export const eventService = {
  // Public
  getPastEvents: async () => {
    const response = await api.get('/public/events/past');
    return response.data;
  },

  // Member (Protected)
  getUpcomingEvents: async () => {
    const response = await api.get('/events/upcoming');
    return response.data;
  },
  getUpcomingEvent: async (id) => {
    const response = await api.get(`/events/upcoming/${id}`);
    return response.data;
  },
  getMyEvents: async () => {
    const response = await api.get('/members/me/events');
    return response.data;
  },

  // Admin (Protected)
  adminGetEvents: async () => {
    const response = await api.get('/admin/events');
    return response.data;
  },
  createEvent: async (eventData) => {
    const response = await api.post('/admin/events', eventData);
    return response.data;
  },
  updateEvent: async (id, eventData) => {
    const response = await api.patch(`/admin/events/${id}`, eventData);
    return response.data;
  },
  deleteEvent: async (id) => {
    const response = await api.delete(`/admin/events/${id}`);
    return response.data;
  },
  addGalleryImages: async (id, images) => {
    const response = await api.post(`/admin/events/${id}/images`, { images });
    return response.data;
  }
};