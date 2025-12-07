import Header from '../../components/Header/StudentHeader'
import Footer from '../../components/Footer/Footer'

// --- MUI Core Components ---
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Toolbar from '@mui/material/Toolbar'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Stack from '@mui/material/Stack'
import Avatar from '@mui/material/Avatar'
import Paper from '@mui/material/Paper'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import Divider from '@mui/material/Divider'
import TextField from '@mui/material/TextField'

// --- MUI Icons ---
import TimeIcon from '@mui/icons-material/AccessTime'
import EventIcon from '@mui/icons-material/Event'
import GroupIcon from '@mui/icons-material/Group'
import StarIcon from '@mui/icons-material/Star'
import CircleIcon from '@mui/icons-material/Circle'

import { useStudentStore } from '../../stores/useStudentStore.js'
import { useEffect, useState } from 'react'
import { parseISO, differenceInDays, format } from 'date-fns'

function FindTutor() {
  const { availableCourses, fetchAvailableCourses, joinCourse } = useStudentStore()
  const [subject, setSubject] = useState('')
  const [searchName, setSearchName] = useState('')

  useEffect(() => {
    fetchAvailableCourses()
  }, [fetchAvailableCourses])


  // Generate and persist random ratings/reviews for each course
  const [courseRatings, setCourseRatings] = useState({});
  useEffect(() => {
    if (availableCourses.length > 0) {
      setCourseRatings(prev => {
        const newRatings = { ...prev };
        availableCourses.forEach(course => {
          if (!newRatings[course.course_id]) {
            newRatings[course.course_id] = {
              rating: (Math.random() * 1.2 + 3.8).toFixed(1),
              reviews: Math.floor(Math.random() * 200 + 20)
            };
          }
        });
        return newRatings;
      });
    }
  }, [availableCourses]);

  const displayCourses = availableCourses;

  const filteredCourses = displayCourses.filter(course => {
    const matchesSubject = subject ? course.title === subject : true;
    const fullName = `${course.firstname} ${course.lastname}`.toLowerCase();
    const matchesName = searchName ? fullName.includes(searchName.toLowerCase()) : true;
    return matchesSubject && matchesName;
  });

  useEffect(() => {
    fetchAvailableCourses()
  }, [fetchAvailableCourses])

  const [enrolledCourseIds, setEnrolledCourseIds] = useState([]);
  const handleJoinCourse = async (courseId) => {
    try {
      await joinCourse(courseId);
      setEnrolledCourseIds(prev => [...prev, courseId]);
      alert('Successfully joined the course!');
    } catch (error) {
      console.error(error);
      alert('Failed to join course');
    }
  } 

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Toolbar />

      <Box component="main" sx={{ flexGrow: 1, py: 4 }}>
        <Container maxWidth={false} sx={{ maxWidth: '1350px' }}>
          <Box sx={{ mb: 2, textAlign: 'center' }}>
            <Typography variant='h4' sx={{ fontWeight: 800, color: 'primary.main' }}>
              Find Your Perfect Course
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Explore courses offered by our expert tutors
            </Typography>
          </Box>

          {/* Filters */}
          <Paper sx={{ p: 3, mb: 2, borderRadius: 2 }}>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  size="small"
                  label="Search Tutor by Name"
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={4}  sx={{ flex: 0.3 }}>
                <FormControl fullWidth size="small">
                  <InputLabel>Subject</InputLabel>
                  <Select
                    value={subject}
                    label="Subject"
                    onChange={(e) => setSubject(e.target.value)}
                  >
                    <MenuItem value="">All Subjects</MenuItem>
                    <MenuItem value="Calculus">Calculus</MenuItem>
                    <MenuItem value="Physics">Physics</MenuItem>
                    <MenuItem value="Linear Algebra">Linear Algebra</MenuItem>
                    <MenuItem value="Probability and Statistics">Probability and Statistics</MenuItem>
                    <MenuItem value="Economics">Economics</MenuItem>
                    <MenuItem value="Introduction to Programming">Introduction to Programming</MenuItem>
                    <MenuItem value="Computer Networks">Computer Networks</MenuItem>
                    <MenuItem value="Software Engineering">Software Engineering</MenuItem>
                    <MenuItem value="Data Structures and Algorithms">Data Structures and Algorithms</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Paper>

          {/* Tutor Grid */}
          <Grid container spacing={3}>
            {filteredCourses.map((course) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={course.course_id}>
                <Card sx={{ 
                  height: '100%', 
                  width: '307px',
                  display: 'flex', 
                  flexDirection: 'column',
                  borderRadius: 3,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                  position: 'relative',
                  overflow: 'visible',
                  mt: 2
                }}>
                  <CardContent sx={{ pt: 4, px: 3, flexGrow: 1, textAlign: 'center' }}>
                    {/* Avatar */}
                    <Box sx={{ position: 'relative', display: 'inline-block', mb: 2 }}>
                      <Avatar 
                        sx={{ width: 80, height: 80, margin: '0 auto', border: '3px solid #fff', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
                        src="/placeholder-avatar.jpg"
                      />
                      <CircleIcon sx={{ 
                        position: 'absolute', 
                        bottom: 5, 
                        right: 5, 
                        color: '#4caf50', 
                        fontSize: 16,
                        border: '2px solid #fff',
                        borderRadius: '50%'
                      }} />
                    </Box>

                    {/* Name & Title */}
                    <Typography variant="h6" component="div" sx={{ fontWeight: 600, mb: 2 }}>
                      {course.firstname} {course.lastname}
                    </Typography>

                    {/* Tags */}
                    <Stack direction="row" spacing={1} justifyContent="center" sx={{ mb: 2, flexWrap: 'wrap'}}>
                      <Chip label={course.title} size="small" sx={{ bgcolor: 'action.hover' }} />
                    </Stack>

                    {/* Rating */}
                    <Stack direction="row" spacing={0.5} justifyContent="center" alignItems="center">
                      <StarIcon sx={{ color: '#ffc107', fontSize: 20 }} />
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{courseRatings[course.course_id]?.rating || 4.8}</Typography>
                      <Typography variant="body2" color="text.secondary">({courseRatings[course.course_id]?.reviews || 120} reviews)</Typography>
                    </Stack>
                  </CardContent>

                  <Divider sx={{ mx: 2 }} />

                  <CardActions sx={{ justifyContent: 'flex-end', px: 3, py: 2 }}>
                    <Button 
                      variant="outlined" 
                      size="small"
                      sx={{ 
                        borderRadius: 5,
                        textTransform: 'none',
                        borderColor: 'divider',
                        color: 'text.primary',
                        px: 2,
                        '&:hover': { borderColor: 'primary.main', color: 'primary.main' }
                      }}
                      onClick={() => handleJoinCourse(course.course_id)}
                      disabled={enrolledCourseIds.includes(course.course_id)}
                    >
                      {enrolledCourseIds.includes(course.course_id) ? 'Enrolled' : 'Enroll Now'}
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <Footer />
    </Box>
  )
}

export default FindTutor