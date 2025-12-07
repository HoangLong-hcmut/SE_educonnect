import { pool } from "../libs/db.js"

// export async function getUserByUsername(username) {
//   const [rows] = await pool.query(`
//     SELECT *
//     from Users
//     WHERE username = ?
//     `, [username])
//   return rows[0]
// }

// export async function createUser(username, password, email, firstName, lastName, exp, role) {
//   await pool.query(`
//     INSERT INTO Users (username, password, email, firstname, lastname, exp_year, role)
//     VALUES (?, ?, ?, ?, ?, ?, ?)
//     `, [username, password, email, firstName, lastName, exp, role])
// }

export async function getUserById(userId) {
  const [rows] = await pool.query(`SELECT * FROM Users WHERE user_id = ?`, [userId])
  return rows[0]
}

// export async function getTutors() {
//   const [rows] = await pool.query(`SELECT * FROM Users WHERE role = 'tutor'`)
//   return rows
// }
export async function getTutors() {
  const [rows] = await pool.query(`SELECT * FROM Users WHERE role LIKE '%tutor%'`); // Sửa lại để tìm kiếm trong chuỗi
  return rows;
}


/**
 * TÌM người dùng bằng sso_id của họ.
 */
export async function getUserBySsoId(ssoId) {
  const [rows] = await pool.query(`
    SELECT * FROM Users WHERE sso_id = ?
  `, [ssoId]);
  return rows[0];
}

/**
 * TẠO người dùng mới từ thông tin SSO.
 */
/**
 * TẠO người dùng mới từ thông tin SSO.
 * Gán username bằng sso_id.
 */
// export async function createUserFromSso(ssoProfile) {
//   const { id, firstname, lastname, email, role } = ssoProfile;
  
//   // Gán username = sso_id
//   const username = id;

//   const [result] = await pool.query(`
//     INSERT INTO Users (sso_id, username, firstname, lastname, email, role)
//     VALUES (?, ?, ?, ?, ?, ?)
//   `, [id, username, firstname, lastname, email, role || 'student']);
  
//   const newUserId = result.insertId;
//   return getUserById(newUserId);
// }

// /**
//  * CẬP NHẬT thông tin người dùng đã có từ thông tin SSO.
//  * Gán username bằng sso_id.
//  */
// export async function updateUserFromSso(userId, ssoProfile) {
//   const { id, firstname, lastname, email, role } = ssoProfile;

//   // Gán username = sso_id
//   const username = id;

//   await pool.query(`
//     UPDATE Users
//     SET username = ?, firstname = ?, lastname = ?, email = ?, role = ?
//     WHERE user_id = ?
//   `, [username, firstname, lastname, email, role || 'student', userId]);
  
//   return getUserById(userId);
// }
export async function createUserFromSso(ssoProfile) {
  const { id, firstname, lastname, email, role } = ssoProfile;
  const username = id;
  // Chuyển mảng role thành chuỗi, ví dụ: ['tutor', 'student'] -> "tutor,student"
  const roleString = Array.isArray(role) ? role.join(',') : role;

  const [result] = await pool.query(`
    INSERT INTO Users (sso_id, username, firstname, lastname, email, role)
    VALUES (?, ?, ?, ?, ?, ?)
  `, [id, username, firstname, lastname, email, roleString || 'student']);
  
  return getUserById(result.insertId);
}

export async function updateUserFromSso(userId, ssoProfile) {
  const { id, firstname, lastname, email, role } = ssoProfile;
  const username = id;
  // Tương tự, chuyển mảng thành chuỗi
  const roleString = Array.isArray(role) ? role.join(',') : role;

  await pool.query(`
    UPDATE Users SET username = ?, firstname = ?, lastname = ?, email = ?, role = ?
    WHERE user_id = ?
  `, [username, firstname, lastname, email, roleString || 'student', userId]);
  
  return getUserById(userId);
}