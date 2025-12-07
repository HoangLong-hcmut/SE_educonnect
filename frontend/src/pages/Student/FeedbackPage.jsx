import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Box,
  Container,
  Typography,
  Paper,
  Rating,
  TextField,
  Button,
  Stack,
  Divider
} from '@mui/material'
import { toast } from 'sonner'
import Header from '../../components/Header/StudentHeader'

// Mock data matching Dashboard.jsx
const MOCK_SESSIONS = [
  { id: 1, title: 'Data Structures and Algorithms', date: '01/12/2023', tutor: 'Nguyen Hua Phung' },
  { id: 2, title: 'Software Engineering', date: '15/12/2025', tutor: 'Tran Truong Tuan Phat' }
]

export default function FeedbackPage() {
  const { sessionId } = useParams()
  const navigate = useNavigate()
  
  const [session, setSession] = useState(null)
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Simulate fetching session details
    const foundSession = MOCK_SESSIONS.find(s => s.id === parseInt(sessionId))
    if (foundSession) {
      setSession(foundSession)
    } else {
      // Fallback if not found in mock data
      setSession({
        id: sessionId,
        title: 'Unknown Session',
        date: 'N/A',
        tutor: 'Unknown Tutor'
      })
    }
  }, [sessionId])

  const handleSubmit = async () => {
    if (!comment.trim()) {
      toast.error('Please enter your feedback')
      return
    }

    try {
      setLoading(true)
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast.success('Cảm ơn bạn đã đánh giá!')
      navigate('/dashboard') // Go back to dashboard
    } catch (error) {
      console.error('Submit feedback failed:', error)
      toast.error('Error submitting feedback. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!session) return <Box p={4}>Loading...</Box>

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
      <Header />
      <Box component="main" sx={{ flexGrow: 1, py: 8 }}>
        <Container maxWidth="md" sx={{ mt: 8 }}>
          <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" color="primary">
              Session Feedback
            </Typography>
            
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6">{session.title}</Typography>
              <Typography variant="body2" color="text.secondary">
                Tutor: {session.tutor} | Date: {session.date}
              </Typography>
            </Box>

            <Divider sx={{ mb: 4 }} />

            <Stack spacing={4}>
              <Box>
                <Typography component="legend" gutterBottom>
                  How was your session?
                </Typography>
                <Rating
                  name="session-rating"
                  value={rating}
                  onChange={(event, newValue) => setRating(newValue)}
                  size="large"
                />
              </Box>

              <TextField
                label="Detailed Feedback"
                multiline
                rows={6}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Was the tutor easy to understand? How was the lesson content?..."
                fullWidth
                variant="outlined"
              />

              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button 
                  variant="outlined" 
                  onClick={() => navigate('/dashboard')}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button 
                  variant="contained" 
                  onClick={handleSubmit}
                  disabled={loading}
                  size="large"
                >
                  {loading ? 'Sending...' : 'Submit Feedback'}
                </Button>
              </Box>
            </Stack>
          </Paper>
        </Container>
      </Box>
    </Box>
  )
}
