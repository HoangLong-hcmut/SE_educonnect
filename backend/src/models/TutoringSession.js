import { pool } from "../libs/db.js"

export async function createTutoringSession(tutorId, subject, sessionDate, sessionTime, status = 'upcoming', courseId = null) {
  const [result] = await pool.query(`
    INSERT INTO TutoringSessions (tutor_id, subject, start_date, start_time, status, course_id)
    VALUES (?, ?, ?, ?, ?, ?)
  `, [tutorId, subject, sessionDate, sessionTime, status, courseId])
  return result.insertId
}

export async function getTutoringSessionsByTutorId(tutorId) {
  const [rows] = await pool.query(`
    SELECT c.*
    FROM  Courses c
    WHERE c.tutor_id = ?
  `, [tutorId])
  return rows
}

export async function getAverageRatingByTutorId(tutorId) {
  const [rows] = await pool.query(`
    SELECT AVG(rate) as average_rating
    FROM SessionFeedbacks
    WHERE tutor_id = ?
  `, [tutorId])
  return rows[0].average_rating || 0
}

export async function getTutoringSessionsByStudentId(studentId) {
  const [rows] = await pool.query(`
    SELECT ts.*, u.firstname as tutor_firstname, u.lastname as tutor_lastname 
    FROM TutoringSessions ts
    JOIN Users u ON ts.tutor_id = u.user_id
    WHERE ts.student_id = ?
    ORDER BY ts.start_date ASC, ts.start_time ASC
  `, [studentId])
  return rows
}

export async function getFeedbacksByStudentId(studentId) {
  const [rows] = await pool.query(`
    SELECT sf.*, ts.start_date 
    FROM SessionFeedbacks sf
    JOIN TutoringSessions ts ON sf.session_id = ts.session_id
    WHERE sf.student_id = ?
    ORDER BY ts.start_date DESC
  `, [studentId])
  return rows
}

export async function getMenteesByTutorId(tutorId) {
  const [rows] = await pool.query(`
    SELECT DISTINCT u.user_id, u.firstname, u.lastname, u.email, u.avatar,
           c.course_id, c.title as course_title, c.end_date as course_end_date, c.subject,
           (SELECT MAX(start_date) FROM TutoringSessions WHERE student_id = u.user_id AND tutor_id = ?) as last_session
    FROM TutoringSessions ts
    JOIN Users u ON ts.student_id = u.user_id
    JOIN Courses c ON ts.course_id = c.course_id
    WHERE ts.tutor_id = ?
  `, [tutorId, tutorId])
  return rows
}

