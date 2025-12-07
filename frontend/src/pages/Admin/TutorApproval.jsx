import React, { useState, useEffect } from "react"
import {
  Box,
  Typography,
  Container,
  Card,
  Avatar,
  Stack,
  Chip,
  Button,
  IconButton,
  TextField,
  InputAdornment,
  Snackbar,
  Alert,
  Tabs,
  Tab,
  Tooltip,
  Toolbar,
  useTheme,
  alpha
} from "@mui/material"
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
  AccessTime as TimeIcon,
  RestorePage as RestoreIcon
} from "@mui/icons-material"
import { motion, AnimatePresence } from "framer-motion" // Import Framer Motion

// --- COMPONENTS GIẢ LẬP ---
import AdminHeader from '../../components/Header/AdminHeader'
import AdminFooter from '../../components/Footer/AdminFooter'
import { useAdminStore } from "../../stores/useAdminStore"

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

const cardVariants = {
  hidden: { y: 20, opacity: 0, scale: 0.95 },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    transition: { duration: 0.2 }
  }
}

// --- MAIN CODE ---

const TutorApproval = () => {
  const theme = useTheme()
  const { tutorApprovals, fetchTutorApprovals, updateTutorApprovalStatus } = useAdminStore()
  
  useEffect(() => {
    fetchTutorApprovals()
  }, [fetchTutorApprovals])

  const [searchTerm, setSearchTerm] = useState("")
  const [currentTab, setCurrentTab] = useState("Pending")
  const [notification, setNotification] = useState({ open: false, message: "", severity: "success" })

  const handleStatusChange = async (id, newStatus) => {
    const target = tutorApprovals.find((r) => r.id === id)
    if (target.status === newStatus) return; 

    await updateTutorApprovalStatus(id, newStatus)

    let mess = ""
    let sever = "success"
    if (newStatus === "Approved") mess = `Đã DUYỆT: ${target?.name}`
    else if (newStatus === "Rejected") { mess = `Đã TỪ CHỐI: ${target?.name}`; sever = "error" }
    else { mess = `Đã chuyển về PENDING: ${target?.name}`; sever = "info" }

    setNotification({ open: true, message: mess, severity: sever })
  }

  const filteredRequests = tutorApprovals.filter((req) => {
    const matchStatus = req.status === currentTab
    const matchSearch = req.name.toLowerCase().includes(searchTerm.toLowerCase())
    return matchStatus && matchSearch
  })

  const getStatusColor = (status) => {
    switch (status) {
      case "Approved": return { bg: theme.palette.success.main, text: theme.palette.success.contrastText }
      case "Rejected": return { bg: theme.palette.error.main, text: theme.palette.error.contrastText }
      default: return { bg: theme.palette.warning.main, text: theme.palette.warning.contrastText }
    }
  }

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column", bgcolor: "background.default" }}>
      <AdminHeader />
      <Toolbar />

      <Container maxWidth={false} sx={{ maxWidth: '1350px', py: 4, flexGrow: 1 }}>
        <Stack 
          component={motion.div}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          direction={{ xs: "column", md: "row" }} 
          justifyContent="space-between" 
          alignItems="center" 
          mb={2.5} 
          spacing={2}
        >
          <Box>
            <Typography variant="h4" fontWeight="700" color="text.primary">Profile Approval</Typography>
          </Box>
          <TextField
            placeholder="Search tutor name..."
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ width: { xs: "100%", md: "400px" }, bgcolor: "background.paper",  borderRadius: "4px" }}
            InputProps={{
              startAdornment: (<InputAdornment position="start"><SearchIcon sx={{ color: "text.secondary" }} /></InputAdornment>),
              endAdornment: (<InputAdornment position="end"><IconButton size="small"><FilterIcon fontSize="small" /></IconButton></InputAdornment>),
            }}
          />
        </Stack>

        <Box 
          component={motion.div}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}
        >
          <Tabs 
            value={currentTab} 
            onChange={(e, val) => setCurrentTab(val)} 
            sx={{
                "& .MuiTab-root": {
                    textTransform: "none",
                    fontWeight: 600,
                    fontSize: "16px",
                    color: "text.secondary", 
                    "&.Mui-selected": { color: "primary.main" }
                },
                "& .MuiTabs-indicator": { backgroundColor: "primary.main" }
            }}
          >
            <Tab label="Pending" value="Pending" />
            <Tab label="Approved" value="Approved" />
            <Tab label="Rejected" value="Rejected" />
          </Tabs>
        </Box>

        {/* --- MAIN GRID AREA --- */}
        <Box 
          component={motion.div}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          key={currentTab} // Key thay đổi sẽ trigger lại animation khi đổi Tab
          sx={{ display: "flex", flexWrap: "wrap", gap: 3, alignItems: "stretch" }}
        >
          <AnimatePresence mode="popLayout">
            {filteredRequests.map((req) => {
              const statusColors = getStatusColor(req.status)
              return (
                <Box 
                  key={req.id} 
                  component={motion.div}
                  layout // Tự động animate vị trí khi danh sách thay đổi (filter)
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  sx={{ 
                    width: { xs: "100%", md: "340px" }, // Giữ nguyên logic width của bạn
                    display: 'flex', 
                    flexDirection: 'column' 
                  }}
                > 
                  <Card
                    elevation={0}
                    sx={{
                      width: "100%",           
                      flex: 1, 
                      height: "100%",
                      minHeight: "450px", 
                      
                      bgcolor: "background.paper",
                      borderRadius: "12px",
                      border: `1px solid ${theme.palette.divider}`,
                      
                      display: "flex",
                      flexDirection: "column",
                      
                      p: 3,
                      transition: "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)", // CSS transition mượt hơn
                      "&:hover": { 
                        borderColor: "primary.main", 
                        boxShadow: theme.shadows[4], // Bóng đổ sâu hơn khi hover
                        transform: "translateY(-4px)" // Nhấc thẻ lên nhẹ
                      },
                    }}
                  >
                    <Stack direction="row" spacing={2} alignItems="flex-start" mb={2}>
                      <Avatar src={req.avatar} sx={{ width: 56, height: 56, border: "2px solid white", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }} />
                      <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Typography 
                          variant="h6" 
                          fontWeight="700" 
                          color="text.primary" 
                          sx={{ 
                            lineHeight: 1.2, 
                            wordBreak: "break-word",
                            overflowWrap: "anywhere" 
                          }}
                        >
                          {req.name}
                        </Typography>
                        <Typography 
                          variant="body2" 
                          color="text.secondary" 
                          sx={{ 
                            mb: 0.5, 
                            wordBreak: "break-word",
                            overflowWrap: "anywhere"
                          }}
                        >
                          {req.role}
                        </Typography>
                        <Chip label={req.status} size="small" sx={{ bgcolor: statusColors.bg, color: statusColors.text, fontWeight: 600, height: "22px", fontSize: "0.7rem" }} />
                      </Box>
                    </Stack>

                    <Box 
                      sx={{ 
                          flexGrow: 1, 
                          overflowY: "auto", 
                          overflowX: "hidden", 
                          pr: 1, 
                          mb: 2, 
                          borderTop: `1px dashed ${theme.palette.divider}`, 
                          borderBottom: `1px dashed ${theme.palette.divider}`,
                          py: 2,
                          maxHeight: "300px", 
                          "&::-webkit-scrollbar": { width: "6px" }, 
                          "&::-webkit-scrollbar-thumb": { bgcolor: theme.palette.grey[300], borderRadius: "10px" } 
                      }}
                    >
                      <Typography variant="subtitle2" fontWeight="700" color="text.primary" gutterBottom>Changes Requested:</Typography>
                      <ul style={{ margin: 0, paddingLeft: "20px", color: "text.main" }}>
                        {req.changes.map((change, idx) => (
                          <li key={idx} style={{ 
                            marginBottom: "8px", 
                            fontSize: "14px", 
                            lineHeight: "1.5",
                            wordBreak: "break-word",
                            overflowWrap: "anywhere",
                            whiteSpace: "normal"
                          }}>
                            {change}
                          </li>
                        ))}
                      </ul>
                      <Stack direction="row" spacing={0.5} alignItems="center" mt={2}>
                        <TimeIcon sx={{ fontSize: 14, color: "text.secondary" }} />
                        <Typography variant="caption" color="text.secondary" fontStyle="italic">Submitted: {req.submittedAt}</Typography>
                      </Stack>
                    </Box>

                    <Stack spacing={1} mt="auto">
                      <Stack direction="row" spacing={2}>
                        <Button 
                          variant="contained"
                          fullWidth 
                          startIcon={<CheckIcon />} 
                          onClick={() => handleStatusChange(req.id, "Approved")}
                          disabled={req.status === "Approved"} 
                          sx={{ 
                              bgcolor: "success.main", 
                              color: "success.contrastText",
                              opacity: req.status === "Approved" ? 0.5 : 1, 
                              "&:hover": { bgcolor: "success.dark" }
                          }}
                        >
                          Approve
                        </Button>
                        
                        <Button 
                          variant="contained"
                          fullWidth 
                          startIcon={<CancelIcon />} 
                          onClick={() => handleStatusChange(req.id, "Rejected")}
                          disabled={req.status === "Rejected"}
                          sx={{ 
                              bgcolor: "error.main", 
                              color: "error.contrastText",
                              opacity: req.status === "Rejected" ? 0.5 : 1, 
                              "&:hover": { bgcolor: "error.dark" }
                          }}
                        >
                          Reject
                        </Button>
                      </Stack>

                      <Tooltip title="Reset về trạng thái chờ">
                          <Button
                            variant="contained"
                            fullWidth
                            startIcon={<RestoreIcon />}
                            onClick={() => handleStatusChange(req.id, "Pending")}
                            disabled={req.status === "Pending"} 
                            sx={{
                              bgcolor: "text.secondary",
                              color: "text.main",
                              opacity: req.status === "Pending" ? 0.4 : 1,
                              textTransform: "none",
                              fontWeight: 600,
                              boxShadow: "none",
                              "&:hover": { bgcolor: "text.primary" },
                            }}
                          >
                            Fallback to Pending
                          </Button>
                      </Tooltip>
                    </Stack>
                  </Card>
                </Box>
              )
            })}
          </AnimatePresence>
        </Box>
        
        {filteredRequests.length === 0 && (
          <Box 
            component={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            textAlign="center" 
            py={10}
          >
            <Typography variant="h6" color="text.secondary">Không tìm thấy hồ sơ nào.</Typography>
          </Box>
        )}
      </Container>
      <AdminFooter />
      <Snackbar open={notification.open} autoHideDuration={3000} onClose={() => setNotification({ ...notification, open: false })} anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
        <Alert severity={notification.severity} variant="filled" sx={{ width: "100%" }}>{notification.message}</Alert>
      </Snackbar>
    </Box>
  )
}

export default TutorApproval