import { useState, useEffect } from 'react'
import {
  format, startOfMonth, endOfMonth, startOfWeek, endOfWeek,
  addDays, addMonths, subMonths, isSameMonth, isSameDay, parseISO, getDay
} from 'date-fns'
// --- MUI Core Components ---
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Stack from '@mui/material/Stack'
import Chip from '@mui/material/Chip'
import Toolbar from '@mui/material/Toolbar'
import { useTheme, alpha } from '@mui/material/styles'

// --- MUI Icons ---
import ChevronLeft from '@mui/icons-material/ChevronLeft'
import ChevronRight from '@mui/icons-material/ChevronRight'
import EventIcon from '@mui/icons-material/Event'
import TimeIcon from '@mui/icons-material/AccessTime'
import Rating from '@mui/material/Rating'

import Header from '../../components/Header/StudentHeader'
import Footer from '../../components/Footer/Footer'
import { useStudentStore } from '../../stores/useStudentStore'

function MySession() {
  const theme = useTheme();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedSession, setSelectedSession] = useState(null);
  const [ratings, setRatings] = useState({}); // { [sessionId]: rating }
  const { sessions: tutoringSessions, fetchSessions } = useStudentStore();
  useEffect(() => { fetchSessions(); }, [fetchSessions]);
  const sessions = tutoringSessions.map(s => ({
    id: `s-${s.session_id}`,
    title: s.title || s.subject || 'Session',
    isoDate: s.start_date ? format(new Date(s.start_date), 'yyyy-MM-dd') : '',
    endIsoDate: s.end_date ? format(new Date(s.end_date), 'yyyy-MM-dd') : '',
    time: s.start_time ? s.start_time.slice(0, 5) : '00:00',
    endTime: s.end_time ? s.end_time.slice(0, 5) : '',
    status: s.status,
    subject: s.subject,
    recurrence: s.recurrence_type,
    daysOfWeek: typeof s.days_of_week === 'string' ? JSON.parse(s.days_of_week || '[]') : (Array.isArray(s.days_of_week) ? s.days_of_week : []),
    tutor_firstname: s.tutor_firstname,
    tutor_lastname: s.tutor_lastname,
    originalData: s
  }));

  // --- Calendar Logic with date-fns ---
  const headerFormat = 'MMMM yyyy'
  const startDate = startOfWeek(startOfMonth(currentDate), { weekStartsOn: 1 })
  const endDate = endOfWeek(endOfMonth(currentDate), { weekStartsOn: 1 })

  // Generate calendar days for the current month view
  const calendarDays = (() => {
    const days = [];
    let day = startDate;
    while (day <= endDate) {
      days.push(day);
      day = addDays(day, 1);
    }
    return days;
  })();

  // --- Handlers ---
  const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const handleToday = () => setCurrentDate(new Date());

  // Filter upcoming events
  const upcomingEvents = sessions
    .sort((a, b) => parseISO(a.isoDate + 'T' + a.time) - parseISO(b.isoDate + 'T' + b.time));

  // Calendar rendering logic
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
          const dateKey = format(day, 'yyyy-MM-dd');
          const dayOfWeek = getDay(day); // 0 (Sunday) to 6 (Saturday)
          // Filter sessions for this day based on isoDate and daysOfWeek
          const dayEvents = sessions.filter(s => {
            // Match by exact date
            if (s.isoDate === dateKey) return true;
            // Recurring: match by dayOfWeek, but only if calendar day is within start/end range
            if (s.daysOfWeek && Array.isArray(s.daysOfWeek) && s.daysOfWeek.length > 0 && s.originalData?.start_date && s.originalData?.end_date) {
              const start = parseISO(s.originalData.start_date);
              const end = parseISO(s.originalData.end_date);
              if (day >= start && day <= end && s.daysOfWeek.includes(dayOfWeek)) {
                return true;
              }
            }
            return false;
          });
          const isCurrentMonth = isSameMonth(day, currentDate);
          const isToday = isSameDay(day, new Date());

          return (
            <Box key={index} sx={{
              height: 100,
              overflow: 'hidden',
              borderRight: 1,
              borderBottom: 1,
              borderColor: 'divider',
              bgcolor: isCurrentMonth ? 'background.paper' : 'background.default',
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
                    color='primary'
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
          );
        })}
      </Box>
    </Paper>
  );

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
            <Stack spacing={3}>
              {/* Upcoming Sessions */}
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
                        position: 'relative',
                        '&:hover': { bgcolor: 'action.hover' }
                      }} onClick={() => setSelectedSession(ev)}>
                        {/* Rating at top right */}
                        <Box sx={{ position: 'absolute', top: 15, right: 10, zIndex: 2 }} onClick={e => e.stopPropagation()}>
                          <Rating
                            name={`session-rating-${ev.id}`}
                            value={ratings[ev.id] || 0}
                            size="small"
                            onChange={(event, newValue) => {
                              if (ratings[ev.id] === undefined && newValue !== null) {
                                setRatings(prev => ({ ...prev, [ev.id]: newValue }))
                              }
                            }}
                            disabled={ratings[ev.id] !== undefined && ratings[ev.id] !== 0}
                          />
                        </Box>
                        <Typography variant="subtitle2" fontWeight="bold">
                          {ev.title}
                        </Typography>
                        <Stack direction="row" spacing={2} mt={1}>
                          <Stack direction="row" alignItems="center" spacing={0.5}>
                            <EventIcon fontSize="small" color="action" />
                            <Typography variant="caption">
                              {ev.isoDate && ev.endIsoDate
                                ? `${format(parseISO(ev.isoDate), 'dd/MM/yyyy')} - ${format(parseISO(ev.endIsoDate), 'dd/MM/yyyy')}`
                                : (ev.isoDate ? format(parseISO(ev.isoDate), 'dd/MM/yyyy') : '')
                              }
                            </Typography>
                          </Stack>
                          <Stack direction="row" alignItems="center" spacing={0.5}>
                            <TimeIcon fontSize="small" color="action" />
                            <Typography variant="caption">
                              {ev.time} - {ev.endTime || '...'}
                            </Typography>
                          </Stack>
                        </Stack>
                        <Chip 
                          label={ev.status || 'Scheduled'} 
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
                <Typography variant="caption" color="text.secondary">Subject</Typography>
                <Typography variant="body1">{selectedSession?.originalData?.subject || 'N/A'}</Typography>
            </Box>
             
             {/* Tutor Info */}
             {selectedSession?.originalData?.tutor_firstname && (
              <Box>
                <Typography variant="caption" color="text.secondary">Tutor</Typography>
                <Typography variant="body1">
                  {selectedSession.originalData.tutor_firstname} {selectedSession.originalData.tutor_lastname}
                </Typography>
              </Box>
            )}

            {/* Schedule (Time) */}
            <Box>
              <Typography variant="caption" color="text.secondary">Time</Typography>
              <Typography variant="body1">
                {selectedSession?.originalData?.start_time ? selectedSession.originalData.start_time.slice(0, 5) : selectedSession?.time} - {selectedSession?.originalData?.end_time ? selectedSession.originalData.end_time.slice(0, 5) : (selectedSession?.endTime || '...')}
              </Typography>
            </Box>

             {/* Course Duration */}
            <Box>
                <Typography variant="caption" color="text.secondary">Date Range</Typography>
                <Typography variant="body1">
                  {selectedSession?.originalData?.start_date ? format(parseISO(selectedSession.originalData.start_date), 'dd/MM/yyyy') : ''} - {selectedSession?.originalData?.end_date ? format(parseISO(selectedSession.originalData.end_date), 'dd/MM/yyyy') : ''}
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

      <Footer />
    </Box>
  )
}

export default MySession