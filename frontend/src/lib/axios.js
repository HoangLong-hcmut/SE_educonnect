import axios from 'axios'
import { useAuthStore } from '../stores/useAuthStore'

const api = axios.create({
  baseURL:
    import.meta.env.MODE === 'development' ? 'http://localhost:5001/api' : '/api',
  withCredentials:true
})

api.interceptors.request.use((config) => {
  const { accessToken } = useAuthStore.getState()

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }

  return config
})

// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config

//     // Check if error is 401/403 and not a retry, and not the refresh request itself
//     if (
//       (error.response?.status === 403 || error.response?.status === 401) &&
//       !originalRequest._retry &&
//       !originalRequest.url.includes('/auth/refresh')
//     ) {
//       originalRequest._retry = true

//       try {
//         const res = await api.post('/auth/refresh')
//         const { token, user, role } = res.data

//         // Update store
//         useAuthStore.setState({
//           accessToken: token,
//           user: { username, role }
//         })

//         // Update localStorage
//         localStorage.setItem('accessToken', token)
//         localStorage.setItem('username', username)
//         localStorage.setItem('role', role)

//         // Update header
//         originalRequest.headers.Authorization = `Bearer ${token}`

//         return api(originalRequest)
//       } catch (refreshError) {
//         // Clear state and redirect
//         useAuthStore.setState({ accessToken: null, user: null })
//         localStorage.removeItem('accessToken')
//         localStorage.removeItem('username')
//         localStorage.removeItem('role')

//         // Optional: Redirect to login
//         // window.location.href = '/login'

//         return Promise.reject(refreshError)
//       }
//     }

//     return Promise.reject(error)
//   }
// )

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      (error.response?.status === 403 || error.response?.status === 401) &&
      !originalRequest._retry &&
      !originalRequest.url.includes('/auth/refresh')
    ) {
      originalRequest._retry = true;
      console.log("Access token expired or invalid. Attempting to refresh...");

      try {
        // Gọi API /refresh
        const { data } = await api.post('/auth/refresh');
        const newAccessToken = data.token;
        const userFromServer = data.user; // Giả sử backend /refresh trả về cả object user

        // --- BẮT ĐẦU SỬA ĐỔI ---

        // 1. CẬP NHẬT STATE VÀ LOCALSTORAGE BẰNG CÁCH GỌI HÀM CÓ SẴN
        // Thay vì set thủ công, chúng ta tái sử dụng hàm handleSsoLogin
        // để đảm bảo tính nhất quán.
        // Giả sử backend /refresh trả về toàn bộ object user đã được cập nhật
        if (userFromServer && newAccessToken) {
          // Lấy activeRole hiện tại để giữ nguyên, hoặc chọn role đầu tiên nếu không có
          const currentActiveRole = useAuthStore.getState().activeRole || (userFromServer.roles && userFromServer.roles[0]);

          const updatedUser = { ...userFromServer, selectedRole: currentActiveRole };
          
          // Gọi hàm handleSsoLogin để cập nhật mọi thứ một cách đồng bộ
          useAuthStore.getState().handleSsoLogin(updatedUser, newAccessToken);
        } else {
            // Trường hợp backend /refresh chỉ trả về token
            useAuthStore.setState({ accessToken: newAccessToken });
            localStorage.setItem('accessToken', newAccessToken);
        }
        
        // 2. CẬP NHẬT HEADER VÀ THỬ LẠI YÊU CẦU
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);

      } catch (refreshError) {
        console.error("Refresh token failed. Logging out.");
        
        // 3. GỌI HÀM signOut TỪ STORE ĐỂ DỌN DẸP MỌI THỨ
        // Cách này an toàn và nhất quán hơn là xóa thủ công.
        useAuthStore.getState().signOut();
        
        // Chuyển hướng người dùng về trang login
        window.location.href = '/login'; 

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api
