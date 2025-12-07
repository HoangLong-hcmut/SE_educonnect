// frontend/src/pages/Auth/SsoCallbackPage.jsx (Phiên bản cuối cùng)

import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';

// 1. IMPORT AUTH STORE
import { useAuthStore } from '../../stores/useAuthStore';

const SsoCallbackPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    // 2. LẤY HÀM handleSsoLogin TỪ STORE
    const handleSsoLogin = useAuthStore((state) => state.handleSsoLogin);

    useEffect(() => {
        const token = searchParams.get('token');
        const userString = searchParams.get('user');

        if (token && userString) {
            try {
                const user = JSON.parse(userString);

                // 3. GỌI HÀM TỪ STORE ĐỂ CẬP NHẬT TRẠNG THÁI TOÀN CỤC
                handleSsoLogin(user, token);

                navigate('/dashboard', { replace: true});
                // // 4. Chuyển hướng đến dashboard tương ứng với vai trò
                // switch (user.role) {
                //     case 'admin':
                //         navigate('/admin/dashboard', { replace: true });
                //         break;
                //     case 'tutor':
                //         navigate('/tutor/dashboard', { replace: true });
                //         break;
                //     case 'student':
                //     default:
                //         navigate('/student/dashboard', { replace: true });
                //         break;
                // }
            } catch (error) {
                console.error("Failed to process user data from callback", error);
                navigate('/login?error=callback_failed', { replace: true });
            }
        } else {
            console.error("SSO callback is missing token or user data.");
            navigate('/login?error=token_missing', { replace: true });
        }
    }, [searchParams, navigate, handleSsoLogin]);
    // useEffect(() => {
    //     // === DEBUGGING: CHECKPOINT 1 ===
    //     console.log("--- SsoCallbackPage Loaded ---");

    //     const token = searchParams.get('token');
    //     const userString = searchParams.get('user');

    //     console.log("Checkpoint 2: Token from URL:", token);
    //     console.log("Checkpoint 3: User string from URL:", userString);

    //     if (token && userString) {
    //         try {
    //             // === DEBUGGING: CHECKPOINT 4 ===
    //             console.log("Checkpoint 4: Attempting to parse user string...");
    //             const user = JSON.parse(userString);
    //             console.log("Checkpoint 5: User object parsed successfully:", user);

    //             // === DEBUGGING: CHECKPOINT 6 ===
    //             console.log("Checkpoint 6: Attempting to call handleSsoLogin in store...");
    //             handleSsoLogin(user, token);
    //             console.log("Checkpoint 7: handleSsoLogin executed successfully.");

    //             // === DEBUGGING: CHECKPOINT 8 ===
    //             console.log("Checkpoint 8: Navigating to /dashboard...");
    //             navigate('/dashboard', { replace: true });

    //         } catch (error) {
    //             // === DEBUGGING: LỖI XẢY RA Ở ĐÂY ===
    //             console.error("❌ CRITICAL ERROR in SsoCallbackPage 'try' block:", error);
                
    //             // Kiểm tra xem lỗi có phải là do JSON.parse không
    //             if (error instanceof SyntaxError) {
    //                 console.error("Reason: The user string from the URL is not valid JSON.");
    //             }
                
    //             navigate('/login?error=callback_failed', { replace: true });
    //         }
    //     } else {
    //         console.error("❌ ERROR: SSO callback is missing token or user data.");
    //         navigate('/login?error=token_missing', { replace: true });
    //     }
    // }, [searchParams, navigate, handleSsoLogin]);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <CircularProgress />
            <Typography sx={{ mt: 2 }}>Finalizing authentication, please wait...</Typography>
        </Box>
    );
};

export default SsoCallbackPage;