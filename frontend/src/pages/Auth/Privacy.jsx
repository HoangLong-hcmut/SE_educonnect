import ComputerIcon from '@mui/icons-material/Computer'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import LightModeIcon from '@mui/icons-material/LightMode'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Divider from '@mui/material/Divider'
import FormControl from '@mui/material/FormControl'
import MenuItem from '@mui/material/MenuItem'
import Paper from '@mui/material/Paper'
import Select from '@mui/material/Select'
import Stack from '@mui/material/Stack'
import { useColorScheme } from '@mui/material/styles'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import SecurityIcon from '@mui/icons-material/Security'
import ShareIcon from '@mui/icons-material/Share'
import StorageIcon from '@mui/icons-material/Storage'

import theme from '../../theme'
import Header from '../../components/Header/Header'

export default function Privacy() {
  useEffect(() => window.scrollTo(0, 0), [])

  return (
    // Ép nền trang màu sáng
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Header />
      <Toolbar />

      <Container maxWidth={false} sx={{ maxWidth: '1350px', py: 4 }}>
        <Typography variant="h3" fontWeight={800}>
          Privacy Policy
        </Typography>
        <Typography variant="subtitle1" sx={{ mb: 4 }}>
          Last updated: November 2025
        </Typography>

        {/* Ép nền thẻ là màu TRẮNG (#FFFFFF) để không bị đen */}
        <Paper elevation={0} sx={{ p: 6, border: '1px solid', borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
          <Stack spacing={5}>

            <Box>
              <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                <StorageIcon color="primary" sx={{ fontSize: 28 }} />
                <Typography variant="h5" fontWeight={700} color="primary" >1. Data Collection</Typography>
              </Stack>
              <Typography paragraph sx={{ lineHeight: 1.8, fontSize: '16px' }}>
                EduConnect integrates directly with <strong>HCMUT_DATACORE</strong> to synchronize personal information.
                The data we collect includes: <em>Full Name, Student ID/Staff ID, Academic Email (@hcmut.edu.vn), Faculty/Major, and Academic Status</em>.
                We commit not to collect any data outside the scope of serving Tutor activities.
              </Typography>
            </Box>

            <Divider />

            <Box>
              <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                <SecurityIcon color="primary" sx={{ fontSize: 28 }} />
                <Typography variant="h5" fontWeight={700} color="primary">2. Authentication & Security</Typography>
              </Stack>
              <Typography sx={{ lineHeight: 1.8, fontSize: '16px' }}>
                The system uses the centralized authentication service <strong>HCMUT_SSO</strong> (Single Sign-On).
                EduConnect <strong>does not store your password</strong>. All login processes are redirected and protected by the school's secure authentication gateway.
              </Typography>
            </Box>

            <Divider />

            <Box>
              <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                <ShareIcon color="primary" sx={{ fontSize: 28 }} />
                <Typography variant="h5" fontWeight={700} color="primary">3. Information Sharing</Typography>
              </Stack>
              <Typography component="div" sx={{ lineHeight: 1.8, fontSize: '16px' }}>
                Tutor activity data will be shared with the following units:
                <ul style={{ paddingLeft: '20px', marginTop: '8px' }}>
                  <li><strong>Academic Affairs Office:</strong> Optimize resource allocation.</li>
                  <li><strong>Student Affairs Office:</strong> Consider training points & scholarships.</li>
                  <li><strong>Faculty/Department:</strong> Monitor academic progress.</li>
                </ul>
                We also connect with <strong>HCMUT_LIBRARY</strong> to share official materials.
              </Typography>
            </Box>

          </Stack>
        </Paper>
      </Container>
    </Box>
  )
}