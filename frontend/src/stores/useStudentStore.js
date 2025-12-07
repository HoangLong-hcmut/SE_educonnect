import { create } from 'zustand'
import { toast } from 'sonner'
import { studentService } from '../services/studentService'

export const useStudentStore = create((set) => ({
  loading: false,
  availableCourses: [],
  joinedCourses: [],
  sessions: [],
  scores: [],
  activity: [],
  feedbacks: [],
  resources: [],

  joinCourse: async (courseId) => {
    try {
      set({ loading: true })
      await studentService.joinCourse(courseId)

      // Update local state: remove the joined course from the list
      set(state => ({
        availableCourses: state.availableCourses.filter(c => c.course_id !== courseId)
      }))

      toast.success('Joined course successfully')
    } catch (error) {
      console.error(error)
      toast.error(error.response?.data?.message || 'Failed to join course')
    } finally {
      set({ loading: false })
    }
  },

  fetchAvailableCourses: async () => {
    try {
      set({ loading: true })
      const courses = await studentService.getAvailableCourses()
      set({ availableCourses: courses })
    } catch (error) {
      console.error(error)
      toast.error('Failed to fetch available courses')
    } finally {
      set({ loading: false })
    }
  },

  fetchJoinedCourses: async () => {
    try {
      set({ loading: true })
      const courses = await studentService.getJoinedCourses()
      set({ joinedCourses: courses })
    } catch (error) {
      console.error(error)
      toast.error('Failed to fetch joined courses')
    } finally {
      set({ loading: false })
    }
  },

  fetchSessions: async () => {
    try {
      set({ loading: true })
      const sessions = await studentService.getSessions()
      set({ sessions })
    } catch (error) {
      console.error(error)
      toast.error('Failed to fetch sessions')
    } finally {
      set({ loading: false })
    }
  },

  fetchDashboardData: async () => {
    try {
      set({ loading: true })
      const [sessions, scores, activity, feedbacks] = await Promise.all([
        studentService.getSessions(),
        studentService.getScores(),
        studentService.getActivity(),
        studentService.getFeedbacks()
      ])
      set({ sessions, scores, activity, feedbacks })
    } catch (error) {
      console.error(error)
      toast.error('Failed to fetch dashboard data')
    } finally {
      set({ loading: false })
    }
  },

  fetchResources: async () => {
    try {
      set({ loading: true })
      const resources = await studentService.getResources()
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
  }
}))