import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTheme, alpha } from '@mui/material/styles'
import Header from '../../components/Header/TutorHeader'
import Footer from '../../components/Footer/Footer'

import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import IconButton from '@mui/material/IconButton'

// Icons
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import StarIcon from '@mui/icons-material/Star'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import PeopleIcon from '@mui/icons-material/People'
import EventIcon from '@mui/icons-material/Event'

// Charts
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title as ChartTitle,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
} from 'chart.js'
import { Bar, Line } from 'react-chartjs-2'
import { ThemeContext } from '@emotion/react'
import { useTutorStore } from '../../stores/useTutorStore'
import { format, parseISO } from 'date-fns'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ChartTitle,
  Tooltip,
  Legend,
  PointElement,
  LineElement
)

function TutorDashboard() {
  const { mentees, fetchMentees, sessions, fetchTutoringSessions, stats, fetchStats } = useTutorStore()

  useEffect(() => {
    fetchMentees()
    fetchTutoringSessions()
    fetchStats()
  }, [fetchMentees, fetchTutoringSessions, fetchStats])
  const theme = useTheme()
  // --- Mock Data for Charts ---
  const barChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Sessions',
        data: [18, 24, 36, 30, 45, 43, 28, 30, 25, 38, 42, 35],
        backgroundColor: '#8c9eff',
        borderRadius: 4,
      },
    ],
  }

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: false },
    },
    scales: {
      y: { beginAtZero: true, max: 40 },
      x: { grid: { display: false } },
    },
  }

  const lineChartData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7', 'Week 8'],
    datasets: [
      {
        label: 'Participation',
        data: [95, 90, 88, 96, 92, 94, 97, 96],
        borderColor: '#a5d6a7',
        backgroundColor: '#a5d6a7',
        tension: 0.4,
        pointRadius: 4,
      },
    ],
  }

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: { beginAtZero: true, max: 100 },
      x: { grid: { display: false } },
    },
  }

  // Remove duplicate mentees by user_id
  const uniqueMentees = mentees.filter((m, idx, arr) => arr.findIndex(x => x.user_id === m.user_id) === idx);

  // --- Data for Students ---
  const students = uniqueMentees.slice(0, 4).map(m => ({
    id: m.user_id,
    name: `${m.firstname} ${m.lastname}`,
    subject: m.subject,
    date: m.last_session ? format(parseISO(m.last_session), 'dd/MM/yyyy') : 'N/A',
    avatar: m.avatar
  }));


  // --- Calendar Mock ---
  const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
  // Simple representation of November 2023 starting on Wednesday
  // 1st is Wed.
  const calendarDays = [
    { day: '', status: '' }, { day: '', status: '' }, { day: '', status: '' }, 
    { day: 1, status: 'available' }, { day: 2, status: 'available' }, { day: 3, status: 'available' }, { day: 4, status: 'available' },
    { day: 5, status: 'available' }, { day: 6, status: 'booked' }, { day: 7, status: 'booked' }, { day: 8, status: 'available' }, { day: 9, status: 'available' }, { day: 10, status: 'available' }, { day: 11, status: 'available' },
    { day: 12, status: 'available' }, { day: 13, status: 'available' }, { day: 14, status: 'available' }, { day: 15, status: 'pending' }, { day: 16, status: 'available' }, { day: 17, status: 'available' }, { day: 18, status: 'available' },
    { day: 19, status: 'available' }, { day: 20, status: 'available' }, { day: 21, status: 'available' }, { day: 22, status: 'pending' }, { day: 23, status: 'available' }, { day: 24, status: 'available' }, { day: 25, status: 'available' },
    { day: 26, status: 'available' }, { day: 27, status: 'available' }, { day: 28, status: 'available' }, { day: 29, status: 'available' }, { day: 30, status: 'available' }
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return alpha(theme.palette.success.main, 0.4)
      case 'booked': return alpha(theme.palette.info.main, 0.4)
      case 'pending': return alpha(theme.palette.warning.main, 0.4)
      default: return 'transparent'
    }
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
      <Header />
      <Toolbar />
      <Box component="main" sx={{ flexGrow: 1, py: 4 }}>
        <Container maxWidth={false} sx={{ maxWidth: '1350px' }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 4, color: 'text.primary'}}>
            Welcome, Tutor!
          </Typography>

          <Grid container spacing={3} justifyContent="space-between">
            {/* Left Column: Calendar */}
            <Grid item xs={12} md={4} lg={3}>
              <Paper sx={{ p: 3, borderRadius: 3}}>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                  <Box component={EventIcon} sx={{ color: 'text.secondary' }} />
                  <Typography variant="h6" fontWeight="bold">My Calendar</Typography>
                </Stack>
                
                {/* Legend */}
                <Stack direction="row" spacing={2} sx={{ mb: 3, fontSize: '0.75rem' }}>
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: alpha(theme.palette.success.main, 0.4) }} />
                    <Typography variant="caption">Available</Typography>
                  </Stack>
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: alpha(theme.palette.info.main, 0.4) }} />
                    <Typography variant="caption">Booked</Typography>
                  </Stack>
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: alpha(theme.palette.warning.main, 0.4) }} />
                    <Typography variant="caption">Pending</Typography>
                  </Stack>
                </Stack>

                {/* Calendar Header */}
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                  <IconButton size="small"><ChevronLeftIcon /></IconButton>
                  <Typography fontWeight="bold">November 2023</Typography>
                  <IconButton size="small"><ChevronRightIcon /></IconButton>
                </Stack>

                {/* Calendar Grid */}
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 1, textAlign: 'center' }}>
                  {days.map(day => (
                    <Typography key={day} variant="caption" color="text.secondary" fontWeight="bold" sx={{ py: 1 }}>
                      {day}
                    </Typography>
                  ))}
                  {calendarDays.map((d, i) => (
                    <Box 
                      key={i} 
                      sx={{ 
                        height: 30,
                        aspectRatio: '1.3/1', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        bgcolor: getStatusColor(d.status),
                        borderRadius: 1,
                        fontSize: '0.9rem',
                        cursor: d.day ? 'pointer' : 'default',
                        fontWeight: d.status ? '550' : '400',
                        color: 'text.primary',
                        '&:hover': d.day ? { opacity: 0.8 } : {}
                      }}
                    >
                      {d.day}
                    </Box>
                  ))}
                </Box>
              </Paper>
            </Grid>

            {/* Middle Column: Aggregated Statistics */}
            <Grid item xs={12} md={8} lg={6}>
              <Paper sx={{ p: 3, borderRadius: 3}}>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                  <TrendingUpIcon color="action" />
                  <Typography variant="h6" fontWeight="bold">Aggregated Statistics</Typography>
                </Stack>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Overview of your tutoring performance.
                </Typography>

                {/* Filters */}
                <Stack direction="row" spacing={2} sx={{ mb: 4 }}>
                  <FormControl size="small" sx={{ minWidth: 120 }}>
                    <Select defaultValue="Time Period" displayEmpty inputProps={{ 'aria-label': 'Time Period' }}>
                      <MenuItem value="Time Period">Time Period</MenuItem>
                      <MenuItem value="Last Week">Last Week</MenuItem>
                      <MenuItem value="Last Month">Last Month</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl size="small" sx={{ minWidth: 120 }}>
                    <Select defaultValue="Subject" displayEmpty>
                      <MenuItem value="Subject">Subject</MenuItem>
                      <MenuItem value="Math">Math</MenuItem>
                      <MenuItem value="Physics">Physics</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl size="small" sx={{ minWidth: 120 }}>
                    <Select defaultValue="Tutor" displayEmpty>
                      <MenuItem value="Tutor">Tutor</MenuItem>
                      <MenuItem value="Me">Me</MenuItem>
                    </Select>
                  </FormControl>
                </Stack>

                {/* Charts */}
                <Box sx={{ mb: 4 }}>
                  <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>Total Sessions</Typography>
                  <Box sx={{ height: 200 , width:475}}>
                    <Bar data={barChartData} options={barChartOptions} />
                  </Box>
                </Box>

                <Box>
                  <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>Participation Rate</Typography>
                  <Box sx={{ height: 175, width: 475}}>
                    <Line data={lineChartData} options={lineChartOptions} />
                  </Box>
                </Box>
              </Paper>
            </Grid>

            {/* Right Column: Performance & Students */}
            <Grid item xs={12} md={12} lg={3}>
              <Stack spacing={3} >
                {/* Performance Card */}
                <Paper sx={{ p: 3, borderRadius: 3 }}>
                  <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                    <TrendingUpIcon color="action" />
                    <Typography variant="h6" fontWeight="bold" sx={{ lineHeight: 1.2 }}>
                      Your Performance
                    </Typography>
                  </Stack>
                  
                  <Grid container spacing={2} sx={{ textAlign: 'center', mt: 1 }}>
                    <Grid item xs={4}>
                      <Typography variant="h4" fontWeight="bold">{uniqueMentees.length}</Typography>
                      <Typography variant="caption" color="text.secondary">Total Students</Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography variant="h4" fontWeight="bold">{mentees.length}</Typography>
                      <Typography variant="caption" color="text.secondary">Upcoming Sessions</Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Stack direction="row" alignItems="center" justifyContent="center" spacing={0.5}>
                        <Typography variant="h4" fontWeight="bold">{stats?.averageRating ? Number(stats.averageRating).toFixed(1) : 'N/A'}</Typography>
                        <StarIcon sx={{ color: '#ffb300' }} />
                      </Stack>
                      <Typography variant="caption" color="text.secondary">Average Rating</Typography>
                    </Grid>
                  </Grid>
                </Paper>

                {/* Students Card */}
                <Paper sx={{ p: 3, borderRadius: 3, flexGrow: 1 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Box component={PeopleIcon} sx={{ color: 'text.secondary' }} />
                      <Typography variant="h6" fontWeight="bold">My Students</Typography>
                    </Stack>
                    <Button size="small" component={Link} to="/students">View All</Button>
                  </Stack>

                  <List>
                    {students.map((student, index) => (
                      <React.Fragment key={student.id}>
                        <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                          <ListItemAvatar>
                            <Avatar src={student.avatar} alt={student.name} />
                          </ListItemAvatar>
                          <ListItemText
                            primary={student.name}
                            secondary={
                              <React.Fragment>
                                <Typography component="span" variant="body2" color="text.primary" display="block">
                                  {student.subject}
                                </Typography>
                                <Typography component="span" variant="caption" color="text.secondary">
                                  Last session: {student.date}
                                </Typography>
                              </React.Fragment>
                            }
                          />
                          <Button variant="outlined" size="small" sx={{ borderRadius: 2, textTransform: 'none' }}>
                            Details
                          </Button>
                        </ListItem>
                        {index < students.length - 1 && <Divider variant="inset" component="li" />}
                      </React.Fragment>
                    ))}
                  </List>
                </Paper>
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>
      <Footer />
    </Box>
  )
}

export default TutorDashboard