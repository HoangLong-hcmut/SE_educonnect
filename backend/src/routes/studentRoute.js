import express from 'express'
import { 
  joinCourse, 
  getAvailableCourses, 
  getJoinedCourses,
  getStudentSessions,
  getStudentScores,
  getStudentActivity,
  getStudentFeedbacks,
  getResources
} from '../controllers/studentController.js'

const router = express.Router()

router.post('/courses/join', joinCourse)
router.get('/courses', getAvailableCourses)
router.get('/courses/joined', getJoinedCourses)
router.get('/sessions', getStudentSessions)
router.get('/scores', getStudentScores)
router.get('/activity', getStudentActivity)
router.get('/feedbacks', getStudentFeedbacks)
router.get('/resources', getResources)

export default router