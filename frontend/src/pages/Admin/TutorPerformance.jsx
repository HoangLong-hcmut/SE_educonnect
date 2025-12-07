import { useState, useMemo, useEffect } from "react"
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Stack,
  TextField,
  Button,
  Avatar,
  Chip,
  Rating,
  InputAdornment,
  Divider,
  MenuItem,
  keyframes,
  Toolbar,
  useTheme,
  alpha
} from "@mui/material"

import {
  Search as SearchIcon,
  Save as SaveIcon,
  FilterList as FilterIcon,
  EmailOutlined as EmailIcon,
  VisibilityOffOutlined as HideIcon,
  CheckCircleOutline as CheckIcon,
  WarningAmber as WarningIcon,
  Star as StarIcon,
  Comment,
} from "@mui/icons-material"

import AdminHeader from "../../components/Header/AdminHeader"
import AdminFooter from "../../components/Footer/AdminFooter"
import { motion } from "framer-motion"
import { useAdminStore } from "../../stores/useAdminStore"
import { format, parseISO } from 'date-fns'

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

const slideUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`

const pulse = keyframes`
  0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); }
  70% { transform: scale(1.05); box-shadow: 0 0 0 6px rgba(239, 68, 68, 0); }
    100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
`




// --- COMPONENTS ---

const KPICard = ({ title, value, icon: Icon, color, delay }) => {
  const theme = useTheme();
  return (
  <Paper
    sx={{
      p: 3,
      borderRadius: "16px",
      bgcolor: "background.paper",
      border: `1px solid ${theme.palette.divider}`,
      boxShadow: theme.shadows[1],
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      position: "relative",
      overflow: "hidden",
      transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
      animation: `${slideUp} 0.6s ease-out both`,
      animationDelay: `${delay}ms`,
      "&:hover": {
        transform: "translateY(-6px)",
        boxShadow: `0px 12px 24px -4px ${alpha(color, 0.2)}`,
        borderColor: color,
      },
      "&::before": {
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        width: "4px",
        height: "100%",
        bgcolor: color,
        opacity: 0,
        transition: "opacity 0.3s",
      },
      "&:hover::before": {
        opacity: 1,
      },
    }}
  >
    <Box>
      <Typography variant="body2" sx={{ color: "text.secondary", fontWeight: 600, mb: 0.5 }}>
        {title}
      </Typography>
      <Typography variant="h4" sx={{ fontWeight: 800, color: "text.primary" }}>
        {value}
      </Typography>
    </Box>
    <Box
      sx={{
        width: 56,
        height: 56,
        borderRadius: "16px",
        bgcolor: alpha(color, 0.1),
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: color,
        transition: "transform 0.4s",
        ".MuiPaper-root:hover &": {
            transform: "rotate(10deg) scale(1.1)",
        }
      }}
    >
      <Icon sx={{ fontSize: 28 }} />
    </Box>
  </Paper>
  )
}

export default function TutorPerformance() {
  const theme = useTheme();
  const { reviews, fetchReviews } = useAdminStore()

  useEffect(() => {
    fetchReviews()
  }, [fetchReviews])

  const [selectedReviewId, setSelectedReviewId] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterRating, setFilterRating] = useState("all")
  const [adminNote, setAdminNote] = useState("")

  const filteredReviews = useMemo(() => {
    return reviews.filter((review) => {
      const matchesSearch =
        review.tutorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.subject.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesStatus = filterStatus === "all" || review.status === filterStatus
      const matchesRating = filterRating === "all" || Math.floor(review.rating) === parseInt(filterRating)

      return matchesSearch && matchesStatus && matchesRating
    })
  }, [searchTerm, filterStatus, filterRating, reviews])

  const selectedReview = reviews.find((r) => r.id === selectedReviewId) || null

  const handleReviewClick = (review) => {
    setSelectedReviewId(review.id)
    setAdminNote(review.adminNotes)
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default", display: "flex", flexDirection: "column" }}>
      <AdminHeader />
      <Toolbar />

      <Container
        component={motion.main} // Biến Box thành motion component
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        maxWidth={false}
        sx={{ maxWidth: '1350px', py: 4, flexGrow: 1 }}
      >
        {/* 1. TITLE & FILTER ROW (Đã bỏ Search ở đây, chỉ giữ Filter) */}
        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems="center"
          mb={3}
          spacing={2}
          sx={{ animation: `${slideUp} 0.6s ease-out both`, animationDelay: '300ms' }}
        >
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary' }}>
              Performance Reviews
            </Typography>
          </Box>

          <Box>
            <TextField
              select
              value={filterRating}
              onChange={(e) => setFilterRating(e.target.value)}
              size="small"
              sx={{ 
                minWidth: 160, 
                bgcolor: "background.paper",
                "& .MuiOutlinedInput-root": { borderRadius: "10px" } 
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FilterIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            >
              <MenuItem value="all">All Ratings</MenuItem>
              <MenuItem value="5">5 Stars</MenuItem>
              <MenuItem value="4">4 Stars</MenuItem>
              <MenuItem value="3">3 Stars</MenuItem>
              <MenuItem value="2">2 Stars</MenuItem>
              <MenuItem value="1">1 Star</MenuItem>
            </TextField>
          </Box>
        </Stack>

        {/* 2. KPI SECTION */}
        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} sm={4}>
            <KPICard 
              title="Avg. Tutor Rating" 
              value={reviews.length > 0 ? (reviews.reduce((acc, r) => acc + Number(r.rating), 0) / reviews.length).toFixed(1) : "0.0"} 
              icon={StarIcon} 
              color={theme.palette.warning.main} 
              delay={0} 
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <KPICard 
              title="Total Reviews" 
              value={reviews.length} 
              icon={Comment} 
              color={theme.palette.primary.main} 
              delay={100} 
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <KPICard 
              title="Flagged / Low Rating" 
              value={reviews.filter(r => r.status === 'flagged' || r.rating <= 2).length} 
              icon={WarningIcon} 
              color={theme.palette.error.main} 
              delay={200} 
            />
          </Grid>
        </Grid>

        {/* 3. MAIN CONTENT */}
        <Stack direction={{ xs: "column", lg: "row" }} spacing={3} sx={{ animation: `${slideUp} 0.6s ease-out both`, animationDelay: '400ms' }}>
          
          {/* LEFT: REVIEW LIST (with Search on Top) */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            
            {/* SEARCH BAR - Nằm ngay trên danh sách */}
            <Box sx={{ mb: 2 }}>
                <TextField
                  fullWidth
                  placeholder="Search tutor, session name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  size="medium"
                  sx={{ 
                    bgcolor: "background.paper",
                    "& .MuiOutlinedInput-root": { 
                        borderRadius: "12px",
                        boxShadow: theme.shadows[1],
                        "&.Mui-focused": { boxShadow: `0px 4px 12px ${alpha(theme.palette.primary.main, 0.15)}` }
                    } 
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: "text.secondary" }} />
                      </InputAdornment>
                    ),
                  }}
                />
            </Box>

            {/* LIST ITEMS - Max height ~ 5 items */}
            <Stack 
                spacing={2} 
                sx={{ 
                    // 680px tương đương khoảng 5 thẻ review (mỗi thẻ ~130-140px). 
                    // Nếu quá 5 thẻ sẽ hiện thanh scroll.
                    maxHeight: "680px", 
                    overflowY: "auto", 
                    pr: 1,
                    pb: 1, // Padding bottom để shadow thẻ cuối không bị cắt
                    "&::-webkit-scrollbar": { width: "6px" },
                    "&::-webkit-scrollbar-track": { bgcolor: "transparent" },
                    "&::-webkit-scrollbar-thumb": { bgcolor: theme.palette.divider, borderRadius: "10px" },
                    "&::-webkit-scrollbar-thumb:hover": { bgcolor: theme.palette.action.hover }
                }}
            >
              {filteredReviews.map((review) => (
                <Paper
                  key={review.id}
                  onClick={() => handleReviewClick(review)}
                  elevation={0}
                  sx={{
                    p: 2,
                    borderRadius: "16px",
                    border: "1px solid",
                    borderColor: selectedReviewId === review.id ? "primary.main" : "transparent",
                    bgcolor: selectedReviewId === review.id ? "background.paper" : "background.paper",
                    boxShadow: selectedReviewId === review.id 
                        ? `0px 4px 12px ${alpha(theme.palette.primary.main, 0.15)}`
                        : theme.shadows[1],
                    cursor: "pointer",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    "&:hover": { 
                        transform: "translateX(4px)",
                        boxShadow: theme.shadows[2]
                    },
                    position: "relative",
                  }}
                >
                  {review.status === 'flagged' && (
                     <Chip 
                        label="Flagged" 
                        size="small" 
                        color="error"
                        icon={<WarningIcon style={{ fontSize: 14 }} />} 
                        sx={{ 
                            position: 'absolute', 
                            top: 12, 
                            right: 12, 
                            height: 22, 
                            fontSize: 10, 
                            fontWeight: 700,
                            animation: `${pulse} 2s infinite`
                        }} 
                     />
                  )}

                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar 
                        src={review.avatarUrl} 
                        sx={{ 
                            width: 52, 
                            height: 52,
                            border: selectedReviewId === review.id ? `2px solid ${theme.palette.primary.main}` : "2px solid transparent",
                            transition: "border-color 0.3s"
                        }} 
                    />
                    <Box sx={{ flex: 1, overflow: 'hidden' }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "text.primary", fontSize: "15px" }} noWrap>
                        {review.tutorName}
                      </Typography>
                      <Typography variant="caption" sx={{ color: "text.secondary", display: 'block', mb: 0.5 }} noWrap>
                        {review.sessionName}
                      </Typography>
                      <Rating value={review.rating} readOnly size="small" sx={{ fontSize: "16px" }} />
                    </Box>
                  </Stack>
                  <Typography
                    variant="body2"
                    sx={{
                      mt: 1.5,
                      color: "text.secondary",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      fontSize: "13px",
                      lineHeight: 1.6
                    }}
                  >
                    "{review.feedback}"
                  </Typography>
                </Paper>
              ))}
              {filteredReviews.length === 0 && (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                    <Typography sx={{ color: "text.secondary" }}>No reviews found.</Typography>
                </Box>
              )}
            </Stack>
          </Box>

          {/* RIGHT: DETAIL & ACTIONS */}
          <Box sx={{ width: { xs: "100%", lg: "55%" }, flexShrink: 0 }}>
            {selectedReview ? (
              <Paper
                sx={{
                  p: 0,
                  borderRadius: "24px",
                  border: `1px solid ${theme.palette.divider}`,
                  bgcolor: "background.paper",
                  overflow: "hidden",
                  position: "sticky",
                  top: "110px",
                  boxShadow: theme.shadows[3],
                  animation: `${slideUp} 0.5s ease-out`
                }}
              >
                {/* Header with Glassmorphism */}
                <Box 
                    sx={{ 
                        p: 3, 
                        borderBottom: `5px solid ${theme.palette.divider}`, 
                        backdropFilter: "blur(12px)",
                        position: 'relative'
                    }}
                >
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                    <Stack direction="row" spacing={2.5}>
                      <Avatar 
                        src={selectedReview.avatarUrl} 
                        sx={{ 
                            width: 72, 
                            height: 72, 
                            border: "4px solid",
                            borderColor: "background.paper", 
                            boxShadow: theme.shadows[2] 
                        }} 
                      />
                      <Box>
                        <Typography variant="h5" sx={{ fontWeight: 800, color: "text.primary", letterSpacing: '-0.5px' }}>
                          {selectedReview.tutorName}
                        </Typography>
                        <Stack direction="row" spacing={1} alignItems="center" mt={0.5}>
                          <Chip 
                            label={selectedReview.subject} 
                            size="small" 
                            sx={{ 
                                bgcolor: alpha(theme.palette.primary.main, 0.1), 
                                color: "primary.main", 
                                fontWeight: 600, 
                                borderRadius: '8px',
                                border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`
                            }} 
                          />
                          <Typography variant="caption" sx={{ color: "text.secondary" }}>
                             ID: #{selectedReview.id}
                          </Typography>
                        </Stack>
                      </Box>
                    </Stack>

                    <Stack alignItems="flex-end">
                       <Typography variant="h3" sx={{ fontWeight: 800, color: selectedReview.rating < 3 ? "error.main" : "warning.main", letterSpacing: '-1px' }}>
                          {Number(selectedReview.rating).toFixed(1)}
                       </Typography>
                       <Rating value={selectedReview.rating} readOnly size="medium" />
                    </Stack>
                  </Stack>
                </Box>

                <Box sx={{ p: 4 }}>
                   {/* Immutable Session Info */}
                   <Grid container spacing={3} sx={{ mb: 4 }}>
                      <Grid item xs={12} md={4}>
                         <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase' }}>Session</Typography>
                         <Typography variant="body1" sx={{ fontWeight: 600, color: "text.primary", mt: 0.5 }}>{selectedReview.sessionName}</Typography>
                      </Grid>
                      <Grid item xs={6} md={4}>
                         <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase' }}>Student</Typography>
                         <Typography variant="body1" sx={{ fontWeight: 600, color: "text.primary", mt: 0.5 }}>{selectedReview.studentName}</Typography>
                      </Grid>
                      <Grid item xs={6} md={4}>
                         <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase' }}>Date</Typography>
                         <Typography variant="body1" sx={{ fontWeight: 600, color: "text.primary", mt: 0.5 }}>
                            {selectedReview.date ? format(new Date(selectedReview.date), 'dd/MM/yyyy') : 'N/A'}
                         </Typography>
                      </Grid>
                   </Grid>

                   <Divider sx={{ mb: 3, borderStyle: 'dashed' }} />

                   {/* The Feedback */}
                   <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: "text.primary", display: 'flex', alignItems: 'center'}}>
                        Student Feedback
                   </Typography>
                   <Paper elevation={0} sx={{ p: 3, bgcolor: "action.hover", borderRadius: "16px", border: `1px solid ${theme.palette.divider}`, mb: 4 }}>
                      <Typography sx={{ fontStyle: 'italic', color: "text.secondary", fontSize: '16px', lineHeight: 1.7 }}>
                        "{selectedReview.feedback}"
                      </Typography>
                   </Paper>

                   {/* Admin Internal Notes */}
                   <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: "text.primary", display: 'flex', alignItems: 'center'}}>
                      Internal Admin Notes
                   </Typography>
                   <TextField
                      fullWidth
                      multiline
                      rows={3}
                      placeholder="Add private notes about this case..."
                      value={adminNote}
                      onChange={(e) => setAdminNote(e.target.value)}
                      sx={{ 
                        mb: 4,
                        "& .MuiOutlinedInput-root": {
                            borderRadius: "12px",
                            bgcolor: "background.paper",
                            color: "text.primary", // Màu chữ đen
                            transition: "box-shadow 0.2s",
                            "&.Mui-focused": {
                                boxShadow: `0 0 0 4px ${alpha(theme.palette.primary.main, 0.1)}`
                            }
                        },
                        "& .MuiInputBase-input": {
                            color: "text.primary",
                        }
                       }}
                   />

                   {/* Moderation Actions */}
                   <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: "text.primary", display: 'flex', alignItems: 'center'}}>
                      Moderation Actions
                   </Typography>
                   <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                      <Button 
                        variant="contained" 
                        startIcon={<SaveIcon />} 
                        sx={{ 
                            bgcolor: "primary.main", 
                            textTransform: 'none', 
                            borderRadius: '10px',
                            fontWeight: 600,
                            boxShadow: `0 4px 6px -1px ${alpha(theme.palette.primary.main, 0.5)}`,
                            "&:hover": { bgcolor: "primary.dark", transform: 'translateY(-1px)' }
                        }}
                      >
                         Save Note
                      </Button>
                      
                      <Button variant="outlined" color="warning" startIcon={<EmailIcon />} sx={{ textTransform: 'none', borderRadius: '10px', fontWeight: 600 }}>
                         Contact Tutor
                      </Button>
                      
                      <Button variant="outlined" color="error" startIcon={<HideIcon />} sx={{ textTransform: 'none', borderRadius: '10px', fontWeight: 600 }}>
                         Hide Review
                      </Button>

                      <Box sx={{ flex: 1 }} />
                      
                      <Button variant="text" color="success" startIcon={<CheckIcon />} sx={{ textTransform: 'none', fontWeight: 700 }}>
                         Mark Resolved
                      </Button>
                   </Stack>
                </Box>
              </Paper>
            ) : (
              // Empty State
              <Paper 
                sx={{ 
                    p: 8, 
                    textAlign: 'center', 
                    borderRadius: "24px", 
                    border: `2px dashed ${theme.palette.divider}`, 
                    bgcolor: "transparent",
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 2
                }}
              >
                 <Box sx={{ width: 80, height: 80, bgcolor: "action.hover", borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <SearchIcon sx={{ fontSize: 40, color: "text.disabled" }} />
                 </Box>
                 <Typography variant="h6" sx={{ color: "text.primary", fontWeight: 600 }}>No Review Selected</Typography>
                 <Typography sx={{ color: "text.secondary" }}>Select a review from the list to view details and take actions.</Typography>
              </Paper>
            )}
          </Box>
        </Stack>
      </Container>

      <AdminFooter />
    </Box>
  )
}