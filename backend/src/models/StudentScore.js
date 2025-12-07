import { pool } from '../libs/db.js'

export const getScoresByStudentId = async (studentId) => {
  const [rows] = await pool.query(
    'SELECT * FROM StudentScores WHERE student_id = ?',
    [studentId]
  )
  return rows
}
