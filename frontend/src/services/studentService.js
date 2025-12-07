import api from '../lib/axios'

export const studentService = {
  getAvailableCourses: async () => {
    const res = await api.get('/students/courses')
    return res.data
  },

  getJoinedCourses: async () => {
    const res = await api.get('/students/courses/joined')
    return res.data
  },

  joinCourse: async (courseId) => {
    const res = await api.post('/students/courses/join', { courseId })
    return res.data
  },

  getSessions: async () => {
    const res = await api.get('/students/sessions')
    return res.data
  },

  getScores: async () => {
    const res = await api.get('/students/scores')
    return res.data
  },

  getActivity: async () => {
    const res = await api.get('/students/activity')
    return res.data
  },

  getFeedbacks: async () => {
    const res = await api.get('/students/feedbacks')
    return res.data
  },

  getResources: async () => {
    const res = await api.get('/students/resources')
    return res.data
  }
}