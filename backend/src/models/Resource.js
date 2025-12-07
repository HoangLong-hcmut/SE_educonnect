import { pool } from "../libs/db.js"

export async function getAllResources() {
  const [rows] = await pool.query(`
    SELECT 
      r.*,
      u.firstname,
      u.lastname
    FROM Resources r
    JOIN Users u ON r.author_id = u.user_id
    ORDER BY r.created_at DESC
  `)
  return rows
}

export async function getResourcesByAuthorId(authorId) {
  const [rows] = await pool.query(`
    SELECT 
      r.*,
      u.firstname,
      u.lastname
    FROM Resources r
    JOIN Users u ON r.author_id = u.user_id
    WHERE r.author_id = ?
    ORDER BY r.created_at DESC
  `, [authorId])
  return rows
}

export async function createResource(title, authorId, type, subject, status, fileUrl, imageUrl) {
  const [result] = await pool.query(`
    INSERT INTO Resources (title, author_id, type, subject, status, file_url, image_url)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `, [title, authorId, type, subject, status, fileUrl, imageUrl])
  return result.insertId
}
