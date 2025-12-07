USE educonnect;

SET FOREIGN_KEY_CHECKS = 0;

-- ============================
-- 1. USERS (Admins, Tutors, Students)
-- ============================

TRUNCATE TABLE Users;
TRUNCATE TABLE TutorProfiles;
TRUNCATE TABLE TutorQualifications;
TRUNCATE TABLE TutorExpertise;
TRUNCATE TABLE TutorSubjects;
TRUNCATE TABLE Courses;
TRUNCATE TABLE TutoringSessions;
TRUNCATE TABLE SessionFeedbacks;
TRUNCATE TABLE StudentScores;
TRUNCATE TABLE StudyActivity;

-- Admins
INSERT INTO Users (user_id, username, password, email, firstname, lastname, role, sso_id) VALUES
(1, 'admin01', '123', 'admin01@edu.com', 'Main', 'Admin', 'admin', 'sso_admin01');

-- Tutors (From Frontend Data)
INSERT INTO Users (user_id, username, password, email, firstname, lastname, role, sso_id) VALUES
(101, 'trantruongtuanphat', '123', 'tran.truong.tuan.phat@edu.com', 'Tran', 'Truong Tuan Phat', 'tutor', 'sso_tutor101'),
(102, 'vuhoanglong', '123', 'vu.hoanglong@edu.com', 'Vu', 'Hoang Long', 'tutor', 'sso_tutor102'),
(103, 'tranthiu', '123', 'tran.thi.u@edu.com', 'Tran', 'Thi U', 'tutor', 'sso_tutor103'),
(104, 'vuxuano', '123', 'vu.xuan.o@edu.com', 'Vu', 'Xuan O', 'tutor', 'sso_tutor104'),
(105, 'nguyenleduylai', '123', 'nguyen.le.duy.lai@edu.com', 'Nguyen', 'Le Duy Lai', 'tutor', 'sso_tutor105'),
(106, 'nguyentiendung', '123', 'nguyen.tiendung@edu.com', 'Nguyen', 'Tien Dung', 'tutor', 'sso_tutor106'),
(107, 'lexuandai', '123', 'tran.vana@edu.com', 'Tran', 'Van A', 'tutor', 'sso_tutor107'),
(108, 'phungtrongthuc', '123', 'phung.trong.thuc@edu.com', 'Phung', 'Trong Thuc', 'tutor', 'sso_tutor108'),
(109, 'nguyenvanb', '123', 'nguyen.van.b@edu.com', 'Nguyen', 'Van B', 'tutor', 'sso_tutor109'),
(110, 'tranthic', '123', 'tran.thi.c@edu.com', 'Tran', 'Thi C', 'tutor', 'sso_tutor110'),
(111, 'nguyenhuaphung', '123', 'nguyen.hua.phung@edu.com', 'Nguyen', 'Hua Phung', 'tutor', 'sso_tutor111'),
(112, 'vovand', '123', 'vo.van.d@edu.com', 'Vo', 'Van D', 'tutor', 'sso_tutor112'),
(113, 'trannguyenvanb', '123', 'tran.nguyen.van.b@hcmut.edu.vn', 'Tran', 'Nguyen Van B', 'tutor', 'sso_tutor113');

-- Students
INSERT INTO Users (user_id, username, password, email, firstname, lastname, role, sso_id) VALUES
(201, 'nguyentranvana', '123', 'nguyentranvana@edu.com', 'Nguyen', 'Tran Van A', 'student', 'sso_student01'), -- Main Dashboard User
(202, 'nguyenvanan', '123', 'an.nguyen@example.com', 'Nguyen', 'Van An', 'student', 'sso_student02'),
(203, 'tranthibinh', '123', 'binh.tran@example.com', 'Tran', 'Thi Binh', 'student', 'sso_student03');

-- ============================
-- 2. TUTOR PROFILES & DETAILS
-- ============================

-- (Profile.jsx)
INSERT INTO TutorProfiles (tutor_id, biography, faculty, rating, review_count, is_paused, profile_status) VALUES
(113, 'Dr. Tran Nguyen Van B is an experienced academic mentor specializing in advanced mathematics and computer science. With over 8 years of teaching at HCMUT, she is dedicated to fostering a deeper understanding of complex subjects and helping students achieve their academic goals. Her approach focuses on problem-solving strategies and practical application.', 'Computer Science', 4.9, 120, FALSE, 'approved');

INSERT INTO TutorExpertise (tutor_id, expertise) VALUES
(113, 'Algorithms'), (113, 'Data Structures'), (113, 'Calculus III'), (113, 'Linear Algebra'), (113, 'Python Programming');

