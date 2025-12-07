-- 1. Tạo Database
CREATE DATABASE IF NOT EXISTS educonnect;
USE educonnect;

-- 2. Tạo bảng Users
CREATE TABLE Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    firstname VARCHAR(50),
    lastname VARCHAR(50),
    exp_year INT DEFAULT 0,
    role ENUM('student', 'tutor', 'admin') DEFAULT 'student',
    avatar VARCHAR(255), -- Avatar URL
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Thêm cột sso_id để liên kết với tài khoản SSO
ALTER TABLE Users
ADD COLUMN sso_id VARCHAR(255) NULL UNIQUE AFTER user_id;
-- Cho phép cột password có thể là NULL cho các tài khoản SSO
ALTER TABLE Users
MODIFY COLUMN password VARCHAR(255) NULL;

-- 3. Tạo bảng Sessions
CREATE TABLE Sessions (
    session_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    refresh_token VARCHAR(512) NOT NULL,
    expires_at DATETIME NOT NULL,
    revoked_at DATETIME DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);


USE educonnect;

-- 1. Bảng TutoringSessions (Lịch học)
-- Dùng cho dữ liệu: upcomingSessions
CREATE TABLE TutoringSessions (
    session_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    tutor_id INT NOT NULL,
    subject VARCHAR(255) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    recurrence_type ENUM('none', 'daily', 'weekly', 'monthly') DEFAULT 'none',
    days_of_week JSON,
    status ENUM('upcoming', 'completed', 'cancelled') DEFAULT 'upcoming',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (tutor_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

-- 2. Bảng SessionFeedbacks (Tổng kết & Phản hồi)
-- Dùng cho dữ liệu: recentHighlights
-- 'takeaways' sẽ được lưu dưới dạng JSON array: ["Learned about AVL trees", "..."]
CREATE TABLE SessionFeedbacks (
    feedback_id INT AUTO_INCREMENT PRIMARY KEY,
    session_id INT NOT NULL,
    student_id INT NOT NULL,
    tutor_id INT NOT NULL,
    title VARCHAR(255), -- Ví dụ: "Data Structures"
    feedback_text TEXT, -- Ví dụ: "Great feedback: Tutor commended understanding."
    takeaways JSON,     -- Lưu mảng takeaways
    rate INT CHECK (rate BETWEEN 1 AND 5), -- Đánh giá từ 1 đến 5
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES TutoringSessions(session_id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

-- 3. Bảng StudentScores (Điểm số)
-- Dùng cho dữ liệu: subjectScores
CREATE TABLE StudentScores (
    score_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    subject VARCHAR(100) NOT NULL,
    score DECIMAL(5, 2) NOT NULL, -- Cho phép lưu số thập phân (ví dụ 92.5)
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

-- 4. Bảng StudyActivity (Giờ học hàng tuần)
-- Dùng cho dữ liệu: weeklyStudyHours
CREATE TABLE StudyActivity (
    activity_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    week_label VARCHAR(20), -- Ví dụ: 'W1', 'W2'
    hours DECIMAL(4, 1) DEFAULT 0,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

USE educonnect;

-- 1. Tạo bảng Courses (Lớp học / Khóa học)
-- Bảng này chứa thông tin định nghĩa của lớp học như bạn yêu cầu
CREATE TABLE Courses (
    course_id INT AUTO_INCREMENT PRIMARY KEY,
    tutor_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,        -- Tên lớp học
    subject VARCHAR(255) NOT NULL,      -- Môn học
    max_students INT DEFAULT 10,        -- Số lượng học sinh tối đa
    start_date DATE NOT NULL,           -- Thời gian học (bắt đầu)
    end_date DATE NOT NULL,             -- Thời gian học (kết thúc)
    registration_start DATE,            -- Thời gian đăng ký (từ ngày)
    registration_end DATE,              -- Thời gian đăng ký (đến ngày)
    days_of_week JSON,                  -- Các ngày trong tuần (ví dụ: [1, 3, 5] cho Mon, Wed, Fri)
    recurrence_type ENUM('none', 'daily', 'weekly', 'monthly') DEFAULT 'none', -- Lặp lại
    status ENUM('active', 'completed', 'cancelled') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tutor_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

-- 2. Cập nhật bảng TutoringSessions (Buổi học cụ thể)
-- Thêm cột course_id để biết buổi học này thuộc lớp nào
-- Cho phép student_id là NULL (vì khi mới tạo lớp chưa có ai đăng ký)
ALTER TABLE TutoringSessions
ADD COLUMN course_id INT NULL,
ADD COLUMN title VARCHAR(255), -- Tên hiển thị trên lịch (nếu muốn khác tên lớp)
ADD CONSTRAINT fk_course FOREIGN KEY (course_id) REFERENCES Courses(course_id) ON DELETE SET NULL;

-- 3. (Tùy chọn) Bảng đăng ký học (Enrollments)
-- Để lưu danh sách học sinh đã đăng ký vào lớp
CREATE TABLE StudentCourses (
    enrollment_id INT AUTO_INCREMENT PRIMARY KEY,
    course_id INT NOT NULL,
    student_id INT NOT NULL,
    enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES Courses(course_id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    UNIQUE(course_id, student_id) -- Một học sinh chỉ đăng ký 1 lần/lớp
);

ALTER TABLE Courses
ADD COLUMN start_time TIME,
ADD COLUMN end_time TIME;
-- 4. Bảng TutorProfiles (Thông tin chi tiết gia sư)
CREATE TABLE TutorProfiles (
    profile_id INT AUTO_INCREMENT PRIMARY KEY,
    tutor_id INT NOT NULL,
    biography TEXT,
    faculty VARCHAR(255),
    rating DECIMAL(3, 2) DEFAULT 0.0,
    review_count INT DEFAULT 0,
    is_paused BOOLEAN DEFAULT FALSE,
    profile_status ENUM('pending', 'approved', 'rejected') DEFAULT 'approved',
    FOREIGN KEY (tutor_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

-- 5. Bảng TutorQualifications (Bằng cấp)
CREATE TABLE TutorQualifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tutor_id INT NOT NULL,
    qualification VARCHAR(255),
    FOREIGN KEY (tutor_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

-- 6. Bảng TutorExpertise (Chuyên môn)
CREATE TABLE TutorExpertise (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tutor_id INT NOT NULL,
    expertise VARCHAR(255),
    FOREIGN KEY (tutor_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

-- 7. Bảng TutorSubjects (ôn dạy)
CREATE TABLE TutorSubjects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tutor_id INT NOT NULL,
    subject VARCHAR(255),
    FOREIGN KEY (tutor_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

-- 8. Bảng Resources (Tài liệu học tập)
CREATE TABLE Resources (
    resource_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author_id INT NOT NULL,
    type ENUM('Article', 'PDF Document', 'Video Lecture') NOT NULL,
    subject VARCHAR(100),
    status ENUM('Approved', 'Pending Review', 'Rejected') DEFAULT 'Pending Review',
    file_url VARCHAR(255),
    image_url VARCHAR(255),
    views INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES Users(user_id) ON DELETE CASCADE
);


