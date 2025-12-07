import express from 'express'
import { 
  createCourse, 
  getCourses, 
  createTutoringSession, 
  getTutoringSessions,
  getTutors,
  getAllCoursesForStudent,
  getMentees,
  getTutorProfile,
  updateTutorProfile,
  getResources,
  getStats
} from '../controllers/tutorController.js'

const router = express.Router()

router.post('/courses', createCourse)
router.get('/courses', getCourses)
router.get('/all-courses', getAllCoursesForStudent)

router.post('/tutoring-sessions', createTutoringSession)
router.get('/tutoring-sessions', getTutoringSessions)

router.get('/mentees', getMentees)

router.get('/tutors', getTutors)
router.get('/profile', getTutorProfile)
router.put('/profile', updateTutorProfile)

router.get('/resources', getResources)
router.get('/stats', getStats)

export default router
