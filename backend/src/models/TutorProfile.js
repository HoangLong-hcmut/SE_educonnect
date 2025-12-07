import { pool } from '../libs/db.js'

export const getProfileByTutorId = async (tutorId) => {
  const [rows] = await pool.query(
    `SELECT tp.*, u.firstname, u.lastname, u.email 
     FROM TutorProfiles tp 
     JOIN Users u ON tp.tutor_id = u.user_id 
     WHERE tp.tutor_id = ?`,
    [tutorId]
  )
  return rows[0]
}

export const getExpertiseByTutorId = async (tutorId) => {
  const [rows] = await pool.query(
    'SELECT expertise FROM TutorExpertise WHERE tutor_id = ?',
    [tutorId]
  )
  return rows.map(r => r.expertise)
}

export const getSubjectsByTutorId = async (tutorId) => {
  const [rows] = await pool.query(
    'SELECT subject FROM TutorSubjects WHERE tutor_id = ?',
    [tutorId]
  )
  return rows.map(r => r.subject)
}

export const getQualificationsByTutorId = async (tutorId) => {
  const [rows] = await pool.query(
    'SELECT qualification FROM TutorQualifications WHERE tutor_id = ?',
    [tutorId]
  )
  return rows.map(r => r.qualification)
}

export const updateProfile = async (tutorId, biography, isPaused) => {
  await pool.query(
    'UPDATE TutorProfiles SET biography = ?, is_paused = ? WHERE tutor_id = ?',
    [biography, isPaused, tutorId]
  )
}

// Helper to clear and re-insert list items (simplest way for now)
export const updateExpertise = async (tutorId, expertiseList) => {
  await pool.query('DELETE FROM TutorExpertise WHERE tutor_id = ?', [tutorId])
  if (expertiseList && expertiseList.length > 0) {
    const values = expertiseList.map(e => [tutorId, e])
    await pool.query('INSERT INTO TutorExpertise (tutor_id, expertise) VALUES ?', [values])
  }
}

export const updateSubjects = async (tutorId, subjectList) => {
  await pool.query('DELETE FROM TutorSubjects WHERE tutor_id = ?', [tutorId])
  if (subjectList && subjectList.length > 0) {
    const values = subjectList.map(s => [tutorId, s])
    await pool.query('INSERT INTO TutorSubjects (tutor_id, subject) VALUES ?', [values])
  }
}

export const updateQualifications = async (tutorId, qualificationList) => {
  await pool.query('DELETE FROM TutorQualifications WHERE tutor_id = ?', [tutorId])
  if (qualificationList && qualificationList.length > 0) {
    const values = qualificationList.map(q => [tutorId, q])
    await pool.query('INSERT INTO TutorQualifications (tutor_id, qualification) VALUES ?', [values])
  }
}
