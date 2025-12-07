import { pool } from "../libs/db.js"

export async function createCourse(
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
) {
  const [result] = await pool.query(`
    INSERT INTO Courses (tutor_id, title, subject, description, max_students, start_date, end_date, start_time, end_time, registration_start, registration_end, recurrence_type, days_of_week)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
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
  ])
  return result.insertId
}

export async function getCoursesByTutorId(tutorId) {
  const [rows] = await pool.query(`
    SELECT * FROM Courses WHERE tutor_id = ?
  `, [tutorId])
  return rows
}

export async function getAllCourses() {
  const [rows] = await pool.query(`
    SELECT * FROM Courses
  `)
  return rows
}

export async function getAllCoursesWithTutorInfo() {
  const [rows] = await pool.query(`
    SELECT c.*, u.firstname, u.lastname, u.email
    FROM Courses c
    JOIN Users u ON c.tutor_id = u.user_id
  `)
  return rows
}

export async function getAvailableCoursesForStudent(studentId) {
  const [rows] = await pool.query(`
    SELECT c.*, u.firstname, u.lastname, u.email
    FROM Courses c
    JOIN Users u ON c.tutor_id = u.user_id
    -- WHERE c.course_id NOT IN (
    --  SELECT course_id 
    --  FROM StudentCourses 
    --  WHERE student_id = ?
    -- )
  `, [studentId])
  return rows
}

export async function joinCourse(courseId, studentId) {
  const connection = await pool.getConnection()
  try {
    await connection.beginTransaction()

    // 1. Check if course exists and has slots
    const [courses] = await connection.query(
      'SELECT max_students FROM Courses WHERE course_id = ? FOR UPDATE',
      [courseId]
    )
    
    if (courses.length === 0) {
      throw new Error('Course not found')
    }
    
    if (courses[0].max_students <= 0) {
      throw new Error('Course is full')
    }

    // 2. Check if already joined
    const [existing] = await connection.query(
      'SELECT enrollment_id FROM StudentCourses WHERE course_id = ? AND student_id = ?',
      [courseId, studentId]
    )

    if (existing.length > 0) {
      throw new Error('Already joined this course')
    }

    // 3. Insert into StudentCourses
    await connection.query(
      'INSERT INTO StudentCourses (course_id, student_id) VALUES (?, ?)',
      [courseId, studentId]
    )

    // 4. Decrease max_students
    await connection.query(
      'UPDATE Courses SET max_students = max_students - 1 WHERE course_id = ?',
      [courseId]
    )

    await connection.commit()
    return true
  } catch (error) {
    await connection.rollback()
    throw error
  } finally {
    connection.release()
  }
}

export async function getMenteesByTutorId(tutorId) {
  const [rows] = await pool.query(`
    SELECT 
      u.user_id, u.firstname, u.lastname, u.email, u.avatar,
      c.course_id, c.title as course_title, c.end_date as course_end_date, c.subject
    FROM StudentCourses sc
    JOIN Users u ON sc.student_id = u.user_id
    JOIN Courses c ON sc.course_id = c.course_id
    WHERE c.tutor_id = ?
    ORDER BY u.firstname, u.lastname
  `, [tutorId])
  return rows
}

export async function getJoinedCoursesForStudent(studentId) {
  const [rows] = await pool.query(`
    SELECT c.*, u.firstname, u.lastname 
    FROM Courses c
    JOIN Users u ON c.tutor_id = u.user_id
    WHERE EXISTS (
      SELECT 1 FROM StudentCourses sc WHERE sc.course_id = c.course_id AND sc.student_id = ?
    )
  `, [studentId])
  return rows
}

