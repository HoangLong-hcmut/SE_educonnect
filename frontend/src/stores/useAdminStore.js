import { create } from 'zustand'
import { toast } from 'sonner'
import { adminService } from '../services/adminService'

export const useAdminStore = create((set) => ({
  stats: null,
  reviews: [],
  resources: [],
  tutorApprovals: [],
  loading: false,

  fetchDashboardStats: async () => {
    try {
      set({ loading: true })
      const stats = await adminService.getDashboardStats()
      set({ stats })
    } catch (error) {
      console.error(error)
      toast.error('Failed to fetch admin dashboard stats')
    } finally {
      set({ loading: false })
    }
  },

  fetchReviews: async () => {
    try {
      set({ loading: true })
      const reviews = await adminService.getReviews()
      set({ reviews })
    } catch (error) {
      console.error(error)
      toast.error('Failed to fetch reviews')
    } finally {
      set({ loading: false })
    }
  },

  fetchResources: async () => {
    try {
      set({ loading: true })
      const resources = await adminService.getResources()
      set({ resources })
    } catch (error) {
      console.error(error)
      toast.error('Failed to fetch resources')
    } finally {
      set({ loading: false })
    }
  },

  toggleSaveResource: (id) => {
    set((state) => ({
      resources: state.resources.map((r) =>
        r.id === id ? { ...r, isSaved: !r.isSaved } : r
      ),
    }))
  },

  fetchTutorApprovals: async () => {
    try {
      set({ loading: true })
      const tutorApprovals = await adminService.getTutorApprovals()
      set({ tutorApprovals })
    } catch (error) {
      console.error(error)
      toast.error('Failed to fetch tutor approvals')
    } finally {
      set({ loading: false })
    }
  },

  updateTutorApprovalStatus: async (id, status) => {
    try {
      await adminService.updateTutorApprovalStatus(id, status)
      set((state) => ({
        tutorApprovals: state.tutorApprovals.map((req) =>
          req.id === id ? { ...req, status } : req
        ),
      }))
      toast.success(`Tutor request ${status.toLowerCase()} successfully`)
    } catch (error) {
      console.error(error)
      toast.error('Failed to update status')
    }
  }
}))
