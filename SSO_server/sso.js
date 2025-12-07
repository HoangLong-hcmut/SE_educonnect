import express from 'express';
// ... (các phần code khác không thay đổi nhiều, chỉ có fakeUsers)

const app = express();
const PORT = 4000;
app.use(express.urlencoded({ extended: true }));


// ---- DỮ LIỆU NGƯỜI DÙNG GIẢ LẬP (ĐÃ CẬP NHẬT) ----
const fakeUsers = {
    'admin01': { 
        id: 'sso_admin01', // sso_id
        firstname: 'Test', 
        lastname: 'Admin',
        email: 'admin.test@hcmut.edu.vn', 
        role: 'admin', // Chữ thường để khớp ENUM
        password: '123' 
    },
    '2152002': { 
        id: 'tutor01_sso', // sso_id
        firstname: 'Test', 
        lastname: 'Tutor',
        email: 'tutor.test@hcmut.edu.vn', 
        role: 'tutor', // Chữ thường
        password: '123'
    },
    '2352001': { 
        id: 'student01_sso', // sso_id
        firstname: 'Test', 
        lastname: 'Student',
        email: 'student.test@hcmut.edu.vn', 
        role: 'student', // Chữ thường
        password: '123'
    }, 
    '2352002': { 
        id: 'student02_sso', // sso_id
        firstname: 'Test', 
        lastname: 'StudentTutor',
        email: 'studentTutor.test@hcmut.edu.vn', 
        role: ['tutor', 'student'], // Chữ thường
        password: '123'
    }, 
};

const authCodes = {};

// --- CSS MỚI - DỰA TRÊN GIAO DIỆN DARK MODE CỦA BẠN ---
const darkThemeStyles = `
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');

        body {
            font-family: 'Roboto', sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background-color: #121212; /* Nền tối */
            color: #E0E0E0; /* Chữ trắng ngà */
            margin: 0;
        }
        .card {
            background-color: #1E1E1E; /* Nền card tối hơn một chút */
            padding: 2rem 2.5rem;
            border-radius: 8px;
            box-shadow: 0 8px 24px rgba(0,0,0,0.5);
            width: 400px;
            text-align: center;
            border: 1px solid #333;
        }
        h1 {
            color: #FFFFFF;
            font-weight: 700;
            margin-bottom: 0.5rem;
        }
        p {
            color: #A0A0A0; /* Chữ phụ màu xám nhạt */
            margin-top: 0;
        }
        a.role-button, button {
            display: block;
            width: 100%;
            padding: 14px;
            margin-bottom: 12px;
            border: 1px solid #555;
            border-radius: 4px;
            background-color: transparent; /* Nền trong suốt */
            color: #E0E0E0;
            text-decoration: none;
            font-size: 1rem;
            font-weight: 500;
            cursor: pointer;
            text-align: center;
            box-sizing: border-box;
            transition: background-color 0.2s, border-color 0.2s;
        }
        a.role-button:hover {
            background-color: #333;
            border-color: #777;
        }
        input {
            width: 100%;
            padding: 14px;
            margin-bottom: 12px;
            border: 1px solid #555;
            border-radius: 4px;
            box-sizing: border-box;
            background-color: #333;
            color: #E0E0E0;
            font-size: 1rem;
        }
        input::placeholder {
            color: #888;
        }
        button[type="submit"] {
            background-color: #3f51b5; /* Màu xanh giống nút Sign In */
            color: white;
            font-weight: 600;
            border: none;
        }
        button[type="submit"]:hover {
            background-color: #303f9f; /* Màu xanh đậm hơn khi hover */
        }
        .error {
            color: #ff7961; /* Màu đỏ nhạt cho dễ đọc trên nền tối */
            margin-bottom: 15px;
            font-weight: 500;
        }
    </style>
`;

// ---- CÁC ROUTE CỦA MOCK SSO ----

// BƯỚC 1: TRANG CHỌN VAI TRÒ
app.get('/login', (req, res) => {
    const { redirect_uri } = req.query;
    if (!redirect_uri) return res.status(400).send(`<h1>Error: Missing redirect_uri</h1>`);
    
    const encodedRedirectUri = encodeURIComponent(redirect_uri);
    res.send(`
        ${darkThemeStyles}
        <div class="card">
            <h1>HCMUT SSO</h1>
            <p>Please select your role</p>
            <a class="role-button" href="/login-form?role=Admin&redirect_uri=${encodedRedirectUri}">Admin</a>
            <a class="role-button" href="/login-form?role=Tutor&redirect_uri=${encodedRedirectUri}">Tutor</a>
            <a class="role-button" href="/login-form?role=Student&redirect_uri=${encodedRedirectUri}">Student</a>
        </div>
    `);
});

