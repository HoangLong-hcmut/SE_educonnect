import { useState, useEffect } from 'react'
import { Container, Box, Grid, Paper, Typography, Stack, ToggleButton, ToggleButtonGroup, Toolbar, useTheme, alpha, useMediaQuery, useColorScheme } from '@mui/material'
import AdminHeader from '../../components/Header/AdminHeader'
import AdminFooter from '../../components/Footer/AdminFooter'
import {
  TrendingUp as TrendingUpIcon,
  SchoolOutlined as SchoolIcon,
  StarRate as StarIcon,
  GroupsOutlined as GroupIcon
} from '@mui/icons-material'
import { motion } from 'framer-motion' // Import Framer Motion
import { useAdminStore } from '../../stores/useAdminStore'

import { Line, Doughnut, Bar } from 'react-chartjs-2'

import {
  Chart as ChartJS,
  LineElement,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Legend,
  Tooltip
} from 'chart.js'

ChartJS.register(LineElement, ArcElement, BarElement, CategoryScale, LinearScale, PointElement, Legend, Tooltip)

// Cấu hình Animation
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15, // Thời gian trễ giữa các phần tử con
      delayChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15
    }
  }
}

const KPICard = ({ title, value, change, icon: Icon, bgColor }) => {
  const theme = useTheme();
  return (
  <Paper sx={{
    p: { xs: 2.5, md: 3 },
    borderRadius: '12px',
    bgcolor: 'background.paper',
    border: `1px solid ${theme.palette.divider}`,
    boxShadow: theme.palette.mode === 'dark' ? 'none' : '0px 1px 3px rgba(0, 0, 0, 0.08)',
    transition: 'all 0.3s ease',
    height: '100%', // Đảm bảo chiều cao đồng đều
    '&:hover': {
      boxShadow: theme.palette.mode === 'dark' ? 'none' : '0px 10px 25px rgba(0, 0, 0, 0.1)',
      transform: 'translateY(-5px)' // Hiệu ứng nổi lên khi hover bằng CSS thuần (hoặc dùng motion)
    }
  }}>
    <Stack direction="row" spacing={2} alignItems="center">
      <Box
        component={motion.div}
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        sx={{
          p: 1.5,
          borderRadius: '10px',
          background: bgColor,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minWidth: 56,
          minHeight: 56,
          flexShrink: 0
        }}
      >
        <Icon sx={{ color: 'common.white', fontSize: '28px' }} />
      </Box>
      <Box sx={{ flex: 1 }}>
        <Typography sx={{ fontSize: '13px', color: 'text.secondary', fontWeight: 600, mb: 0.5 }}>
          {title}
        </Typography>
        <Typography sx={{ fontSize: '32px', fontWeight: 700, color: 'text.primary', mb: 0.5 }}>
          {value}
        </Typography>
        <Stack direction="row" spacing={0.5} alignItems="center">
          <TrendingUpIcon sx={{ fontSize: '14px', color: 'success.main' }} />
          <Typography sx={{ fontSize: '12px', color: 'success.main', fontWeight: 600 }}>
            {change}
          </Typography>
        </Stack>
      </Box>
    </Stack>
  </Paper>
)};

