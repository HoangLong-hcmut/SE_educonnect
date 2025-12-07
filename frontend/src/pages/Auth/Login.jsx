import { useState } from 'react'
import { useColorScheme } from '@mui/material/styles'
import { useLocation, useNavigate, Link as RouterLink } from 'react-router-dom'
import ComputerIcon from '@mui/icons-material/Computer'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import LightModeIcon from '@mui/icons-material/LightMode'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import FormControl from '@mui/material/FormControl'
import Container from '@mui/material/Container'
import TextField from '@mui/material/TextField'
import Link from '@mui/material/Link'

import theme from '../../theme'
import Header from '../../components/Header/LoginHeader'
import Footer from '../../components/Footer/Footer'
import { useAuthStore } from '../../stores/useAuthStore'


function Login() {
  const navigate = useNavigate()
  const { signIn } = useAuthStore()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await signIn(username, password)

      // Navigate to dashboard based on role from backend
      navigate('/dashboard')
    } catch (error) {
      setError('Failed to sign in. Please check your credentials.')
      console.error('Login error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSsoLogin = () => {
    // URL trên BACKEND sẽ xử lý callback từ Mock SSO
    const BACKEND_CALLBACK_URL = 'http://localhost:5001/api/auth/sso-callback'; // Đảm bảo port backend là đúng

    // Chuyển hướng người dùng đến Mock SSO Server
    window.location.href = `http://localhost:4000/login?redirect_uri=${encodeURIComponent(BACKEND_CALLBACK_URL)}`;
  }
  
  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.default'
      }}
    >
      <Header />
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          alignItems: 'center',
          py: 6
        }}
      >
        <Container maxWidth="md">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
              Welcome Back to EduConnect
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Sign in to continue your journey.
            </Typography>
          </Box>

          <Box sx={{ maxWidth: 560, mx: 'auto' }}>
            {error && (
              <Box
                sx={{
                  mb: 2, p: 2, bgcolor: 'error.light',
                  color: 'error.contrastText', borderRadius: 1, textAlign: 'center'
                }}
              >
                {error}
              </Box>
            )}

            {/* PHẦN 1: FORM ĐĂNG NHẬP CHÍNH */}
            {/* <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                fullWidth
                label="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                sx={{ '& .MuiOutlinedInput-root': { bgcolor: 'background.paper' } }}
              />

              <TextField
                fullWidth
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                sx={{ '& .MuiOutlinedInput-root': { bgcolor: 'background.paper' } }}
              />

              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={loading}
                sx={{
                  py: 1.5, textTransform: 'none', fontSize: '1rem', fontWeight: 600,
                  bgcolor: 'primary.main', '&:hover': { bgcolor: 'primary.dark' }
                }}
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </Button>
            </Box> */}

            {/* PHẦN 2: CÁC LINK PHỤ */}
            {/* <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
              <Box>
                Don't have an account?
                {' '}
                <Link component={RouterLink} to="/signup" underline="hover" color="primary">
                  Sign Up?
                </Link>
              </Box>
              <Link component={RouterLink} to="/forgot-password" underline="hover" variant="body2" color="primary">
                Forgot Password?
              </Link>
            </Box> */}

            {/* PHẦN 3: KHU VỰC ĐĂNG NHẬP SSO */}
            {/* <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', my: 3 }}>
              — OR —
            </Typography> */}

            <Button
              onClick={handleSsoLogin}
              variant="contained" // Đổi thành 'contained' để giống nút Sign In
              fullWidth
              size="large"
              sx={{
                py: 1.5,
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 600,
                bgcolor: 'primary.main', // Sử dụng màu chính
                '&:hover': {
                  bgcolor: 'primary.dark'
                }
              }}
            >
              Sign In with HCMUT SSO
            </Button>
            
          </Box>
        </Container>
      </Box>

      <Footer />
    </Box>
  )
}

export default Login
