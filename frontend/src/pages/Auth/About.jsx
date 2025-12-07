import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Container, 
  Grid, 
  Card, 
  useTheme,
  alpha,
  Toolbar
} from '@mui/material';
import { School, Public, Groups } from '@mui/icons-material';
import Header from '../../components/Header/Header';

export default function About() {
  const theme = useTheme();

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Header />
      <Toolbar />

      {/* Hero Section */}
      <Box sx={{ 
        bgcolor: 'background.default', 
        color: 'text.primary',
        py: 4,
        position: 'relative',
        overflow: 'hidden'
      }}>
        <Container maxWidth="md" sx={{ position: 'relative', textAlign: 'center' }}>
          <Typography variant="h2" fontWeight={800} >
            About EduConnect
          </Typography>
        </Container>
      </Box>

      {/* Content Section */}
      <Container maxWidth={false} sx={{ maxWidth: '1350px'}}>
        <Card elevation={0} sx={{ 
          p: 4, 
          borderRadius: 4, 
          bgcolor: 'background.paper',
          boxShadow: theme.palette.mode === 'dark' ? 'none' : '0 10px 40px -10px rgba(0,0,0,0.1)',
          border: `1px solid ${theme.palette.divider}`,
        }}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center', gap: 6 }}>
            <Box sx={{ flexShrink: 0 }}>
              <Box sx={{ 
                p: 4, 
                bgcolor: alpha(theme.palette.primary.main, 0.2), 
                borderRadius: 4,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <School color="primary" sx={{ fontSize: 100}} />
              </Box>
            </Box>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h5" fontWeight={700} gutterBottom color="text.primary">
                Who We Are
              </Typography>
              <Typography variant="body1" fontSize={16} color="text.secondary" sx={{ lineHeight: 1.8 }}>
                EduConnect is a leading platform bridging the gap between students and tutors.
                Founded in 2025, our mission is to make quality education accessible to everyone, everywhere.
              </Typography>

              <Typography variant="h5" fontWeight={700} gutterBottom color="text.primary" sx={{ mt: 4 }}>
                Our Vision
              </Typography>
              <Typography variant="body1" fontSize={16} color="text.secondary" sx={{ lineHeight: 1.8 }}>
                Whether you are looking to master a new subject or share your knowledge as a tutor, 
                EduConnect provides the tools and environment you need to succeed.
              </Typography>
            </Box>
          </Box>
        </Card>
      </Container>
    </Box>
  );
}