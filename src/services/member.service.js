import api from './api';

export const memberService = {
  // Public Endpoints
  getPublicMembers: async () => {
    const response = await api.get('/public/members');
    return response.data;
  },
  getPublicMember: async (id) => {
    const response = await api.get(`/public/members/${id}`);
    return response.data;
  },

  // Member Private Endpoints
  getMyProfile: async () => {
    const response = await api.get('/members/me');
    return response.data;
  },
  updateMyProfile: async (profileData) => {
    const response = await api.patch('/members/me', profileData);
    return response.data;
  },

  // Admin Management Endpoints
  adminGetMembers: async () => {
    const response = await api.get('/admin/members');
    return response.data;
  },
  createMember: async (memberData) => {
    const response = await api.post('/admin/members', memberData);
    return response.data;
  },
  adminUpdateMember: async (id, updateData) => {
    const response = await api.patch(`/admin/members/${id}`, updateData);
    return response.data;
  },
  deleteMember: async (id) => {
    const response = await api.delete(`/admin/members/${id}`);
    return response.data;
  }
};