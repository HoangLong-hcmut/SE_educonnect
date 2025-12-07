import { pool } from '../libs/db.js'

export const getActivityByStudentId = async (studentId) => {
  const [rows] = await pool.query(
    'SELECT * FROM StudyActivity WHERE student_id = ? ORDER BY activity_id ASC',
    [studentId]
  )
  return rows
}
