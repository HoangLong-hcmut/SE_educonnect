import bcrypt from 'bcrypt'
// import { getUserByUsername, createUser, getUserById } from '../models/User.js'
import { getUserById } from '../models/User.js'
import { createSession, deleteSessionByToken, getSessionByToken } from '../models/Session.js'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'

import dotenv from 'dotenv'
dotenv.config();
import axios from 'axios';
import { getUserBySsoId, createUserFromSso, updateUserFromSso } from '../models/User.js'; // SỬA ĐỔI QUAN TRỌNG
const ACCESS_TOKEN_TTL = '30m';
const REFRESH_TOKEN_TTL = 14 * 24 * 60 * 60 * 1000;
// const REFRESH_TOKEN_TTL = 100;

// export const signUp = async (req, res) => {
//   try {
//     const {username, password, email, firstName, lastName, exp, role} = req.body;
    
//     if (
//       username == null || password == null || email == null ||
//       firstName == null || lastName == null || exp == null || role == null
//     ) {
//       return res.status(400).json({message: "Missing sign up information!"})
//     }

//     const duplicate = await getUserByUsername(username)

//     if (duplicate) {
//       return res.status(400).json({message: "Username is taken!"})
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     await createUser(username, hashedPassword, email, firstName, lastName, exp, role);

//     return res.sendStatus(204);

//   } catch (error) {
//     console.error('Fail in sign up!', error);
//     return res.status(500).json({message: 'System failed'});
//   }
// }

// export const signIn = async (req, res) => {
//   try {
//     const {username, password} = req.body;

//     if (!process.env.ACCESS_TOKEN_SECRET) {
//       return res.status(500).json({ message: 'Missing ACCESS_TOKEN_SECRET' })
//     }

//     if (username == null || password == null) {
//       return res.status(400).json({message: "Missing username or password!"})
//     }

//     const user = await getUserByUsername(username);
//     if (!user) {
//       return res.status(401).json({message: "Username or Password is incorrect!"})
//     }
    
//     const match = await bcrypt.compare(password, user.password);
//     if (!match) {
//       return res.status(401).json({message: "Username or Password is incorrect!"})
//     }

//     const accessToken = jwt.sign(
//       { userID: user.user_id },
//       process.env.ACCESS_TOKEN_SECRET,
//       { expiresIn: ACCESS_TOKEN_TTL }
//     )

//     const refreshToken = crypto.randomBytes(64).toString('hex')
//     const expiresAt = new Date(Date.now() + REFRESH_TOKEN_TTL)

//     await createSession(user.user_id, refreshToken, expiresAt)

//     res.cookie('refreshToken', refreshToken, {
//       httpOnly: true,
//       secure: true, // local dev có thể đặt false
//       sameSite: 'none',
//       maxAge: REFRESH_TOKEN_TTL
//     })

//     return res.status(200).json({
//       message: "Signed in",
//       token: accessToken,
//       username: user.username,
//       role: user.role
//     });
//   } catch (error) {
//     console.error('Fail in sign in!', error);
//     return res.status(500).json({message: 'System failed'});
//   }
// }

export const signOut = async (req, res) => {
  try {
    const token = req.cookies?.refreshToken;

    if (token) {
      await deleteSessionByToken(token);
    }
    
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: true,
      sameSite: 'none'
    });

    return res.sendStatus(204);
  } catch (error) {
    console.error('Fail in sign out!', error);
    return res.status(500).json({message: 'System failed'});
  }
}

export const refresh = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token not found' });
    }

    const session = await getSessionByToken(refreshToken);
    if (!session) {
      return res.status(403).json({ message: 'Refresh token invalid or expired' });
    }

    const user = await getUserById(session.user_id);
    if (!user) {
      return res.status(403).json({ message: 'User not found' });
    }

    const accessToken = jwt.sign(
      { userID: user.user_id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: ACCESS_TOKEN_TTL }
    );

    return res.json({
      token: accessToken,
      username: user.username,
      role: user.role
    });

  } catch (error) {
    console.error('Refresh token failed', error);
    return res.status(500).json({ message: 'System failed' });
  }
}

