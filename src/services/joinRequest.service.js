import api from './api';

export const joinRequestService = {
  submitRequest: async (requestData) => {
    const response = await api.post('/public/join-requests', requestData);
    return response.data;
  },

  getRequests: async (status) => {
    const endpoint = status 
      ? `/admin/join-requests?status=${status}` 
      : '/admin/join-requests';
    const response = await api.get(endpoint);
    return response.data;
  },

  // Sends status and optional initial password
  updateRequest: async (id, status, password = undefined) => {
    const payload = { status };
    if (password) {
      payload.password = password;
    }
    const response = await api.patch(`/admin/join-requests/${id}`, payload);
    return response.data;
  }
};