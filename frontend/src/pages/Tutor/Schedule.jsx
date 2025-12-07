import { useState, useEffect, useRef } from 'react'
import {
  format, startOfMonth, endOfMonth, startOfWeek, endOfWeek,
  addDays, addMonths, subMonths, isSameMonth, isSameDay, parseISO, getWeek, getDay, isValid
} from 'date-fns'
// --- MUI Core Components ---
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import TextField from '@mui/material/TextField'
import Popover from '@mui/material/Popover'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import InputAdornment from '@mui/material/InputAdornment'
import Stack from '@mui/material/Stack'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Toolbar from '@mui/material/Toolbar'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import { useTheme, alpha } from '@mui/material/styles'

// --- MUI Icons ---
import ChevronLeft from '@mui/icons-material/ChevronLeft'
import ChevronRight from '@mui/icons-material/ChevronRight'
import AddIcon from '@mui/icons-material/Add'
import EventIcon from '@mui/icons-material/Event'
import TimeIcon from '@mui/icons-material/AccessTime'
import DeleteIcon from '@mui/icons-material/Delete'

import Header from '../../components/Header/TutorHeader'
import Footer from '../../components/Footer/Footer'
import { useTutorStore } from '../../stores/useTutorStore'

const MiniCalendar = ({ value, onChange, onClose }) => {
  const [viewDate, setViewDate] = useState(value && isValid(parseISO(value)) ? parseISO(value) : new Date())

  const handlePrev = () => setViewDate(subMonths(viewDate, 1))
  const handleNext = () => setViewDate(addMonths(viewDate, 1))

  const startDate = startOfWeek(startOfMonth(viewDate))
  const endDate = endOfWeek(endOfMonth(viewDate))

  const days = []
  let day = startDate
  while (day <= endDate) {
    days.push(day)
    day = addDays(day, 1)
  }

  return (
    <Box sx={{ p: 2, width: 320 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <IconButton onClick={handlePrev} size="small"><ChevronLeft /></IconButton>
        <Typography fontWeight="bold">{format(viewDate, 'MMMM yyyy')}</Typography>
        <IconButton onClick={handleNext} size="small"><ChevronRight /></IconButton>
      </Stack>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 1 }}>
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
          <Typography key={d} variant="caption" align="center" color="text.secondary" sx={{ fontWeight: 'bold' }}>{d}</Typography>
        ))}
        {days.map((d, i) => {
          const isSelected = value && isValid(parseISO(value)) && isSameDay(d, parseISO(value))
          const isCurrentMonth = isSameMonth(d, viewDate)
          return (
            <Box
              key={i}
              onClick={() => {
                onChange(format(d, 'yyyy-MM-dd'))
                onClose()
              }}
              sx={{
                height: 36,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                borderRadius: '50%',
                bgcolor: isSelected ? 'primary.main' : 'transparent',
                color: isSelected ? 'primary.contrastText' : (isCurrentMonth ? 'text.primary' : 'text.disabled'),
                '&:hover': { bgcolor: isSelected ? 'primary.dark' : 'action.hover' }
              }}
            >
              <Typography variant="body2">{format(d, 'd')}</Typography>
            </Box>
          )
        })}
      </Box>
    </Box>
  )
}

