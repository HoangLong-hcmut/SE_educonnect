import { create } from 'zustand'
import { toast } from 'sonner'
import { tutorService } from '../services/tutorService'

export const useTutorStore = create((set) => ({
  courses: [],
  allCourses: [],
  sessions: [],
  tutors: [],
  mentees: [],
  resources: [],
  stats: { averageRating: 0 },
  profile: null,
  loading: false,

  // Actions for Courses
  fetchCourses: async () => {
    try {
      set({ loading: true })
      const courses = await tutorService.getCourses()
      set({ courses })
    } catch (error) {
      console.error(error)
      toast.error('Failed to fetch courses')
    } finally {
      set({ loading: false })
    }
  },

  fetchAllCourses: async () => {
    try {
      set({ loading: true })
      const allCourses = await tutorService.getAllCourses()
      set({ allCourses })
    } catch (error) {
      console.error(error)
      toast.error('Failed to fetch all courses')
    } finally {
      set({ loading: false })
    }
  },

  createCourse: async (courseData) => {
    try {
      set({ loading: true })
      const newCourse = await tutorService.createCourse(courseData)
      // Cập nhật danh sách courses ngay lập tức mà không cần fetch lại
      set((state) => ({ courses: [...state.courses, newCourse] }))
      toast.success('Course created successfully')
      return newCourse
    } catch (error) {
      console.error(error)
      toast.error('Failed to create course')
      throw error
    } finally {
      set({ loading: false })
    }
  },

  // Actions for Tutoring Sessions
  fetchTutoringSessions: async () => {
    try {
      set({ loading: true })
      const sessions = await tutorService.getTutoringSessions()
      set({ sessions })
    } catch (error) {
      console.error(error)
      toast.error('Failed to fetch sessions')
    } finally {
      set({ loading: false })
    }
  },

  createTutoringSession: async (sessionData) => {
    try {
      set({ loading: true })
      const newSession = await tutorService.createTutoringSession(sessionData)
      // Cập nhật danh sách sessions ngay lập tức
      set((state) => ({ sessions: [...state.sessions, newSession] }))
      toast.success('Session created successfully')
      return newSession
    } catch (error) {
      console.error(error)
      toast.error('Failed to create session')
      throw error
    } finally {
      set({ loading: false })
    }
  },

  fetchTutors: async () => {
    try {
      set({ loading: true })
      const tutors = await tutorService.getTutors()
      set({ tutors })
    } catch (error) {
      console.error(error)
      toast.error('Failed to fetch tutors list')
      throw error
    } finally {
      set({ loading: false })
    }
  },

  fetchMentees: async () => {
    try {
      set({ loading: true })
      const mentees = await tutorService.getMentees()
      set({ mentees })
    } catch (error) {
      console.error(error)
      toast.error('Failed to fetch mentees')
    } finally {
      set({ loading: false })
    }
  },

  fetchProfile: async () => {
    try {
      set({ loading: true })
      const profile = await tutorService.getProfile()
      set({ profile })
    } catch (error) {
      console.error(error)
      toast.error('Failed to fetch profile')
    } finally {
      set({ loading: false })
    }
  },

  updateProfile: async (profileData) => {
    try {
      set({ loading: true })
      await tutorService.updateProfile(profileData)
      set((state) => ({ profile: { ...state.profile, ...profileData } }))
      toast.success('Profile updated successfully')
    } catch (error) {
      console.error(error)
      toast.error('Failed to update profile')
    } finally {
      set({ loading: false })
    }
  },

  fetchResources: async () => {
    try {
      set({ loading: true })
      const resources = await tutorService.getResources()
      set({ resources })
    } catch (error) {
      console.error(error)
      toast.error('Failed to fetch resources')
    } finally {
      set({ loading: false })
    }
  },

  fetchStats: async () => {
    try {
      set({ loading: true })
      const stats = await tutorService.getStats()
      set({ stats })
    } catch (error) {
      console.error(error)
      toast.error('Failed to fetch stats')
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