INSERT INTO TutorSubjects (tutor_id, subject) VALUES
(113, 'Calculus'), (113, 'Physics'), (113, 'Computer Science');

INSERT INTO TutorQualifications (tutor_id, qualification) VALUES
(113, 'Ph.D. in Computer Science, HCMUT'),
(113, 'M.Sc. in Applied Mathematics, National University of Singapore'),
(113, 'B.Eng. in Software Engineering, HCMUT'),
(113, 'Certified Professional Educator (CPE) in STEM subjects'),
(101, 'Advanced Teaching Methods Certificate, EduTech Institute'),
(101, 'Certified Tutor in Mathematics, Math Tutors Association'),
(102, 'Bachelor of Science in Physics, HCMUT'),
(109, 'Master of Science in Computer Science, HCMUT'),
(104, 'Ph.D. in Information Technology, Stanford University'),
(104, 'Certified Data Science Professional, DataSci Institute'),
(106, 'Bachelor of Arts in Economics, University of Economics HCM'),
(102, 'Master of Education in Curriculum Design, EduWorld University'),
(103, 'Certified Network Engineer, Cisco'),
(110, 'Bachelor of Science in Software Engineering, HCMUT'),
(110, 'Master of Science in Artificial Intelligence, MIT'),
(111, 'Ph.D. in Cybersecurity, HCMUT'),
(112, 'Certified Cloud Practitioner, AWS'),
(112, 'Bachelor of Information Technology, HCMUT');

-- Other Tutors (FindTutor.jsx)
INSERT INTO TutorProfiles (tutor_id, faculty, rating, review_count, profile_status) VALUES
(105, 'Computer Science and Engineering', 4.5, 88, 'rejected'),
(106, 'Applied Science', 4.7, 105, 'approved'),
(107, 'Industry Management', 4.5, 64, 'pending'),
(108, 'Applied Science', 4.7, 184, 'approved'),
(109, 'Applied Science', 4.8, 156, 'pending'),
(110, 'Computer Science and Engineering', 4.9, 215, 'approved'),
(111, 'Computer Science and Engineering', 4.6, 92, 'rejected'),
(101, 'Computer Science and Engineering', 5.0, 88, 'approved');

-- ============================
-- 3. COURSES (Classes)
-- ============================

-- From MySession.jsx (Fixed Courses)
INSERT INTO Courses (course_id, tutor_id, title, subject, max_students, start_date, end_date, start_time, end_time, recurrence_type, days_of_week, status, registration_start, registration_end) VALUES
(902, 108, 'Calculus', 'MT101', 25, '2025-01-01', '2025-06-01', '09:00', '11:00', 'weekly', '[2, 5]', 'active', '2025-01-01', '2025-01-20'),
(903, 109, 'Physics', 'MT102', 30, '2025-01-01', '2025-06-01', '10:00', '12:00', 'weekly', '[3]', 'active', '2025-01-01', '2025-01-20'),
(906, 105, 'Computer Networks', 'CO104', 20, '2025-01-01', '2025-06-01', '14:00', '16:00', 'weekly', '[1, 3, 5]', 'active', '2025-01-01', '2025-01-20'),
(907, 106, 'Probability and Statistics', 'MT103', 25, '2025-01-01', '2025-06-01', '14:00', '16:00', 'weekly', '[4]', 'active', '2025-01-01', '2025-01-20'),
(908, 107, 'Economics', 'IM101', 30, '2025-01-01', '2025-06-01', '09:00', '11:00', 'weekly', '[2, 5]', 'active', '2025-01-01', '2025-01-20'),
(952, 113, 'Linear Algebra', 'MT203', 25, '2025-12-01', '2026-02-08', '09:00', '11:00', 'weekly', '[2, 5]', 'active', '2025-11-01', '2025-11-20'),
(999, 113, 'Introduction to Programming', 'CO101', 10, '2025-12-10', '2026-02-12', '10:00', '12:00', 'weekly', '[3]', 'active', '2025-11-10', '2025-12-01'),
(1000, 113, 'Data Structures and Algorithms', 'CO102', 30, '2025-12-01', '2026-01-18', '14:00', '16:00', 'weekly', '[1, 3, 5]', 'active', '2025-11-01', '2025-11-20'),
(1001, 113, 'Software Engineering', 'CO103', 30, '2025-12-01', '2026-01-24', '14:00', '16:00', 'weekly', '[4]', 'active', '2025-11-01', '2025-11-20');
-- ============================
-- 4. TUTORING SESSIONS (Schedule)
-- ============================

