import api from '../lib/axios'

export const tutorService = {
  // Course APIs
  createCourse: async (courseData) => {
    const res = await api.post('/tutors/courses', courseData)
    return res.data
  },

  getCourses: async () => {
    const res = await api.get('/tutors/courses')
    return res.data
  },

  getAllCourses: async () => {
    const res = await api.get('/tutors/all-courses')
    return res.data
  },

  // Tutoring Session APIs
  createTutoringSession: async (sessionData) => {
    const res = await api.post('/tutors/tutoring-sessions', sessionData)
    return res.data
  },

  getTutoringSessions: async () => {
    const res = await api.get('/tutors/tutoring-sessions')
    return res.data
  },

  getMentees: async () => {
    const res = await api.get('/tutors/mentees')
    return res.data
  },

  // Tutor APIs
  getTutors: async () => {
    const res = await api.get('/tutors/tutors')
    return res.data
  },

  getProfile: async () => {
    const res = await api.get('/tutors/profile')
    return res.data
  },

  updateProfile: async (profileData) => {
    const res = await api.put('/tutors/profile', profileData)
    return res.data
  },

  getResources: async () => {
    const res = await api.get('/tutors/resources')
    return res.data
  },

  getStats: async () => {
    const res = await api.get('/tutors/stats')
    return res.data
  }
}
