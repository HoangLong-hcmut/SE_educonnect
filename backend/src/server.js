import express from "express"
import cors from "cors"
import authRoute from './routes/authRoute.js'
import userRoute from './routes/userRoute.js'
import tutorRoute from './routes/tutorRoute.js'
import studentRoute from './routes/studentRoute.js'
import adminRoute from './routes/adminRoute.js'
import { connectDB } from "./libs/db.js";
import { purgeExpiredSessions } from "./models/Session.js";
import cookieParser from 'cookie-parser'
import { protectedRoute } from "./middlewares/authMiddleware.js";

import dotenv from 'dotenv'
dotenv.config();

const PORT = process.env.PORT || 5001;

const app = express();



// middleware
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

setInterval(async () => {
  try {
    await purgeExpiredSessions()
  } catch (e) {
    console.error('Purge sessions failed', e)
  }
}, 5 * 60 * 1000)

// public route
app.use("/api/auth", authRoute);

// private route
app.use("/api/users", protectedRoute, userRoute);
app.use("/api/tutors", protectedRoute, tutorRoute);
app.use("/api/students", protectedRoute, studentRoute);
app.use("/api/admin", protectedRoute, adminRoute);

const startServer = async () => {
  try {
    // Thử kết nối đến database TRƯỚC TIÊN
    await connectDB();

    // NẾU kết nối database thành công, MỚI bắt đầu web server
    app.listen(PORT, () => {
      console.log(`Backend running at http://localhost:${PORT}`);
    });

  } catch (error) {
    // NẾU kết nối database thất bại, báo lỗi và DỪNG hẳn ứng dụng
    console.error("FATAL: Failed to connect to the database. Server is not starting.");
    process.exit(1); // Lệnh này sẽ dừng chương trình ngay lập tức
  }
};

// 4. GỌI HÀM ĐỂ BẮT ĐẦU
startServer();