import * as CourseModel from '../models/Course.js'
import * as TutoringSessionModel from '../models/TutoringSession.js'
import * as UserModel from '../models/User.js'
import * as TutorProfileModel from '../models/TutorProfile.js'
import * as ResourceModel from '../models/Resource.js'

export const createCourse = async (req, res) => {
  try {
    const {
      title,
      subject,
      description,
      max_students,
      start_date,
      end_date,
      start_time,
      end_time,
      registration_start,
      registration_end,
      recurrence_type,
      days_of_week
    } = req.body;
    const tutorId = req.user.user_id;

    // Only create the course, do not generate tutoring sessions
    const courseId = await CourseModel.createCourse(
      tutorId,
      title,
      subject,
      description,
      max_students,
      start_date,
      end_date,
      start_time,
      end_time,
      registration_start,
      registration_end,
      recurrence_type,
      days_of_week
    );

    res.status(201).json({ message: 'Course created successfully', courseId });
  } catch (error) {
    console.error('Create course error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export const getCourses = async (req, res) => {
  try {
    const tutorId = req.user.user_id
    const courses = await CourseModel.getCoursesByTutorId(tutorId)
    res.status(200).json(courses)
  } catch (error) {
    console.error('Get courses error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

export const createTutoringSession = async (req, res) => {
  try {
    const { subject, sessionDate, sessionTime } = req.body
    const tutorId = req.user.user_id

    // studentId can be optional/null now
    const sessionId = await TutoringSessionModel.createTutoringSession(tutorId, subject, sessionDate, sessionTime)
    
    res.status(201).json({ message: 'Session created successfully', sessionId })
  } catch (error) {
    console.error('Create session error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

export const getTutoringSessions = async (req, res) => {
  try {
    const tutorId = req.user.user_id
    const sessions = await TutoringSessionModel.getTutoringSessionsByTutorId(tutorId)
    res.status(200).json(sessions)
  } catch (error) {
    console.error('Get sessions error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

export const getTutors = async (req, res) => {
  try {
    const tutors = await UserModel.getTutors()
    res.status(200).json(tutors)
  } catch (error) {
    console.error('Get tutors list error', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

export const getAllCoursesForStudent = async (req, res) => {
  try {
    const courses = await CourseModel.getAllCoursesWithTutorInfo()
    res.status(200).json(courses)
  } catch (error) {
    console.error('Get all courses error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

export const getTutorProfile = async (req, res) => {
  try {
    const tutorId = req.user.user_id
    const profile = await TutorProfileModel.getProfileByTutorId(tutorId)
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' })
    }
    const expertise = await TutorProfileModel.getExpertiseByTutorId(tutorId)
    const subjects = await TutorProfileModel.getSubjectsByTutorId(tutorId)
    const qualifications = await TutorProfileModel.getQualificationsByTutorId(tutorId)

    res.status(200).json({ ...profile, expertise, subjects, qualifications })
  } catch (error) {
    console.error('Get tutor profile error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

export const updateTutorProfile = async (req, res) => {
  try {
    const tutorId = req.user.user_id
    const { biography, isPaused, expertise, subjects, qualifications } = req.body

    await TutorProfileModel.updateProfile(tutorId, biography, isPaused)
    await TutorProfileModel.updateExpertise(tutorId, expertise)
    await TutorProfileModel.updateSubjects(tutorId, subjects)
    await TutorProfileModel.updateQualifications(tutorId, qualifications)

    res.status(200).json({ message: 'Profile updated successfully' })
  } catch (error) {
    console.error('Update tutor profile error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

export const getMentees = async (req, res) => {
  try {
    // Mock implementation for now as per request to use DB but logic for mentees is complex
    // Assuming we fetch students who have sessions with this tutor
    // For now, let's return the mock data structure but fetched from DB if possible
    // Or just return empty if no logic implemented yet.
    // But wait, the user asked to "read from database".
    // I need a model function for getMentees.
    // Let's assume TutoringSessionModel has it or I add it.
    const tutorId = req.user.user_id
    // Simple query: Users (students) who have sessions with this tutor
    // I'll add this to TutoringSessionModel later if needed, for now let's use a placeholder or simple query
    // Re-using getTutoringSessionsByTutorId and extracting students? No, that's inefficient.
    // Let's add getMenteesByTutorId to TutoringSessionModel
    const mentees = await TutoringSessionModel.getMenteesByTutorId(tutorId)
    res.status(200).json(mentees)
  } catch (error) {
    console.error('Get mentees error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

export const getResources = async (req, res) => {
  try {
    const tutorId = req.user.user_id
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
      isMyUpload: r.author_id === tutorId
    }))

    res.status(200).json(formattedResources)
  } catch (error) {
    console.error('Get resources error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

export const getStats = async (req, res) => {
  try {
    const tutorId = req.user.user_id
    const averageRating = await TutoringSessionModel.getAverageRatingByTutorId(tutorId)
    res.status(200).json({ averageRating })
  } catch (error) {
    console.error('Get stats error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}


