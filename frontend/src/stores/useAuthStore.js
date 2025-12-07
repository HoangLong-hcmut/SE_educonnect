import { create } from 'zustand'
import { toast } from 'sonner'
import { authService } from '../services/authService'

// ============================
// DEV MODE CONFIG
// ============================
const isDevMode = import.meta.env.DEV;

// ============================
// STORE CHO DEV MODE
// ============================
const devStore = {
  accessToken: "dev-token",
  user: {
    username: "admin",
    role: "admin"
  },
  loading: false,

  signUp: async () => {},
  signIn: async () => "admin",
  signOut: async () => {},
  handleSsoLogin: async () => {}
};

// ============================
// STORE CHO PRODUCTION MODE
// ============================
const prodStore = (set, get) => ({
  accessToken: localStorage.getItem('accessToken') || null,

  // user: (() => {
  //   const role = localStorage.getItem('role');
  //   const username = localStorage.getItem('username');
  //   if (role && username) {
  //     return { username, role };
  //   }
  //   return null;
  // })(),
  // Lưu toàn bộ đối tượng user từ localStorage
  user: JSON.parse(localStorage.getItem('user')) || null,

  // State mới: Lưu vai trò đang hoạt động
  activeRole: localStorage.getItem('activeRole') || null,

  loading: false,

  // signUp: async (username, password, email, firstName, lastName, exp, role) => {
  //   try {
  //     set({ loading: true });
  //     await authService.signUp(username, password, email, firstName, lastName, exp, role);
  //     toast.success('Sign up success! Navigate to login');
  //   } catch (error) {
  //     console.error(error);
  //     toast.error('Fail to sign up');
  //   } finally {
  //     set({ loading: false });
  //   }
  // },

  // signIn: async (username, password) => {
  //   try {
  //     set({ loading: true });

  //     const data = await authService.signIn(username, password);

  //     set({
  //       accessToken: data.token,
  //       user: {
  //         username: data.username,
  //         role: data.role
  //       }
  //     });

  //     await authService.fetchMe();

  //     localStorage.setItem('accessToken', data.token);
  //     localStorage.setItem('username', data.username);
  //     localStorage.setItem('role', data.role);

  //     toast.success('Sign in success!');
  //     return data.role;

  //   } catch (error) {
  //     console.error(error);
  //     toast.error('Fail to sign in');
  //     throw error;
  //   } finally {
  //     set({ loading: false });
  //   }
  // },

  signOut: async () => {
    try {
      set({ loading: true });

      await authService.signOut();

      set({ accessToken: null, user: null, activeRole: null });

      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      localStorage.removeItem('activeRole');

      toast.success('Sign out success!');
    } catch (error) {
      console.error(error);
      toast.error('Fail to sign out');
    } finally {
      set({ loading: false });
    }
  }, 
  
  handleSsoLogin: (user, token) => {
    try {
      // Backend đã gửi về user.roles là một mảng
      // Chọn vai trò mặc định (ví dụ: vai trò đầu tiên)
      const defaultActiveRole = user.selectedRole;

      set({
        accessToken: token,
        user: user,
        activeRole: defaultActiveRole
      });

      // Lưu state vào localStorage
      localStorage.setItem('accessToken', token);
      localStorage.setItem('user', JSON.stringify(user)); // Lưu cả object
      localStorage.setItem('activeRole', defaultActiveRole);

      toast.success(`Welcome back, ${user.firstname}!`);
      
    } catch (error) {
      console.error("Failed to handle SSO login state", error);
      toast.error("An error occurred during login.");
    }
  },

  // setActiveRole: (newRole) => {
  //   const user = get().user;
  //   if (user && user.roles && user.roles.includes(newRole)) {
  //     set({ activeRole: newRole });
  //     localStorage.setItem('activeRole', newRole);
  //     toast.info(`Switched to ${newRole} role.`);
      
  //     // Chuyển hướng người dùng đến dashboard sau khi đổi vai trò
  //     // Dùng window.location.href để tải lại toàn bộ ứng dụng
  //     // và đảm bảo các layout/route được cập nhật đúng
  //     window.location.href = '/dashboard'; 
  //   } else {
  //     toast.error("You do not have permission for this role.");
  //   }
  // }
});

// ============================
// EXPORT STORE HOÀN CHỈNH
// ============================
// export const useAuthStore = create(isDevMode ? () => devStore : prodStore);

export const useAuthStore = create(prodStore);