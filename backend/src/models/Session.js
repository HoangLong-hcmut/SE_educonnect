import { pool } from '../libs/db.js'

export async function createSession(user_id, refreshToken, expiresAt) {
  await pool.query(
    `INSERT INTO Sessions (user_id, refresh_token, expires_at)
     VALUES (?, ?, ?)`,
    [user_id, refreshToken, expiresAt]
  )
}

export async function deleteSessionByToken(token) {
  await pool.query(
    `DELETE FROM Sessions WHERE refresh_token = ?`,
    [token]
  )
}

export async function getSessionByToken(token) {
  const [rows] = await pool.query(
    `SELECT * FROM Sessions WHERE refresh_token = ? AND expires_at > NOW()`,
    [token]
  )
  return rows[0]
}

export async function purgeExpiredSessions() {
  await pool.query(
    `DELETE FROM Sessions
     WHERE expires_at <= NOW() OR revoked_at IS NOT NULL`
  )
}