export const ssoLoginCallback = async (req, res) => {
    // === DEBUGGING: CHECKPOINT 1 ===
    console.log("--- Bắt đầu xử lý SSO Callback ---");

    try {
        const { code } = req.query;
        if (!code) {
            console.log("Lỗi: Không tìm thấy 'code' trong query.");
            return res.status(400).json({ message: "Authorization code is missing." });
        }
        console.log(`Checkpoint 2: Đã nhận được code: ${code}`);

        // BƯỚC 2: Gửi code đến Mock SSO Server
        const tokenResponse = await axios.post(`http://localhost:4000/token?code=${code}`);
        const userInfoFromSso = tokenResponse.data.user_info;
        const userSelectedRole = tokenResponse.data.selected_role

        if (!userInfoFromSso && userSelectedRole) {
            console.log("Lỗi: Mock SSO không trả về user_info.");
            return res.status(400).json({ message: "Failed to get user info from SSO." });
        }
        console.log("Checkpoint 3: Đã nhận được thông tin user từ Mock SSO:", userInfoFromSso);

        // BƯỚC 3: Đồng bộ dữ liệu
        let user;
        const existingUser = await getUserBySsoId(userInfoFromSso.id);

        if (existingUser) {
            console.log(`Checkpoint 4: User đã tồn tại (ID: ${existingUser.user_id}). Đang cập nhật...`);
            user = await updateUserFromSso(existingUser.user_id, userInfoFromSso);
        } else {
            console.log("Checkpoint 4: User chưa tồn tại. Đang tạo mới...");
            user = await createUserFromSso(userInfoFromSso);
        }
        console.log("Checkpoint 5: Đồng bộ user thành công:", user);
        // BƯỚC 3.5: Xử lý đối tượng `user` trước khi gửi về Frontend
        // `user` trả về từ model có `role` là một chuỗi (ví dụ: "tutor,student" hoặc "student")
        // Chúng ta cần chuyển nó thành một mảng `roles` để frontend dễ xử lý.
        if (user && user.role && typeof user.role === 'string') {
            user.roles = user.role.split(','); // Tạo thuộc tính mới là `roles` (mảng)
        } else if (user && user.role) {
            user.roles = [user.role]; // Nếu chỉ có 1 role, vẫn cho vào mảng
        } else {
            user.roles = ['student']; // Trường hợp dự phòng
        }
        // Giờ đây, đối tượng `user` đã có thêm thuộc tính `user.roles = ['tutor', 'student']`
        user.selectedRole = userSelectedRole;

        // BƯỚC 4: Tạo JWT Token
        const accessToken = jwt.sign(
            { userID: user.user_id },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: ACCESS_TOKEN_TTL }
        );
        console.log("Checkpoint 6: Đã tạo JWT Token thành công.");

        // BƯỚC 4.5: Tạo Refresh Token và Session
        const refreshToken = crypto.randomBytes(64).toString('hex');
        const expiresAt = new Date(Date.now() + REFRESH_TOKEN_TTL);

        await createSession(user.user_id, refreshToken, expiresAt);
        console.log("Checkpoint 6.5: Đã tạo Refresh Token và Session trong DB.");

        // Gửi Refresh Token về cho trình duyệt qua HttpOnly Cookie
        res.cookie('refreshToken', refreshToken, {
          httpOnly: true, // JavaScript phía client không thể đọc được
          secure: process.env.NODE_ENV === 'production', // Chỉ gửi qua HTTPS ở môi trường production
          sameSite: 'none', // Cần thiết nếu frontend và backend khác domain/port
          maxAge: REFRESH_TOKEN_TTL
        });
        // ==========================================================

        // BƯỚC 5: Chuyển hướng về Frontend
        delete user.password;
        const frontendCallbackUrl = `http://localhost:5173/auth/sso/finalize?token=${accessToken}&user=${encodeURIComponent(JSON.stringify(user))}`;
        console.log("Checkpoint 7: Chuẩn bị chuyển hướng về Frontend:", frontendCallbackUrl);
        
        res.redirect(frontendCallbackUrl);

    } catch (error) {
        // === DEBUGGING: GHI LOG LỖI CHI TIẾT ===
        // THAY ĐỔI QUAN TRỌNG NHẤT LÀ Ở ĐÂY
        console.error("SSO Callback Error:", error); // In ra TOÀN BỘ đối tượng lỗi

        res.redirect('http://localhost:5173/login?error=sso_failed');
    }
};