// BƯỚC 2: TRANG NHẬP ID VÀ PASSWORD
app.get('/login-form', (req, res) => {
    const { role, redirect_uri, error } = req.query;
    if (!role || !redirect_uri) return res.status(400).send(`<h1>Error: Missing role or redirect_uri</h1>`);
    
    const encodedRedirectUri = encodeURIComponent(redirect_uri);
    const backToRoleSelectionUrl = `/login?redirect_uri=${encodedRedirectUri}`;

    res.send(`
        ${darkThemeStyles}
        <div class="card">
            <h1>Login as ${role}</h1>
            ${error ? `<p class="error">${error}</p>` : ''}
            <form action="/authorize" method="post">
                <input type="hidden" name="redirect_uri" value="${redirect_uri}" />
                <input type="hidden" name="role" value="${role}" />
                <input type="text" name="username" placeholder="Username *" required />
                <input type="password" name="password" placeholder="Password *" required />
                <button type="submit">Sign In</button>
            </form>
            
            <a 
                href="${backToRoleSelectionUrl}" 
                class="role-button" 
                style="margin-top: 15px; font-size: 0.9rem;"
            >
                Back to Role Selection
            </a>
            
            <p style="font-size: 0.8rem; color: #888; margin-top: 2rem;">
                Hint:
                <b>Admin:</b> admin01 / 123 |
                <b>Tutor:</b> 2152002 / 123 |
                <b>Student:</b> 2352001 / 123
            </p>
        </div>
    `);
});


// ... (Phần còn lại của file: app.post('/authorize', ...), app.post('/token', ...), app.listen(...) giữ nguyên) ...
// BƯỚC 3: XỬ LÝ ĐĂNG NHẬP VÀ CHUYỂN HƯỚNG
app.post('/authorize', (req, res) => {
    const { username, password, role, redirect_uri } = req.body;
    
    const userProfile = fakeUsers[username];

    // ---- LOGIC KIỂM TRA ĐA VAI TRÒ MỚI ----

    // 1. Chuyển vai trò từ form về chữ thường để so sánh
    const selectedRole = role.toLowerCase();

    // 2. Kiểm tra xem vai trò trong fakeUsers có phải là một mảng không
    const userHasRoles = Array.isArray(userProfile?.role);

    // 3. Kiểm tra xem vai trò được chọn có nằm trong danh sách vai trò của user không
    const isRoleValid = userHasRoles 
        ? userProfile.role.includes(selectedRole) 
        : userProfile?.role === selectedRole;

    // 4. Điều kiện if cuối cùng
    if (userProfile && userProfile.password === password && isRoleValid) {
        const authCode = `code_${Math.random().toString(36).substring(2, 15)}`;
        
        // Tạo một bản sao của userProfile để không thay đổi dữ liệu gốc
        const profileToSend = { ...userProfile };
        
        // QUAN TRỌNG: Gửi về role dưới dạng mảng để backend Tutor App xử lý
        if (!Array.isArray(profileToSend.role)) {
            profileToSend.role = [profileToSend.role];
        }

        // authCodes[authCode] = profileToSend;
        authCodes[authCode] = {
            profile: profileToSend,
            selectedRole: selectedRole // Lưu lại vai trò người dùng đã chọn
        };
        res.redirect(`${redirect_uri}?code=${authCode}`);
    } else {
        // Nếu sai, quay lại trang login-form với thông báo lỗi
        const encodedRedirectUri = encodeURIComponent(redirect_uri);
        res.redirect(`/login-form?role=${role}&redirect_uri=${encodedRedirectUri}&error=Invalid credentials or role mismatch.`);
    }
});


// Route để Tutor App đổi auth code lấy thông tin người dùng (GIỮ NGUYÊN)
app.post('/token', (req, res) => {
    const { code } = req.query;
    const authData = authCodes[code];

    if (authData) {
        delete authCodes[code];
        res.json({ message: "Token exchange successful", user_info: authData.profile, selected_role: authData.selectedRole });
    } else {
        res.status(400).json({ message: "Invalid or expired authorization code." });
    }
});


app.listen(PORT, () => {
    console.log(`SSO Server is running on http://localhost:${PORT}`);
});