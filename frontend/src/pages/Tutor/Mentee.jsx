import { useState, useEffect, useMemo } from 'react'
import Header from '../../components/Header/TutorHeader'
import Footer from '../../components/Footer/Footer'
import { Box, Container, Typography, Grid, Card, CardContent, Avatar,
  Chip, Button, Stack, ToggleButton, ToggleButtonGroup,
  Modal, Paper, Divider, IconButton
} from '@mui/material'
import { useTutorStore } from '../../stores/useTutorStore'
import { isAfter, parseISO, format } from 'date-fns'
import PersonIcon from '@mui/icons-material/Person'
import ClassIcon from '@mui/icons-material/Class'
import CloseIcon from '@mui/icons-material/Close'
import EmailIcon from '@mui/icons-material/Email'
import SchoolIcon from '@mui/icons-material/School'
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline'
import Rating from '@mui/material/Rating'


function Mentee() {
  const { mentees, fetchMentees } = useTutorStore()
  const [viewMode, setViewMode] = useState('student') // 'student' (by name) or 'class' (by class)
  const [visibleActive, setVisibleActive] = useState(24)
  const [visibleCompleted, setVisibleCompleted] = useState(12)
  const [selectedStudent, setSelectedStudent] = useState(null)
  // Ratings state: { [user_id]: rating }
  const [ratings, setRatings] = useState({})

  useEffect(() => {
    fetchMentees()
  }, [fetchMentees])

  const handleViewModeChange = (event, newMode) => {
    if (newMode !== null) {
      setViewMode(newMode)
      // Reset pagination when switching views
      setVisibleActive(24)
      setVisibleCompleted(12)
    }
  }

  // Process data
  const { activeItems, completedItems } = useMemo(() => {
    const allMentees = mentees

    if (!allMentees.length) return { activeItems: [], completedItems: [] }

    const now = new Date()

    const parseDate = (dateStr) => {
      if (!dateStr) return new Date(0)
      if (dateStr instanceof Date) return dateStr
      if (typeof dateStr === 'string') {
        if (dateStr.includes('/')) {
          const parts = dateStr.split('/')
          return new Date(`${parts[2]}-${parts[1]}-${parts[0]}`)
        }
        return new Date(dateStr)
      }
      return new Date(0)
    }

    if (viewMode === 'student') {
      // Group by student
      const grouped = allMentees.reduce((acc, curr) => {
        if (!acc[curr.user_id]) {
          acc[curr.user_id] = {
            ...curr,
            courses: []
          }
        }
        acc[curr.user_id].courses.push({
          course_id: curr.course_id,
          title: curr.course_title,
          end_date: curr.course_end_date,
          subject: curr.subject
        })
        return acc
      }, {})

      const uniqueStudents = Object.values(grouped).sort((a, b) =>
        a.firstname.localeCompare(b.firstname) || a.lastname.localeCompare(b.lastname)
      )

      const active = []
      const completed = []

      uniqueStudents.forEach(student => {
        const hasActive = student.courses.some(c => {
          return isAfter(parseDate(c.end_date), now)
        })
        if (hasActive) {
          active.push(student)
        } else {
          completed.push(student)
        }
      })

      return { activeItems: active, completedItems: completed }
    } else {
      // Group by Class
      // We need to list Classes, and inside them students
      // But the requirement is "Active Students" vs "Completed Students" sections
      // In 'class' mode, maybe we list Active Courses in top section, Completed Courses in bottom?

      // Let's group by Course first
      const coursesMap = {}
      allMentees.forEach(m => {
        if (!coursesMap[m.course_id]) {
          coursesMap[m.course_id] = {
            course_id: m.course_id,
            title: m.course_title,
            end_date: m.course_end_date,
            subject: m.subject,
            students: []
          }
        }
        coursesMap[m.course_id].students.push(m)
      })

      const active = []
      const completed = []

      Object.values(coursesMap).forEach(course => {
        if (isAfter(parseDate(course.end_date), now)) {
          active.push(course)
        } else {
          completed.push(course)
        }
      })

      return { activeItems: active, completedItems: completed }
    }
  }, [mentees, viewMode])

  const renderStudentCard = (student) => {
    // Get primary course title
    const primaryCourse = student.courses && student.courses.length > 0 ? student.courses[0].title : 'No Course'
    // Mock last session date if not present
    const lastSession = student.last_session 
      ? format(new Date(student.last_session), 'dd/MM/yyyy') 
      : 'N/A'
    const rating = ratings[student.user_id] || 0;
    const hasRated = ratings[student.user_id] !== undefined && ratings[student.user_id] !== 0;
    return (
      <Card
        key={student.user_id}
        sx={(theme) => ({
          height: 200,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          borderRadius: 2,
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
          transition: 'transform 0.2s, box-shadow 0.2s',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: 6
          }
        })}
      >
        <CardContent sx={{ p: 2, pb: 1 }}>
          <Stack direction="row" spacing={2} alignItems="center" mb={2}>
            <Box sx={{ position: 'relative' }}>
              <Avatar
                src={student.avatar}
                alt={student.firstname}
                sx={{ width: 56, height: 56 }}
              >
                {student.firstname?.[0]}
              </Avatar>
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 2,
                  right: 2,
                  width: 12,
                  height: 12,
                  bgcolor: '#4CAF50', // Green for active
                  borderRadius: '50%',
                  border: '2px solid white'
                }}
              />
            </Box>
            <Box sx={{ overflow: 'hidden' }}>
              <Typography variant="subtitle1" fontWeight="bold" noWrap>
                {student.firstname} {student.lastname}
              </Typography>
              <Typography variant="body2" color="text.primary" noWrap>
                {primaryCourse}
              </Typography>
            </Box>
          </Stack>

          <Typography variant="body2" color="text.primary" sx={{ mt: 2, mb: 1 }}>
            Last Session: {lastSession}
          </Typography>
        </CardContent>

        <Box sx={{ px: 2, pb: 1, display: 'flex', flexDirection: 'row', gap: 1 }}>
          <Button
            variant="outlined"
            size="small"
            sx={{
              borderRadius: 1,
              textTransform: 'none',
              borderColor: 'divider',
              color: 'text.primary',
              px: 2,
              minWidth: 40,
              '&:hover': { borderColor: 'primary.main', color: 'primary.main', bgcolor: 'action.hover' }
            }}
          >
            <ChatBubbleOutlineIcon sx={{ fontSize: 22 }} />
          </Button>
          <Button 
            variant="outlined" 
            fullWidth 
            color="inherit"
            sx={{ 
              borderColor: 'divider', 
              textTransform: 'none',
              color: 'text.primary',
              '&:hover': {
                borderColor: 'primary.main',
                bgcolor: 'action.hover'
              }
            }}
            onClick={() => setSelectedStudent(student)}
          >
            View Details
          </Button>
        </Box>

        {/* Rating Mechanism */}
        <Box sx={{ px: 2, pb: 2, pt: 0, display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5 }}>
            Rate this student:
          </Typography>
          <Box>
            <Rating
              name={`student-rating-${student.user_id}`}
              value={rating}
              onChange={(event, newValue) => {
                if (!hasRated && newValue !== null) {
                  setRatings(prev => ({ ...prev, [student.user_id]: newValue }))
                }
              }}
              size="small"
              disabled={hasRated}
            />
          </Box>
        </Box>
      </Card>
    )
  }

  const renderClassGroup = (course) => (
    <Box key={course.course_id} sx={{ mb: 4 }}>
      <Typography variant="h6" color="primary" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <ClassIcon fontSize="small" />
        {course.title} ({course.students.length} students)
      </Typography>
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: {
          xs: 'repeat(1, 1fr)',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
          lg: 'repeat(4, 1fr)'
        },
        gap: 3 
      }}>
        {course.students.map(student => (
          <Box key={student.user_id}>
            {renderStudentCard({
              ...student,
              courses: [{ title: course.title }] // In class view, context is this class
            })}
          </Box>
        ))}
      </Box>
    </Box>
  )

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', display: 'flex', flexDirection: 'column' }}>
      <Header />

      <Container maxWidth={false} sx={{ maxWidth: '1350px', mx: 'auto', mt: 12, mb: 4, flex: 1 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
          <Typography variant="h4" fontWeight="bold" color="text.primary">
            My Students
          </Typography>

          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={handleViewModeChange}
            aria-label="view mode"
            size="small"
          >
            <ToggleButton value="student" aria-label="by student">
              <PersonIcon sx={{ mr: 1 }} /> By Name
            </ToggleButton>
            <ToggleButton value="class" aria-label="by class">
              <ClassIcon sx={{ mr: 1 }} /> By Class
            </ToggleButton>
          </ToggleButtonGroup>
        </Stack>

        {/* Active Section */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mb: 3, borderLeft: 4, borderColor: 'primary.main', pl: 2 }}>
            Current Students (Active Courses)
          </Typography>

          {viewMode === 'student' ? (
            <>
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: {
                  xs: 'repeat(1, 1fr)',
                  sm: 'repeat(2, 1fr)',
                  md: 'repeat(3, 1fr)',
                  lg: 'repeat(4, 1fr)'
                },
                gap: 3 
              }}>
                {activeItems.slice(0, visibleActive).map(student => (
                  <Box key={student.user_id}>
                    {renderStudentCard(student)}
                  </Box>
                ))}
              </Box>
              {visibleActive < activeItems.length && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                  <Button variant="outlined" onClick={() => setVisibleActive(prev => prev + 12)}>
                    Load More
                  </Button>
                </Box>
              )}
              {activeItems.length === 0 && (
                <Typography color="text.secondary" align="center">No active students found.</Typography>
              )}
            </>
          ) : (
            <>
              {activeItems.slice(0, visibleActive).map(course => renderClassGroup(course))}
              {visibleActive < activeItems.length && (
                <Button onClick={() => setVisibleActive(prev => prev + 5)}>Load More Classes</Button>
              )}
              {activeItems.length === 0 && (
                <Typography color="text.secondary" align="center">No active students found.</Typography>
              )}
            </>
          )}
        </Box>

        <Divider sx={{ my: 6 }} />

        {/* Completed Section */}
        <Box>
          <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mb: 3, borderLeft: 4, borderColor: 'text.secondary', pl: 2 }}>
            Past Students (Completed Courses)
          </Typography>

          {viewMode === 'student' ? (
            <>
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: {
                  xs: 'repeat(1, 1fr)',
                  sm: 'repeat(2, 1fr)',
                  md: 'repeat(3, 1fr)',
                  lg: 'repeat(4, 1fr)'
                },
                gap: 3 
              }}>
                {completedItems.slice(0, visibleCompleted).map(student => (
                  <Box key={student.user_id}>
                    {renderStudentCard(student)}
                  </Box>
                ))}
              </Box>
              {visibleCompleted < completedItems.length && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                  <Button variant="outlined" onClick={() => setVisibleCompleted(prev => prev + 12)}>
                    Load More
                  </Button>
                </Box>
              )}
              {completedItems.length === 0 && (
                <Typography color="text.secondary" align="center">No past students found.</Typography>
              )}
            </>
          ) : (
            <>
              {completedItems.slice(0, visibleCompleted).map(course => renderClassGroup(course))}
              {completedItems.length === 0 && (
                <Typography color="text.secondary" align="center">No past students found.</Typography>
              )}
            </>
          )}
        </Box>

      </Container>

      {/* Student Details Modal */}
      <Modal
        open={!!selectedStudent}
        onClose={() => setSelectedStudent(null)}
        aria-labelledby="student-modal-title"
      >
        <Paper sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '90%', sm: 500 },
          p: 4,
          borderRadius: 2,
          outline: 'none'
        }}>
          {selectedStudent && (
            <>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <IconButton onClick={() => setSelectedStudent(null)}>
                  <CloseIcon />
                </IconButton>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
                <Avatar
                  src={selectedStudent.avatar}
                  sx={{ width: 100, height: 100, mb: 1, bgcolor: 'primary.main', fontSize: '2.5rem' }}
                >
                  {selectedStudent.firstname?.[0]}
                </Avatar>
                <Typography variant="h5" fontWeight="bold">
                  {selectedStudent.firstname} {selectedStudent.lastname}
                </Typography>
                <Stack direction="row" alignItems="center" gap={1} color="text.secondary" mt={1}>
                  <EmailIcon fontSize="small" />
                  <Typography>{selectedStudent.email}</Typography>
                </Stack>
              </Box>

              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <SchoolIcon color="primary" />
                Enrolled Courses
              </Typography>
              <Stack spacing={2} sx={{ mt: 2, maxHeight: 300, overflowY: 'auto' }}>
                {(selectedStudent.courses || []).map((course, idx) => {
                  const dateParts = course.end_date.split('/')
                  const isoDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`
                  const isActive = isAfter(parseISO(isoDate), new Date())
                  
                  return (
                    <Paper key={idx} variant="outlined" sx={{ p: 2 }}>
                      <Typography variant="subtitle1" fontWeight="bold">{course.title}</Typography>
                      <Typography variant="body2" color="text.secondary">Subject: {course.subject}</Typography>
                      <Typography variant="caption" display="block" sx={{ mt: 0.5, color: isActive ? 'success.main' : 'text.secondary' }}>
                        {isActive ? '• Active' : '• Completed'}
                      </Typography>
                    </Paper>
                  )
                })}
              </Stack>
            </>
          )}
        </Paper>
      </Modal>

      <Footer />
    </Box>
  )
}

export default Mentee