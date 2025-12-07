import * as TutoringSessionModel from '../models/TutoringSession.js'
import * as CourseModel from '../models/Course.js'
import * as StudentScoreModel from '../models/StudentScore.js'
import * as StudyActivityModel from '../models/StudyActivity.js'
import * as ResourceModel from '../models/Resource.js'

export const joinCourse = async (req, res) => {
  try {
    const { courseId } = req.body
    const studentId = req.user.user_id

    await CourseModel.joinCourse(courseId, studentId)
    
    res.status(200).json({ message: 'Joined course successfully' })
  } catch (error) {
    console.error('Join course error:', error)
    if (error.message === 'Course is full' || error.message === 'Already joined this course') {
      return res.status(400).json({ message: error.message })
    }
    res.status(500).json({ message: 'Internal server error' })
  }
}

export const getAvailableCourses = async (req, res) => {
  try {
    const studentId = req.user.user_id
    const courses = await CourseModel.getAvailableCoursesForStudent(studentId)
    res.status(200).json(courses)
  } catch (error) {
    console.error('Get available courses error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

export const getStudentSessions = async (req, res) => {
  try {
    const studentId = req.user.user_id
    const sessions = await TutoringSessionModel.getTutoringSessionsByStudentId(studentId)
    res.status(200).json(sessions)
  } catch (error) {
    console.error('Get student sessions error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

export const getStudentScores = async (req, res) => {
  try {
    const studentId = req.user.user_id
    const scores = await StudentScoreModel.getScoresByStudentId(studentId)
    res.status(200).json(scores)
  } catch (error) {
    console.error('Get student scores error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

export const getStudentActivity = async (req, res) => {
  try {
    const studentId = req.user.user_id
    const activity = await StudyActivityModel.getActivityByStudentId(studentId)
    res.status(200).json(activity)
  } catch (error) {
    console.error('Get student activity error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

export const getStudentFeedbacks = async (req, res) => {
  try {
    const studentId = req.user.user_id
    const feedbacks = await TutoringSessionModel.getFeedbacksByStudentId(studentId)
    res.status(200).json(feedbacks)
  } catch (error) {
    console.error('Get student feedbacks error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

export const getJoinedCourses = async (req, res) => {
  try {
    const studentId = req.user.user_id
    const courses = await CourseModel.getJoinedCoursesForStudent(studentId)
    res.status(200).json(courses)
  } catch (error) {
    console.error('Get joined courses error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

export const getResources = async (req, res) => {
  try {
    const resources = await ResourceModel.getAllResources()

    const formattedResources = resources.map(r => ({
      id: r.resource_id,
      title: r.title,
      author: `${r.firstname} ${r.lastname}`,
      type: r.type,
      subject: r.subject,
      uploaded: r.created_at,
      status: r.status,
      image: r.image_url,
      views: r.views,
      isSaved: false, // Mock
      isMyUpload: false
    }))

    res.status(200).json(formattedResources)
  } catch (error) {
    console.error('Get resources error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