export default function AdminDashboard() {
  const theme = useTheme();
  const { mode, systemMode } = useColorScheme();
  const [chartTextColor, setChartTextColor] = useState('rgba(0, 0, 0, 0.6)');
  const [timePeriod, setTimePeriod] = useState('month')
  const { stats, fetchDashboardStats } = useAdminStore()

  useEffect(() => {
    fetchDashboardStats()
  }, [fetchDashboardStats])

  useEffect(() => {
    const currentMode = mode === 'system' ? systemMode : mode;
    
    // Try to resolve CSS variable first
    const varName = '--mui-palette-text-primary';
    const color = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
    
    if (color) {
      setChartTextColor(color);
    } else {
      // Fallback based on active mode
      setChartTextColor(currentMode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)');
    }
  }, [mode, systemMode]);

  const handleTimePeriodChange = (event, newPeriod) => {
    if (newPeriod !== null) {
      setTimePeriod(newPeriod)
    }
  }

  const cardStyle = {
    p: { xs: 2.5, md: 3 },
    borderRadius: '12px',
    bgcolor: 'background.paper',
    border: `1px solid ${theme.palette.divider}`,
    boxShadow: theme.palette.mode === 'dark' ? 'none' : '0px 1px 3px rgba(0, 0, 0, 0.08)',
    transition: 'all 0.3s ease',
    height: '100%', // Đảm bảo chiều cao đồng đều
    '&:hover': {
      boxShadow: theme.palette.mode === 'dark' ? 'none' : '0px 10px 25px rgba(0, 0, 0, 0.1)',
      transform: 'translateY(-5px)' // Hiệu ứng nổi lên khi hover bằng CSS thuần (hoặc dùng motion)
    }
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', display: 'flex', flexDirection: 'column' }}>
      <AdminHeader />
      <Toolbar />

        
      <Container
        component={motion.main} // Biến Box thành motion component
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        maxWidth={false}
        sx={{ 
          maxWidth: '1350px', 
          width: '100%',
          mx: 'auto', // Centralize horizontally
          px: { xs: 2, md: 4 }, // Add padding for smaller screens
          py: 4, 
          flexGrow: 1 
        }}
      >
          
        {/* TITLE & FILTER */}
        <Box 
          component={motion.div} 
          variants={itemVariants}
          sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}
        >
          <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary' }}>
            Admin Dashboard
          </Typography>
          <ToggleButtonGroup
            value={timePeriod}
            exclusive
            onChange={handleTimePeriodChange}
            sx={{
              backgroundColor: 'background.paper',
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: '8px',
              '& .MuiToggleButton-root': {
                px: 2,
                py: 1,
                fontSize: '14px',
                fontWeight: 600,
                color: 'text.secondary',
                border: 'none',
                borderRadius: '6px',
                transition: 'all 0.2s ease',
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.08)
                },
                '&.Mui-selected': {
                  backgroundColor: 'primary.main',
                  color: 'primary.contrastText',
                  '&:hover': {
                    backgroundColor: 'primary.dark'
                  }
                }
              }
            }}
          >
            <ToggleButton value="week">Week</ToggleButton>
            <ToggleButton value="month">Month</ToggleButton>
            <ToggleButton value="year">Year</ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {/* KPI CARDS */}
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={4} component={motion.div} variants={itemVariants}>
            <KPICard
              title="Total Sessions"
              value={stats?.totalSessions || 0}
              change="Total sessions created"
              icon={SchoolIcon}
              bgColor={`linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} component={motion.div} variants={itemVariants}>
            <KPICard
              title="Participation Rate"
              value={`${stats?.participationRate || 0}%`}
              change="Completed / Total"
              icon={GroupIcon}
              bgColor={`linear-gradient(135deg, ${theme.palette.warning.light} 0%, ${theme.palette.warning.main} 100%)`}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} component={motion.div} variants={itemVariants}>
            <KPICard
              title="Avg. Tutor Rating"
              value={stats?.avgFeedbackScore ? Number(stats.avgFeedbackScore).toFixed(1) : "0.0"}
              change="Across all tutors"
              icon={StarIcon}
              bgColor={`linear-gradient(135deg, ${theme.palette.info.light} 0%, ${theme.palette.info.main} 100%)`}
            />
          </Grid>
        </Grid>

        {/* CHARTS SECTION */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {/* LINE CHART */}
          <Grid item xs={12} lg={8} component={motion.div} variants={itemVariants}>
            <Paper sx={cardStyle}>
              <Box sx={{ mb: 3 }}>
                <Typography sx={{ fontWeight: 600, fontSize: '18px', color: 'text.primary' }}>
                  Monthly Sessions Trend
                </Typography>
                <Typography sx={{ fontSize: '14px', color: 'text.secondary' }}>
                  Overview of sessions created and completed over the last 6 months.
                </Typography>
              </Box>
              <Box sx={{ height: { xs: 280, md: 360 }, width: '100%' }}>
                <Line
                  data={{
                    labels: stats?.monthlyStats?.map(s => s.month) || [],
                    datasets: [
                      {
                        label: 'Total Sessions',
                        data: stats?.monthlyStats?.map(s => s.total) || [],
                        borderColor: theme.palette.primary.main,
                        backgroundColor: theme.palette.primary.main,
                        tension: 0.4,
                        fill: true,
                        borderWidth: 2,
                        pointRadius: 5,
                        pointBackgroundColor: theme.palette.primary.main,
                        pointBorderColor: theme.palette.background.paper,
                        pointBorderWidth: 2
                      },
                      {
                        label: 'Completed Sessions',
                        data: stats?.monthlyStats?.map(s => s.completed) || [],
                        borderColor: theme.palette.warning.main,
                        backgroundColor: theme.palette.warning.main,
                        tension: 0.4,
                        fill: true,
                        borderWidth: 2,
                        pointRadius: 5,
                        pointBackgroundColor: theme.palette.warning.main,
                        pointBorderColor: theme.palette.background.paper,
                        pointBorderWidth: 2
                      }
                    ]
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    animation: {
                        duration: 2000, // Hiệu ứng vẽ biểu đồ từ từ
                        easing: 'easeOutQuart'
                    },
                    plugins: {
                      legend: {
                        position: 'bottom',
                        labels: {
                          color: chartTextColor,
                          font: { size: 13, weight: 500 },
                          padding: 12
                        }
                      },
                      tooltip: {
                        backgroundColor: theme.palette.background.paper,
                        padding: 10,
                        borderColor: theme.palette.divider,
                        borderWidth: 1,
                        titleColor: theme.palette.text.primary,
                        bodyColor: theme.palette.text.secondary
                      }
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        max: 10,
                        ticks: { color: chartTextColor, font: { size: 12 } },
                        grid: { color: theme.palette.divider }
                      },
                      x: {
                        ticks: { color: chartTextColor, font: { size: 12 } },
                        grid: { display: false }
                      }
                    }
                  }}
                />
              </Box>
            </Paper>
          </Grid>

          {/* DOUGHNUT CHART */}
          <Grid item xs={12} lg={4} component={motion.div} variants={itemVariants}>
            <Paper sx={cardStyle}>
              <Box sx={{ mb: 3 }}>
                <Typography sx={{ fontWeight: 600, fontSize: '18px', color: 'text.primary' }}>
                  Session Type Distribution
                </Typography>
                <Typography sx={{ fontSize: '14px', color: 'text.secondary' }}>
                  Breakdown of session types.
                </Typography>
              </Box>
              <Box sx={{ height: { xs: 280, md: 360 }, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Doughnut
                  data={{
                    labels: ['Academic', 'Career', 'Personal', 'Skill-based'],
                    datasets: [
                      {
                        data: [40, 25, 20, 15],
                        backgroundColor: [theme.palette.primary.main, theme.palette.warning.main, theme.palette.info.main, theme.palette.secondary.main],
                        borderColor: theme.palette.background.paper,
                        borderWidth: 2
                      }
                    ]
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    animation: {
                        animateScale: true,
                        animateRotate: true
                    },
                    plugins: {
                      legend: {
                        position: 'bottom',
                        labels: {
                          color: chartTextColor,
                          font: { size: 12, weight: 500 },
                          padding: 12
                        }
                      },
                      tooltip: {
                        backgroundColor: theme.palette.background.paper,
                        padding: 10,
                        borderColor: theme.palette.divider,
                        borderWidth: 1,
                        titleColor: theme.palette.text.primary,
                        bodyColor: theme.palette.text.secondary
                      }
                    }
                  }}
                />
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* BAR CHART */}
        <Box component={motion.div} variants={itemVariants}>
            <Paper sx={cardStyle}>
            <Box sx={{ mb: 3 }}>
                <Typography sx={{ fontWeight: 600, fontSize: '18px', color: 'text.primary' }}>
                Tutor Activity by Faculty
                </Typography>
                <Typography sx={{ fontSize: '14px', color: 'text.secondary'}}>
                Number of sessions and active tutors per faculty.
                </Typography>
            </Box>
            <Box sx={{ height: { xs: 260, md: 350 }, width: '100%', mx: 'auto' }}>
                <Bar
                data={{
                    labels: ['Computer Science and Engineering', 'Applied Science', 'Industry Management', 'Mechanic', 'Civil Engineering'],
                    datasets: [
                    {
                        label: 'Total Sessions',
                        backgroundColor: theme.palette.primary.main,
                        data: [118, 95, 88, 100, 65],
                        borderRadius: 6,
                        borderSkipped: false
                    },
                    {
                        label: 'Active Tutors',
                        backgroundColor: theme.palette.warning.main,
                        data: [15, 10, 12, 13, 7],
                        borderRadius: 6,
                        borderSkipped: false
                    }
                    ]
                }}
                options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                        color: chartTextColor,
                        font: { size: 13, weight: 500 },
                        padding: 12
                        }
                    },
                    tooltip: {
                        backgroundColor: theme.palette.background.paper,
                        padding: 10,
                        borderColor: theme.palette.divider,
                        borderWidth: 1,
                        titleColor: theme.palette.text.primary,
                        bodyColor: theme.palette.text.secondary
                    }
                    },
                    scales: {
                    y: {
                        beginAtZero: true,
                        max: 120,
                        ticks: { color: chartTextColor, font: { size: 12 } },
                        grid: { color: theme.palette.divider }
                    },
                    x: {
                        ticks: { color: chartTextColor, font: { size: 12 } },
                        grid: { display: false }
                      }
                    }
                }}
                />
            </Box>
            </Paper>
        </Box>
      </Container>

      <AdminFooter />
    </Box>
  )
}