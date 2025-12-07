import axios from '../lib/axios'

export const adminService = {
  getDashboardStats: async () => {
    const response = await axios.get('/admin/dashboard-stats')
    return response.data
  },
  getReviews: async () => {
    const response = await axios.get('/admin/reviews')
    return response.data
  },
  getResources: async () => {
    const response = await axios.get('/admin/resources')
    return response.data
  },
  getTutorApprovals: async () => {
    const response = await axios.get('/admin/tutor-approvals')
    return response.data
  },
  updateTutorApprovalStatus: async (id, status) => {
    const response = await axios.put(`/admin/tutor-approvals/${id}`, { status })
    return response.data
  }
}
