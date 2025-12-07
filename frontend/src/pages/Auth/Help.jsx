import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Container, 
  Typography, 
  Stack, 
  Accordion, 
  AccordionSummary, 
  AccordionDetails,
  Grid,
  Card,
  CardContent,
  useTheme,
  alpha,
  Toolbar
} from '@mui/material';
import { 
  ExpandMore, 
  ContactSupport, 
  Email, 
  Phone 
} from '@mui/icons-material';
import Header from '../../components/Header/Header';

const faqs = [
  {
    question: "How do I log in to the system?",
    answer: "The system integrates HCMUT_SSO centralized authentication. You just need to use your BKNetID account (for students and lecturers) to log in without creating a new account."
  },
  {
    question: "My personal information is incorrect, what should I do?",
    answer: "Personal data (Full name, Student ID, Faculty/Major...) is automatically synchronized from HCMUT_DATACORE to ensure accuracy. If there are errors, please contact the Academic Affairs Office to update the original data."
  },
  {
    question: "How do I find a suitable Tutor?",
    answer: "You can view the Tutor list by expertise or use the system's 'AI Matching' feature to get suggestions based on your learning needs."
  },
  {
    question: "Where can I access learning materials?",
    answer: "EduConnect connects directly with HCMUT_LIBRARY. You can search and share official textbooks and reference materials right in the classroom management interface."
  },
  {
    question: "How does the session evaluation process take place?",
    answer: "After each session, students will receive a quality evaluation form. This result helps Tutors improve their methods and is the basis for the school to consider training points."
  }
];

export default function Help() {
  const theme = useTheme();

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Header />
      <Toolbar />

      {/* Hero Banner */}
      <Box sx={{ 
        bgcolor: 'background.default', 
        color: 'text.primary', 
        py: 4,
        textAlign: 'center'
      }}>
        <Container maxWidth="md">
          <Typography variant="h3" fontWeight={800}>
            Help Center
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.7, fontWeight: 400, color: 'text.secondary' }}>
            Answering questions about the Tutor process, SSO account, and other features.
          </Typography>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ pb: 4 }}>
        <Grid container spacing={6}>
          {/* FAQ Section */}
          <Grid item xs={12}>
            <Typography variant="h5" fontWeight={700} color="primary" sx={{ mb: 2 }}>
              Frequently Asked Questions
            </Typography>
            <Stack spacing={2}>
              {faqs.map((faq, index) => (
                <Accordion 
                  key={index} 
                  disableGutters
                  elevation={0}
                  sx={{ 
                    border: `1px solid ${theme.palette.divider}`, 
                    borderRadius: '12px !important', 
                    '&:before': { display: 'none' },
                    bgcolor: 'background.paper',
                    transition: 'all 0.2s',
                    boxShadow: theme.palette.mode === 'dark' ? 'none' : `0 4px 12px ${alpha(theme.palette.primary.main, 0.08)}`,
                    '&:hover': {
                      borderColor: theme.palette.primary.main,
                    }
                  }}
                >
                  <AccordionSummary expandIcon={<ExpandMore color="primary" />}>
                    <Typography fontWeight={600} color="text.primary">
                      {faq.question}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography color="text.secondary" sx={{ lineHeight: 1.7, fontSize: '15px' }}>
                      {faq.answer}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Stack>
          </Grid>

          {/* Contact Section */}
          <Grid item xs={12}>
            <Box>
              <Typography variant="h5" fontWeight={700} color="primary" sx={{ mb: 2 }}>
                Contact Support
              </Typography>
              <Card 
                elevation={0}
                sx={{ 
                  bgcolor: 'background.paper',
                  border: `1px solid ${theme.palette.divider}`, 
                  borderRadius: 3,
                  overflow: 'visible',
                  boxShadow: theme.palette.mode === 'dark' ? 'none' : '0 4px 20px rgba(0,0,0,0.05)'
                }}
              >
                <CardContent sx={{ pt: 3, px: 8, width: '1150px' }}>
                  <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems="center" >
                    <Box display="flex" alignItems="flex-start" gap={2}>
                      <Box sx={{ 
                        p: 1, 
                        borderRadius: '8px', 
                        bgcolor: alpha(theme.palette.primary.main, 0.2),
                        color: 'primary.main',
                        display: 'flex'
                      }}>
                        <ContactSupport fontSize="medium" />
                      </Box>
                      <Box>
                        <Typography fontWeight={700} color="text.primary" sx={{ fontSize: '16px' }}>
                          Student Affairs Office
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Tutor Process Support
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Box display="flex" alignItems="flex-start" gap={2}>
                      <Box sx={{ 
                        p: 1, 
                        borderRadius: '8px', 
                        bgcolor: alpha(theme.palette.primary.main, 0.2),
                        color: 'primary.main',
                        display: 'flex'
                      }}>
                        <Email fontSize="medium" />
                      </Box>
                      <Box>
                        <Typography fontWeight={700} color="text.primary" sx={{ fontSize: '16px' }}>
                          Email
                        </Typography>
                        <Typography variant="body2" color="text.secondary" fontWeight={500}>
                          support@hcmut.edu.vn
                        </Typography>
                      </Box>
                    </Box>

                    <Box display="flex" alignItems="flex-start" gap={2}>
                      <Box sx={{ 
                        p: 1, 
                        borderRadius: '8px', 
                        bgcolor: alpha(theme.palette.primary.main, 0.2),
                        color: 'primary.main',
                        display: 'flex'
                      }}>
                        <Phone fontSize="medium" />
                      </Box>
                      <Box>
                        <Typography fontWeight={700} color="text.primary" sx={{ fontSize: '16px' }}>
                          Hotline
                        </Typography>
                        <Typography variant="body2" color="text.secondary" fontWeight={500}>
                          (028) 3864 7256
                        </Typography>
                      </Box>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}