-- From Student/Dashboard.jsx (Upcoming Sessions)
INSERT INTO TutoringSessions (student_id, tutor_id, title, subject, start_date, end_date, start_time, end_time, recurrence_type, days_of_week, status, course_id) VALUES
(201, 113, 'Calculus', 'MT101', '2025-12-10', '2026-02-01', '09:00', '11:00', 'weekly', '[2, 5]', 'upcoming', 902),
(201, 113, 'Introduction to Programming', 'CO101', '2025-11-15', '2026-02-21', '10:00', '12:00', 'weekly', '[3]', 'upcoming', 999),
(201, 113, 'Linear Algebra', 'MT203', '2025-11-21', '2026-02-08', '10:00', '12:00', 'weekly', '[3]', 'upcoming', 952),
(202, 113, 'Software Engineering', 'CO103', '2025-12-01', '2026-01-24', '14:00', '16:00', 'weekly', '[4]', 'upcoming', 1001),
(202, 113, 'Economics', 'IM101', '2025-12-05', '2025-12-05', '14:00', '16:00', 'weekly', '[4]', 'upcoming', 908),
(203, 113, 'Data Structures and Algorithms', 'CO102', '2025-12-01', '2026-02-12', '12:00', '14:00', 'weekly', '[2, 5]', 'upcoming', 1000),
(203, 113, 'Software Engineering', 'CO103', '2025-12-01', '2026-01-01', '08:00', '10:00', 'weekly', '[1, 4]', 'upcoming', 1001),
(201, 107, 'Data Structures and Algorithms', 'CO102', '2025-12-01', '2026-02-01', '14:00', '16:00', 'weekly', '[1, 3, 5]', 'upcoming', 1000),
(201, 101, 'Software Engineering', 'CO103', '2025-12-15', '2026-01-15', '14:00', '16:00', 'weekly', '[4]', 'upcoming', 1001);


-- ============================
-- 5. STUDENT SCORES & ACTIVITY
-- ============================

-- From Student/Dashboard.jsx
INSERT INTO StudentScores (student_id, subject, score) VALUES
(201, 'DSA', 92),
(201, 'Calculus', 88),
(201, 'Physics', 85);

INSERT INTO StudyActivity (student_id, week_label, hours) VALUES
(201, 'W1', 12),
(201, 'W2', 15),
(201, 'W3', 18),
(201, 'W4', 14),
(201, 'W5', 20);

-- ============================
-- 6. SESSION FEEDBACKS (Highlights)
-- ============================


INSERT INTO SessionFeedbacks (session_id, student_id, tutor_id, title, feedback_text, takeaways, rate) VALUES
(8, 201, 107, 'Data Structures and Algorithms', 'Great feedback: Tutor commended understanding.', '[\"Learned about AVL trees.\", \"Implemented binary tree searching.\", \"Practiced tree traversals.\"]', 5),
(9, 201, 101, 'Software Engineering', 'Tutor has wide knowledge.', '[\"Mastered Sprint.\", \"Understood applications in real world.\", \"Code Smells examples.\"]', 5),
(6, 203, 113, 'Data Structures and Algorithms', 'Excellent session on advanced trees.', '[\"Mastered Red-Black trees.\", \"Explored B-trees.\", \"Applied concepts to real-world problems.\"]', 4),
(4, 202, 113, 'Software Engineering', 'Valuable insights into software design patterns.', '[\"Learned Singleton pattern.\", \"Understood Observer pattern.\", \"Applied Factory pattern in projects.\"]', 5),
(2, 201, 113, 'Introduction to Programming', 'Clear explanations on programming basics.', '[\"Grasped variables and data types.\", \"Understood programming structures.\", \"Wrote simple codes.\"]', 4);
-- ============================
-- 7. RESOURCES
-- ============================

INSERT INTO Resources (title, author_id, type, subject, status, image_url, views) VALUES 
('Calculus II', 101, 'PDF Document', 'Calculus', 'Pending Review', 'https://placehold.co/600x400/DEB887/FFFFFF?text=Calculus', 850),
('Network Fundamentals', 101, 'PDF Document', 'Computer Networks', 'Approved', 'https://placehold.co/600x400/5F9EA0/FFFFFF?text=Network', 1200),
('Design Patterns', 101, 'Article', 'Software Engineering', 'Approved', 'https://placehold.co/600x400/5F9EA0/FFFFFF?text=Patterns', 1200),
('Physics I', 101, 'PDF Document', 'Physics', 'Pending Review', 'https://placehold.co/600x400/DEB887/FFFFFF?text=Physics', 850),
('Programming Basics', 101, 'Video Lecture', 'Introduction to Programming', 'Approved', 'https://placehold.co/600x400/FF7F50/FFFFFF?text=Basics', 2000);

SET FOREIGN_KEY_CHECKS = 1;
