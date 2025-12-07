import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Button, 
  Container, 
  Typography, 
  Stack,
  Paper,
  Alert,
  Toolbar,
  useTheme,
  alpha
} from '@mui/material';
import { ArrowBack, Gavel, School, SmartToy } from '@mui/icons-material';
import Header from '../../components/Header/Header';

export default function Terms() {
  const navigate = useNavigate();
  const theme = useTheme();
  
  useEffect(() => window.scrollTo(0, 0), []);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Header />
      <Toolbar />

      <Container maxWidth={false} sx={{ maxWidth: '1350px', py: 4 }}>
        <Typography variant="h3" fontWeight={800} sx={{ color: 'text.primary' }}>
          Terms of Use
        </Typography>
        <Typography variant="subtitle1" sx={{ mb: 4, color: 'text.primary' }}>
          General regulations for HCMUT Lecturers and Students
        </Typography>

        <Paper elevation={0} sx={{ 
          p: 4, 
          bgcolor: 'background.paper', 
          border: `1px solid ${theme.palette.divider}`, 
          borderRadius: 3, 
          boxShadow: theme.palette.mode === 'dark' ? 'none' : '0 4px 20px rgba(0,0,0,0.05)' 
        }}>
          <Stack spacing={4}>
            
            <Box>
              <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 1 }}>
                <Gavel color="primary" sx={{ fontSize: 28 }} />
                <Typography variant="h5" fontWeight={700} color="primary">1. Account Regulations</Typography>
              </Stack>
              <Typography sx={{ color: 'text.primary', lineHeight: 1.8, fontSize: '16px' }}>
                Users must use their <strong>official BKNetID</strong> to access the system.
                Any fraudulent behavior, using another person's account, or intentionally misrepresenting roles (Tutor/Student) will be strictly handled according to the school's student affairs regulations.
              </Typography>
            </Box>

            <Box>
              <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 1}}>
                <School color="primary" sx={{ fontSize: 28 }} />
                <Typography variant="h5" fontWeight={700} color="primary">2. Participation Responsibilities</Typography>
              </Stack>
              <Typography component="div" sx={{ color: 'text.primary', lineHeight: 1.8, fontSize: '16px' }}>
                <ul style={{ paddingLeft: '20px' }}>
                  <li><strong>Tutor:</strong> Responsible for preparing content, updating availability accurately, and recording learning progress honestly.</li>
                  <li><strong>Student:</strong> Committed to participating on time and performing quality evaluations of the session objectively.</li>
                </ul>
                Participation results will be recorded directly in the training profile.
              </Typography>
            </Box>

            <Box>
              <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 1 }}>
                <SmartToy color="primary" sx={{ fontSize: 28 }} />
                <Typography variant="h5" fontWeight={700} color="primary">3. AI Usage (Artificial Intelligence)</Typography>
              </Stack>
              
              <Typography sx={{ color: 'text.primary', lineHeight: 1.8, fontSize: '16px' }}>
                EduConnect encourages the use of AI tools to support idea generation.
                However, users must <strong>clearly declare</strong> the scope of use in the final report.
                Any abuse of AI to copy verbatim will be considered a violation of academic integrity.
              </Typography>
            </Box>

          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}