function Schedule() {
  const theme = useTheme()
  
  // Custom Date Picker State
  const [pickerAnchor, setPickerAnchor] = useState(null)
  const [activePickerContext, setActivePickerContext] = useState(null) // { form: 'availability' | 'class', field: string }

  const handleOpenPicker = (event, form, field) => {
    setPickerAnchor(event.currentTarget)
    setActivePickerContext({ form, field })
  }

  const handleClosePicker = () => {
    setPickerAnchor(null)
    setActivePickerContext(null)
  }

  const handleDateSelect = (dateStr) => {
    if (!activePickerContext) return

    if (activePickerContext.form === 'availability') {
      setAvailabilityForm(prev => ({ ...prev, [activePickerContext.field]: dateStr }))
    } else if (activePickerContext.form === 'class') {
      setFormData(prev => ({ ...prev, [activePickerContext.field]: dateStr }))
    }
    // handleClosePicker() is called by the MiniCalendar's onClose
  }

  const [currentDate, setCurrentDate] = useState(new Date())
  const [openModal, setOpenModal] = useState(false)
  const [openAvailabilityModal, setOpenAvailabilityModal] = useState(false)
  const [visibleUpcoming, setVisibleUpcoming] = useState(5)
  const [selectedSession, setSelectedSession] = useState(null)
  const [activeTab, setActiveTab] = useState(0)
  const [tempCourses, setTempCourses] = useState([]);

  const { createCourse, courses, fetchCourses } = useTutorStore()

  // Mock data for availability blocks
  const [availabilityBlocks, setAvailabilityBlocks] = useState([
    { id: 1, date: '2025-12-14', endDate: '2025-12-14', start: '09:00', end: '11:00', recurrence: 'No Recurrence' },
    { id: 2, date: '2025-12-06', endDate: '2026-01-31', start: '14:00', end: '16:00', recurrence: 'Bi-weekly' },
    { id: 3, date: '2025-12-05', endDate: '2026-02-06', start: '10:00', end: '12:00', recurrence: 'Weekly' },
    { id: 4, date: '2025-12-01', endDate: '2026-01-12', start: '11:00', end: '12:00', recurrence: 'Weekly' },
    { id: 5, date: '2025-12-03', endDate: '2026-02-11', start: '20:00', end: '22:00', recurrence: 'Weekly' },
    { id: 6, date: '2025-12-02', endDate: '2026-02-03', start: '15:00', end: '17:00', recurrence: 'Weekly' },
    { id: 7, date: '2025-12-04', endDate: '2026-01-22', start: '15:00', end: '17:00', recurrence: 'Weekly' },
  ])

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue)
  }

  useEffect(() => {
    fetchCourses()
  }, [fetchCourses])

  // Only use courses for sessions/events
  const allCourses = [...courses, ...tempCourses];
  const sessions = allCourses.flatMap(course => {
    const events = []
    if (!course.start_date || !course.end_date) return []
    const startDate = new Date(course.start_date)
    const endDate = new Date(course.end_date)
    let daysOfWeek = []
    if (course.days_of_week) {
      try {
        daysOfWeek = typeof course.days_of_week === 'string' 
          ? JSON.parse(course.days_of_week) 
          : course.days_of_week
      } catch (e) {
        console.error('Error parsing days_of_week', e)
        daysOfWeek = [startDate.getDay()]
      }
    } else {
      daysOfWeek = [startDate.getDay()]
    }
    if (!Array.isArray(daysOfWeek)) daysOfWeek = [startDate.getDay()]
    let current = new Date(startDate)
    while (current <= endDate) {
      if (daysOfWeek.includes(current.getDay())) {
        events.push({
          id: `c-${course.course_id}-${format(current, 'yyyy-MM-dd')}`,
          courseId: course.course_id,
          title: course.title,
          isoDate: format(current, 'yyyy-MM-dd'),
          time: course.start_time ? course.start_time.slice(0, 5) : '00:00',
          type: 'class',
          originalData: course
        })
      }
      current = addDays(current, 1)
    }
    return events
  })

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    startTime: '00:00',
    endTime: '00:00',
    regStart: '',
    regEnd: '',
    maxStudents: '',
    recurrence: 'none',
    daysOfWeek: []
  })

  const handleDaysChange = (event, newDays) => {
    setFormData({ ...formData, daysOfWeek: newDays })
  }

  const formatDateForDisplay = (dateString) => {
    if (!dateString) return ''
    const date = parseISO(dateString)
    return isValid(date) ? format(date, 'dd/MM/yyyy') : dateString
  }

  // Availability Form State
  const [availabilityForm, setAvailabilityForm] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    endDate: format(new Date(), 'yyyy-MM-dd'),
    start: '00:00',
    end: '00:00',
    recurrence: 'No Recurrence'
  })

  const handleAvailabilityChange = (prop) => (event) => {
    setAvailabilityForm({ ...availabilityForm, [prop]: event.target.value })
  }

  const handleAddBlock = () => {
    const blockDate = parseISO(availabilityForm.date)
    const newBlock = {
      id: Date.now(),
      ...availabilityForm,
      startWeek: getWeek(blockDate)
    }
    setAvailabilityBlocks([...availabilityBlocks, newBlock])
    setOpenAvailabilityModal(false)
  }

  const handleDeleteBlock = (id) => {
    setAvailabilityBlocks(availabilityBlocks.filter(b => b.id !== id))
  }

  // --- Calendar Logic with date-fns ---
  const headerFormat = 'MMMM yyyy'
  const startDate = startOfWeek(startOfMonth(currentDate), { weekStartsOn: 1 })
  const endDate = endOfWeek(endOfMonth(currentDate), { weekStartsOn: 1 })

  const generateCalendarDays = () => {
    const days = []
    let day = startDate

    while (day <= endDate) {
      days.push(day)
      day = addDays(day, 1)
    }
    return days
  }

  const calendarDays = generateCalendarDays()

  // --- Handlers ---
  const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1))
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1))
  const handleToday = () => setCurrentDate(new Date())

  const handleCreateClass = () => {
    const start = parseISO(formData.startDate);
    const dayOfWeek = getDay(start);
    const newCourse = {
      course_id: `temp-${Date.now()}`,
      title: formData.title,
      subject: formData.subject,
      description: '',
      max_students: formData.maxStudents,
      start_date: formData.startDate,
      end_date: formData.endDate,
      start_time: formData.startTime,
      end_time: formData.endTime,
      registration_start: formData.regStart,
      registration_end: formData.regEnd,
      recurrence_type: 'Weekly',
      // Store as JSON string for consistency with backend
      days_of_week: JSON.stringify(formData.daysOfWeek.length > 0 ? formData.daysOfWeek : [dayOfWeek])
    };
    setTempCourses(prev => [...prev, newCourse]);
    setOpenModal(false);
  };

  const handleChange = (prop) => (event) => {
    setFormData({ ...formData, [prop]: event.target.value })
  }

  const [filterType, setFilterType] = useState('all')

  const handleFilterChange = (event, newFilter) => {
    if (newFilter !== null) {
      setFilterType(newFilter)
    }
  }

  // Filter upcoming events
  const filteredSessions = sessions.filter(s => {
    if (filterType === 'all') return true
    return s.type === filterType
  })

  const upcomingEvents = filteredSessions
    .filter(s => s.isoDate && parseISO(s.isoDate) >= new Date().setHours(0, 0, 0, 0))
    .sort((a, b) => parseISO(a.isoDate + 'T' + a.time) - parseISO(b.isoDate + 'T' + b.time))
    .filter((session, index, self) => {
      if (!session.courseId) return true
      return self.findIndex(s => s.courseId === session.courseId) === index
    })

  const calendarContent = (
    <Paper elevation={2} sx={{ px: 3, py: 1.9, borderRadius: 2, display: 'flex', flexDirection: 'column' }}>
      {/* Calendar Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight="bold" color="primary">
          {format(currentDate, headerFormat)}
        </Typography>
        <Stack direction="row" spacing={1}>
          <IconButton onClick={handlePrevMonth}><ChevronLeft /></IconButton>
          <Button variant="outlined" size="small" onClick={handleToday}>Today</Button>
          <IconButton onClick={handleNextMonth}><ChevronRight /></IconButton>
        </Stack>
      </Stack>

      {/* Calendar Grid (CSS Grid) */}
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        borderTop: 1,
        borderLeft: 1,
        borderColor: 'divider',
        flexGrow: 1
      }}>
        {/* Days Header */}
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((dayName) => (
          <Box key={dayName} sx={{
            p: 1,
            textAlign: 'center',
            fontWeight: 'bold',
            color: 'text.secondary',
            borderRight: 1,
            borderBottom: 1,
            borderColor: 'divider',
            bgcolor: 'background.neutral'
          }}>
            {dayName}
          </Box>
        ))}

        {/* Days Cells */}
        {calendarDays.map((day, index) => {
          const dateKey = format(day, 'yyyy-MM-dd')
          const dayEvents = filteredSessions.filter(s => s.isoDate === dateKey)
          const isCurrentMonth = isSameMonth(day, currentDate)
          const isToday = isSameDay(day, new Date())
          
          // Check availability
          const isAvailable = availabilityBlocks.some(block => {
            const blockDate = parseISO(block.date)
            const blockEndDate = block.endDate ? parseISO(block.endDate) : null
            
            // 1. Check if current day is before the start date of availability
            if (day < blockDate) return false

            // 2. Check if current day is after the end date (if exists)
            if (blockEndDate && day > blockEndDate) return false

            // 3. Check if it's the same day of week
            if (getDay(day) !== getDay(blockDate)) return false

            // 4. Check recurrence
            if (block.recurrence === 'No Recurrence') {
              return isSameDay(day, blockDate)
            }
            if (block.recurrence === 'Weekly') {
              return true
            }
            if (block.recurrence === 'Bi-weekly') {
              const currentWeek = getWeek(day)
              const startWeek = block.startWeek || getWeek(blockDate)
              return (currentWeek - startWeek) % 2 === 0
            }
            return false
          })

          return (
            <Box key={index} sx={{
              height: 100,
              overflow: 'hidden',
              borderRight: 1,
              borderBottom: 1,
              borderColor: 'divider',
              bgcolor: (isAvailable && isCurrentMonth) 
                ? alpha(theme.palette.primary.main, 0.25) 
                : (isCurrentMonth ? 'background.paper' : 'background.default'),
              p: 1,
              position: 'relative',
              transition: 'background-color 0.2s',
              '&:hover': { bgcolor: 'action.hover' }
            }}>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: isToday ? 'bold' : 'normal',
                  color: isToday ? 'primary.contrastText' : (isCurrentMonth ? 'text.primary' : 'text.disabled'),
                  bgcolor: isToday ? 'primary.main' : 'transparent',
                  width: 24, height: 24, borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  mb: 1
                }}
              >
                {format(day, 'd')}
              </Typography>

              <Stack spacing={0.5}>
                {dayEvents.map(ev => (
                  <Chip
                    key={ev.id}
                    label={`${ev.time} ${ev.title}`}
                    size="small"
                    color={ev.type === 'class' ? 'primary' : 'secondary'}
                    onClick={() => setSelectedSession(ev)}
                    sx={{
                      fontSize: '0.7rem',
                      height: 22,
                      width: '100%',
                      justifyContent: 'flex-start',
                      cursor: 'pointer',
                      '& .MuiChip-label': { paddingLeft: 1, paddingRight: 1 }
                    }}
                  />
                ))}
              </Stack>
            </Box>
          )
        })}
      </Box>

      {/* Legend */}
      <Stack direction="row" spacing={3} mt={2} justifyContent="center">
        <Stack direction="row" alignItems="center" spacing={1}>
          <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: alpha(theme.palette.primary.main, 0.2) }} />
          <Typography variant="caption">Availability</Typography>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: 'primary.main' }} />
          <Typography variant="caption">Tutoring Session</Typography>
        </Stack>
      </Stack>
    </Paper>
  )

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Header />
      <Toolbar />

      <Container maxWidth={false} sx={{ maxWidth: '1350px', mx: 'auto', mt: 4, mb: 4, flex: 1 }}>
        <Typography variant="h4" fontWeight="bold" mb={3}>My Calendar</Typography>

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
          <Box sx={{ width: { xs: '100%', md: '55%' }, flexShrink: 0 }}>
            {calendarContent}
          </Box>
          <Box sx={{ flex: 1 }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
              <Tabs value={activeTab} onChange={handleTabChange} aria-label="calendar tabs">
                <Tab label="Create Availability" />
                <Tab label="Publish Sessions" />
              </Tabs>
            </Box>

            {activeTab === 0 && (
          <Stack spacing={3}  flexDirection="column" >
            {/* Define Recurring Availability Button */}
            <Button 
              variant="contained"
              size="large"
              startIcon={<AddIcon />}
              fullWidth
              sx={{ py: 1.5, fontWeight: 'bold' }}
              onClick={() => setOpenAvailabilityModal(true)}
            >
              Add Availability
            </Button>

            {/* Current Recurring Blocks (Table on top) */}
            <Paper elevation={2} sx={{ p: 3, borderRadius: 2, flex: 1 }}>
              <Typography variant="h6" fontWeight="bold">Current Availabilites</Typography>
              <Typography variant="body2" color="text.secondary" mb={3}>
                These are your defined availability patterns.
              </Typography>
              <Stack spacing={2} sx={{ maxHeight: 400, overflowY: 'auto', pr: 1 }}>
                {[...availabilityBlocks]
                  .sort((a, b) => parseISO(a.date) - parseISO(b.date))
                  .map(block => (
                  <Box key={block.id} sx={{
                    p: 2,
                    border: 1,
                    borderColor: 'divider',
                    borderRadius: 2,
                    cursor: 'pointer',
                    '&:hover': { bgcolor: 'action.hover' },
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start'
                  }}>
                    <Box>
                      <Stack direction="row" spacing={2} mb={1}>
                        <Stack direction="row" alignItems="center" spacing={0.5}>
                          <EventIcon fontSize="small" color="action" />
                          <Typography variant="caption">
                            {format(parseISO(block.date), 'dd/MM/yyyy')}
                            {block.endDate && block.recurrence !== 'No Recurrence' ? ` - ${format(parseISO(block.endDate), 'dd/MM/yyyy')}` : ''}
                          </Typography>
                        </Stack>
                        <Stack direction="row" alignItems="center" spacing={0.5}>
                          <TimeIcon fontSize="small" color="action" />
                          <Typography variant="caption">{block.start} - {block.end}</Typography>
                        </Stack>
                      </Stack>
                      <Typography variant="subtitle2" fontWeight="bold">
                        {block.recurrence}
                      </Typography>
                    </Box>
                    <IconButton color="error" size="small" onClick={() => handleDeleteBlock(block.id)}><DeleteIcon /></IconButton>
                  </Box>
                ))}
              </Stack>
            </Paper>
          </Stack>
        )}

        {activeTab === 1 && (
          <Stack spacing={3}>
            {/* Action Button */}
            <Button
              variant="contained"
              size="large"
              startIcon={<AddIcon />}
              fullWidth
              onClick={() => setOpenModal(true)}
              sx={{ py: 1.5, fontWeight: 'bold' }}
            >
              Create New Session
            </Button>

            {/* Upcoming List */}
            <Paper elevation={2} sx={{ p: 3, borderRadius: 2, flex: 1 }}>
              <Typography variant="h6" fontWeight="bold">
                Upcoming Sessions
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={3}>
                These are your upcoming sessions.
              </Typography>
              <Stack spacing={2} sx={{ maxHeight: 400, overflowY: 'auto', pr: 1 }}>
                {upcomingEvents.length === 0 ? (
                  <Typography variant="body2" color="text.secondary" align="center">
                    No upcoming sessions
                  </Typography>
                ) : (
                  upcomingEvents.map(ev => (
                    <Box key={ev.id} sx={{
                      p: 2,
                      border: 1,
                      borderColor: 'divider',
                      borderRadius: 2,
                      cursor: 'pointer',
                      '&:hover': { bgcolor: 'action.hover' }
                    }} onClick={() => setSelectedSession(ev)}>
                      <Typography variant="subtitle2" fontWeight="bold">
                        {ev.title}
                      </Typography>
                      <Stack direction="row" spacing={2} mt={1}>
                        <Stack direction="row" alignItems="center" spacing={0.5}>
                          <EventIcon fontSize="small" color="action" />
                          <Typography variant="caption">
                            {ev.courseId && ev.originalData?.start_date 
                              ? `${format(parseISO(ev.originalData.start_date), 'dd/MM/yyyy')} - ${format(parseISO(ev.originalData.end_date), 'dd/MM/yyyy')}`
                              : (ev.isoDate ? format(parseISO(ev.isoDate), 'dd/MM/yyyy') : '')
                            }
                          </Typography>
                        </Stack>
                        <Stack direction="row" alignItems="center" spacing={0.5}>
                          <TimeIcon fontSize="small" color="action" />
                          <Typography variant="caption">
                            {ev.time} - {ev.originalData?.end_time || '...'}
                          </Typography>
                        </Stack>
                      </Stack>
                      <Chip 
                        label={ev.originalData?.status || 'Scheduled'} 
                        size="small" 
                        color="primary" 
                        variant="outlined"
                        sx={{ mt: 1, height: 20, fontSize: '0.7rem', textTransform: 'capitalize' }}
                      />
                    </Box>
                  ))
                )}
              </Stack>
            </Paper>
          </Stack>
        )}
          </Box>
        </Box>
      </Container>

      {/* SESSION DETAILS DIALOG */}
      <Dialog open={!!selectedSession} onClose={() => setSelectedSession(null)} maxWidth="xs" fullWidth>
        <DialogTitle>{selectedSession?.title}</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2}>
            {/* Subject */}
            <Box>
                <Typography variant="caption" color="text.secondary">Subject ID</Typography>
                <Typography variant="body1">{selectedSession?.originalData?.subject || 'N/A'}</Typography>
            </Box>

            {/* Max Students */}
            <Box>
                <Typography variant="caption" color="text.secondary">Max Students</Typography>
                <Typography variant="body1">{selectedSession?.originalData?.max_students || 'N/A'}</Typography>
            </Box>

            {/* Schedule (Time) */}
            <Box>
              <Typography variant="caption" color="text.secondary">Time</Typography>
              <Typography variant="body1">
                {selectedSession?.time} - {selectedSession?.originalData?.end_time || '...'}
              </Typography>
            </Box>

             {/* Course Duration */}
            <Box>
                <Typography variant="caption" color="text.secondary">Date Range</Typography>
                <Typography variant="body1">
                  {selectedSession?.originalData?.start_date ? format(parseISO(selectedSession.originalData.start_date), 'dd/MM/yyyy') : ''} - {selectedSession?.originalData?.end_date ? format(parseISO(selectedSession.originalData.end_date), 'dd/MM/yyyy') : ''}
                </Typography>
            </Box>

            {/* Registration Period */}
            <Box>
                <Typography variant="caption" color="text.secondary">Registration Period</Typography>
                <Typography variant="body1">
                  {selectedSession?.originalData?.registration_start ? format(parseISO(selectedSession.originalData.registration_start), 'dd/MM/yyyy') : ''} - {selectedSession?.originalData?.registration_end ? format(parseISO(selectedSession.originalData.registration_end), 'dd/MM/yyyy') : ''}
                </Typography>
            </Box>
            
            {/* Recurrence */}
             <Box>
                <Typography variant="caption" color="text.secondary">Recurrence</Typography>
                <Typography variant="body1">{selectedSession?.originalData?.recurrence_type || 'None'}</Typography>
            </Box>

             {/* Days of Week */}
            {selectedSession?.originalData?.days_of_week && (
                (() => {
                  let daysOfWeek = [];
                  try {
                    daysOfWeek = typeof selectedSession.originalData.days_of_week === 'string'
                      ? JSON.parse(selectedSession.originalData.days_of_week)
                      : selectedSession.originalData.days_of_week;
                  } catch (e) {
                    daysOfWeek = [];
                  }
                  if (!Array.isArray(daysOfWeek)) daysOfWeek = [];
                  return (
                    <Box>
                      <Typography variant="caption" color="text.secondary">Days</Typography>
                      <Stack direction="row" spacing={0.5}>
                        {[
                          { label: 'Mon', value: 1 },
                          { label: 'Tue', value: 2 },
                          { label: 'Wed', value: 3 },
                          { label: 'Thu', value: 4 },
                          { label: 'Fri', value: 5 },
                          { label: 'Sat', value: 6 },
                          { label: 'Sun', value: 0 }
                        ].map((day) => (
                          <Chip
                            key={day.label}
                            label={day.label}
                            size="small"
                            variant={daysOfWeek.includes(day.value) ? "filled" : "outlined"}
                            color={daysOfWeek.includes(day.value) ? "primary" : "default"}
                            sx={{ opacity: daysOfWeek.includes(day.value) ? 1 : 0.5 }}
                          />
                        ))}
                      </Stack>
                    </Box>
                  );
                })()
            )}
            
            {/* Status */}
            <Box>
              <Typography variant="caption" color="text.secondary">Status</Typography>
              <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>
                {selectedSession?.originalData?.status || 'Scheduled'}
              </Typography>
            </Box>

          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedSession(null)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* CREATE CLASS DIALOG */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Class</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              label="Subject Name"
              fullWidth
              value={formData.title}
              onChange={handleChange('title')}
                  InputLabelProps={{ shrink: true }}
            />

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  label="Subject ID"
                  fullWidth
                  value={formData.subject}
                  onChange={handleChange('subject')}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Max Students"
                  fullWidth
                  value={formData.maxStudents}
                  onChange={(e) => {
                    let val = e.target.value.replace(/[^0-9]/g, '')
                    // Remove leading zeros to ensure min is 1 (e.g. 01 -> 1, 0 -> empty)
                    if (val.length > 0) val = val.replace(/^0+/, '')
                    setFormData({ ...formData, maxStudents: val })
                  }}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>

            <Divider textAlign="left"><Typography variant="caption">Schedule</Typography></Divider>

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  label="Start Date"
                  fullWidth
                  value={formatDateForDisplay(formData.startDate)}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={(e) => handleOpenPicker(e, 'class', 'startDate')} edge="end">
                          <EventIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  inputProps={{ readOnly: true, style: { cursor: 'pointer' } }}
                  onClick={(e) => handleOpenPicker(e, 'class', 'startDate')}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="End Date"
                  fullWidth
                  value={formatDateForDisplay(formData.endDate)}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={(e) => handleOpenPicker(e, 'class', 'endDate')} edge="end">
                          <EventIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  inputProps={{ readOnly: true, style: { cursor: 'pointer' } }}
                  onClick={(e) => handleOpenPicker(e, 'class', 'endDate')}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Start Time"
                  type="time"
                  fullWidth
                  value={formData.startTime}
                  onChange={handleChange('startTime')}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="End Time"
                  type="time"
                  fullWidth
                  value={formData.endTime}
                  onChange={handleChange('endTime')}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

            </Grid>

            <Box>
              <Typography variant="caption" color="text.secondary" gutterBottom>Days of Week</Typography>
              <ToggleButtonGroup
                value={formData.daysOfWeek}
                onChange={handleDaysChange}
                aria-label="days of week"
                fullWidth
                size="small"
                sx={{ mb: 2 }}
              >
                {[
                  { label: 'Mon', value: 1 },
                  { label: 'Tue', value: 2 },
                  { label: 'Wed', value: 3 },
                  { label: 'Thu', value: 4 },
                  { label: 'Fri', value: 5 },
                  { label: 'Sat', value: 6 },
                  { label: 'Sun', value: 0 },
                ].map((day) => (
                  <ToggleButton key={day.label} value={day.value}>
                    {day.label}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
            </Box>

            <Divider textAlign="left"><Typography variant="caption">Registration Period</Typography></Divider>

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  label="Open From"
                  fullWidth
                  value={formatDateForDisplay(formData.regStart)}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={(e) => handleOpenPicker(e, 'class', 'regStart')} edge="end">
                          <EventIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  inputProps={{ readOnly: true, style: { cursor: 'pointer' } }}
                  onClick={(e) => handleOpenPicker(e, 'class', 'regStart')}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Close At"
                  fullWidth
                  value={formatDateForDisplay(formData.regEnd)}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={(e) => handleOpenPicker(e, 'class', 'regEnd')} edge="end">
                          <EventIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  inputProps={{ readOnly: true, style: { cursor: 'pointer' } }}
                  onClick={(e) => handleOpenPicker(e, 'class', 'regEnd')}
                />
              </Grid>
            </Grid>

          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)} color="inherit">Cancel</Button>
          <Button onClick={handleCreateClass} variant="contained">Create Class</Button>
        </DialogActions>
      </Dialog>

      {/* DEFINE AVAILABILITY DIALOG */}
      <Dialog open={openAvailabilityModal} onClose={() => setOpenAvailabilityModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Define Availability</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={3} sx={{ my: 1 }}>
            {/* Row 1: Dates */}
            <Stack direction="row" spacing={2}>
              <TextField
                label="Start Date"
                fullWidth
                value={formatDateForDisplay(availabilityForm.date)}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={(e) => handleOpenPicker(e, 'availability', 'date')} edge="end">
                        <EventIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                inputProps={{ readOnly: true, style: { cursor: 'pointer' } }}
                onClick={(e) => handleOpenPicker(e, 'availability', 'date')}
                sx={{ flex: 1 }}
              />
              
              <TextField
                label="End Date"
                fullWidth
                value={formatDateForDisplay(availabilityForm.endDate)}
                placeholder={format(new Date(), 'dd/MM/yyyy')}
                InputLabelProps={{ shrink: true }}
                disabled={availabilityForm.recurrence === 'No Recurrence'}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton 
                        onClick={(e) => handleOpenPicker(e, 'availability', 'endDate')} 
                        edge="end"
                        disabled={availabilityForm.recurrence === 'No Recurrence'}
                      >
                        <EventIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                inputProps={{ readOnly: true, style: { cursor: availabilityForm.recurrence === 'No Recurrence' ? 'default' : 'pointer' } }}
                onClick={(e) => {
                  if (availabilityForm.recurrence !== 'No Recurrence') {
                    handleOpenPicker(e, 'availability', 'endDate')
                  }
                }}
                sx={{ flex: 1 }}
              />
            </Stack>

            {/* Row 2: Times & Recurrence */}
            <Stack direction="row" spacing={2}>
              <TextField 
                label="Start Time" 
                type="time" 
                fullWidth 
                value={availabilityForm.start}
                onChange={handleAvailabilityChange('start')}
                sx={{ flex: 1 }}
              />
              <TextField 
                label="End Time" 
                type="time" 
                fullWidth 
                value={availabilityForm.end}
                onChange={handleAvailabilityChange('end')}
                sx={{ flex: 1 }}
              />
              <FormControl fullWidth sx={{ flex: 1 }}>
                <InputLabel>Recurrence</InputLabel>
                <Select 
                  label="Recurrence" 
                  value={availabilityForm.recurrence}
                  onChange={handleAvailabilityChange('recurrence')}
                >
                  <MenuItem value="No Recurrence">None</MenuItem>
                  <MenuItem value="Weekly">Weekly</MenuItem>
                  <MenuItem value="Bi-weekly">Bi-weekly</MenuItem>
                </Select>
              </FormControl>
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAvailabilityModal(false)} color="inherit">Cancel</Button>
          <Button onClick={handleAddBlock} variant="contained" startIcon={<AddIcon />}>Add Availability</Button>
        </DialogActions>
      </Dialog>

      <Popover
        open={Boolean(pickerAnchor)}
        anchorEl={pickerAnchor}
        onClose={handleClosePicker}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <MiniCalendar 
          value={activePickerContext ? (
            activePickerContext.form === 'availability' 
              ? availabilityForm[activePickerContext.field] 
              : formData[activePickerContext.field]
          ) : ''} 
          onChange={handleDateSelect}
          onClose={handleClosePicker}
        />
      </Popover>

      <Footer />
    </Box>
  )
}

export default Schedule