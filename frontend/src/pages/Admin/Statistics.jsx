"use client"

import {
  Container,
  Box,
  Grid,
  Paper,
  Typography,
  Stack,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Toolbar,
  useTheme,
  alpha,
  Popover,
  InputAdornment,
  IconButton
} from "@mui/material"
import AdminHeader from "../../components/Header/AdminHeader"
import AdminFooter from "../../components/Footer/AdminFooter"
import {
  TrendingUp as TrendingUpIcon,
  SchoolOutlined as SchoolIcon,
  AccessTimeOutlined as ClockIcon,
  GroupsOutlined as GroupIcon,
  StorageOutlined as ResourceIcon,
  FilterListOutlined as FilterIcon,
  FileDownloadOutlined as DownloadIcon,
  DeleteOutlined as DeleteIcon,
  Event as EventIcon,
  ChevronLeft,
  ChevronRight
} from "@mui/icons-material"
import { useState } from "react"
import { motion } from "framer-motion" // Import thư viện animation
import { 
  format, startOfMonth, endOfMonth, startOfWeek, endOfWeek,
  addDays, addMonths, subMonths, isSameMonth, isSameDay, parseISO, isValid 
} from "date-fns"

// Cấu hình Animation
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // Thời gian trễ giữa các phần tử
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
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  }
}

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

const MonthCalendar = ({ value, onChange, onClose }) => {
  const [viewDate, setViewDate] = useState(value ? parseISO(value + '-01') : new Date())

  const handlePrev = () => setViewDate(subMonths(viewDate, 12))
  const handleNext = () => setViewDate(addMonths(viewDate, 12))

  const months = []
  for (let i = 0; i < 12; i++) {
    months.push(new Date(viewDate.getFullYear(), i, 1))
  }

  return (
    <Box sx={{ p: 2, width: 320 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <IconButton onClick={handlePrev} size="small"><ChevronLeft /></IconButton>
        <Typography fontWeight="bold">{format(viewDate, 'yyyy')}</Typography>
        <IconButton onClick={handleNext} size="small"><ChevronRight /></IconButton>
      </Stack>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1 }}>
        {months.map((m, i) => {
          const isSelected = value === format(m, 'yyyy-MM')
          const isCurrentMonth = isSameMonth(m, new Date())
          return (
            <Box
              key={i}
              onClick={() => {
                onChange(format(m, 'yyyy-MM'))
                onClose()
              }}
              sx={{
                height: 40,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                borderRadius: '8px',
                bgcolor: isSelected ? 'primary.main' : 'transparent',
                color: isSelected ? 'primary.contrastText' : (isCurrentMonth ? 'primary.main' : 'text.primary'),
                fontWeight: isSelected || isCurrentMonth ? 'bold' : 'normal',
                '&:hover': { bgcolor: isSelected ? 'primary.dark' : 'action.hover' }
              }}
            >
              <Typography variant="body2">{format(m, 'MMM')}</Typography>
            </Box>
          )
        })}
      </Box>
    </Box>
  )
}

const MetricCard = ({ title, value, change, icon: Icon, bgColor }) => {
  const theme = useTheme();
  return (
  <Paper sx={{
    p: { xs: 2, md: 3 },
    borderRadius: "12px",
    bgcolor: "background.paper",
    border: `1px solid ${theme.palette.divider}`,
    boxShadow: theme.palette.mode === 'dark' ? 'none' : "0px 2px 8px rgba(0, 0, 0, 0.08)",
    transition: "all 0.3s ease",
    height: "100%", // Đảm bảo chiều cao đồng đều
    "&:hover": {
      transform: "translateY(-4px)",
      boxShadow: theme.palette.mode === 'dark' ? 'none' : "0px 12px 24px rgba(0, 0, 0, 0.12)", // Bóng đổ sâu hơn khi hover
    },
  }}>
    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
      <Box>
        <Typography sx={{ fontSize: "15px", color: "text.secondary", fontWeight: 500, mb: 0.8 }}>{title}</Typography>
        <Typography sx={{ fontSize: "42px", fontWeight: 700, color: "text.primary", mb: 1 }}>{value}</Typography>
        {change && (
          <Stack direction="row" spacing={0.5} alignItems="center">
            <TrendingUpIcon sx={{ fontSize: "14px", color: "success.main" }} />
            <Typography sx={{ fontSize: "14px", color: "success.main", fontWeight: 600 }}>{change}</Typography>
          </Stack>
        )}
      </Box>
      <Box
        component={motion.div}
        initial={{ scale: 0.8, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200 }}
        sx={{
          p: 1.2,
          borderRadius: "10px",
          background: bgColor,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minWidth: 50,
          minHeight: 50,
        }}
      >
        <Icon sx={{ color: "common.white", fontSize: "26px" }} />
      </Box>
    </Box>
  </Paper>
)};

export default function Statistics() {
  const theme = useTheme();
  const [filters, setFilters] = useState({
    reportType: "Session Summary",
    tutorName: "",
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    subject: "",
    studentName: "",
  })

  const cardStyle = {
    p: { xs: 2, md: 3 },
    borderRadius: "12px",
    bgcolor: "background.paper",
    border: `1px solid ${theme.palette.divider}`,
    boxShadow: theme.palette.mode === 'dark' ? 'none' : "0px 2px 8px rgba(0, 0, 0, 0.08)",
    transition: "all 0.3s ease",
    height: "100%", // Đảm bảo chiều cao đồng đều
    "&:hover": {
      transform: "translateY(-4px)",
      boxShadow: theme.palette.mode === 'dark' ? 'none' : "0px 12px 24px rgba(0, 0, 0, 0.12)", // Bóng đổ sâu hơn khi hover
    },
  }

  const [timePeriod, setTimePeriod] = useState("month")

  // Time period filter states
  const [periodType, setPeriodType] = useState("day")
  const [selectedDay, setSelectedDay] = useState(new Date().toISOString().split('T')[0])
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7))
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString())

  // Custom Date Picker State
  const [pickerAnchor, setPickerAnchor] = useState(null)
  const [activePickerField, setActivePickerField] = useState(null)

  const handleOpenPicker = (event, field) => {
    setPickerAnchor(event.currentTarget)
    setActivePickerField(field)
  }

  const handleClosePicker = () => {
    setPickerAnchor(null)
    setActivePickerField(null)
  }

  const handleDateSelect = (dateStr) => {
    if (activePickerField === 'selectedDay') {
      setSelectedDay(dateStr)
    } else if (activePickerField === 'startDate') {
      handleFilterChange("startDate", dateStr)
    } else if (activePickerField === 'endDate') {
      handleFilterChange("endDate", dateStr)
    } else if (activePickerField === 'selectedMonth') {
      setSelectedMonth(dateStr)
    }
    handleClosePicker()
  }

  const handleClearFilters = () => {
    setFilters({
      reportType: "Session Summary",
      tutorName: "",
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
      subject: "",
      studentName: "",
    })
  }

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const metricsData = {
    day: [
      {
        title: "Total Sessions",
        value: "145",
        change: "+8% vs yesterday",
        icon: SchoolIcon,
        bgColor: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
      },
      {
        title: "Avg. Session Duration",
        value: "1.2 Hours",
        change: "▼2% vs yesterday",
        icon: ClockIcon,
        bgColor: `linear-gradient(135deg, ${theme.palette.warning.light} 0%, ${theme.palette.warning.main} 100%)`,
      },
      {
        title: "Active Tutors",
        value: "12",
        change: "+1 vs yesterday",
        icon: GroupIcon,
        bgColor: `linear-gradient(135deg, ${theme.palette.success.light} 0%, ${theme.palette.success.main} 100%)`,
      },
      {
        title: "Total Resources",
        value: "87",
        change: "+5 vs yesterday",
        icon: ResourceIcon,
        bgColor: `linear-gradient(135deg, ${theme.palette.secondary.light} 0%, ${theme.palette.secondary.main} 100%)`,
      },
    ],
    week: [
      {
        title: "Total Sessions",
        value: "987",
        change: "+6% vs last week",
        icon: SchoolIcon,
        bgColor: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
      },
      {
        title: "Avg. Session Duration",
        value: "1.4 Hours",
        change: "▲1% vs last week",
        icon: ClockIcon,
        bgColor: `linear-gradient(135deg, ${theme.palette.warning.light} 0%, ${theme.palette.warning.main} 100%)`,
      },
      {
        title: "Active Tutors",
        value: "72",
        change: "+3 vs last week",
        icon: GroupIcon,
        bgColor: `linear-gradient(135deg, ${theme.palette.success.light} 0%, ${theme.palette.success.main} 100%)`,
      },
      {
        title: "Total Resources",
        value: "1,650",
        change: "+18 vs last week",
        icon: ResourceIcon,
        bgColor: `linear-gradient(135deg, ${theme.palette.secondary.light} 0%, ${theme.palette.secondary.main} 100%)`,
      },
    ],
    month: [
      {
        title: "Total Sessions",
        value: "1,245",
        change: "+12% vs last month",
        icon: SchoolIcon,
        bgColor: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
      },
      {
        title: "Avg. Session Duration",
        value: "1.5 Hours",
        change: "▼last month",
        icon: ClockIcon,
        bgColor: `linear-gradient(135deg, ${theme.palette.warning.light} 0%, ${theme.palette.warning.main} 100%)`,
      },
      {
        title: "Active Tutors",
        value: "85",
        change: "+5 vs last month",
        icon: GroupIcon,
        bgColor: `linear-gradient(135deg, ${theme.palette.success.light} 0%, ${theme.palette.success.main} 100%)`,
      },
      {
        title: "Total Resources",
        value: "2,130",
        change: "+25 vs last month",
        icon: ResourceIcon,
        bgColor: `linear-gradient(135deg, ${theme.palette.secondary.light} 0%, ${theme.palette.secondary.main} 100%)`,
      },
    ],
    quarter: [
      {
        title: "Total Sessions",
        value: "3,850",
        change: "+18% vs last quarter",
        icon: SchoolIcon,
        bgColor: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
      },
      {
        title: "Avg. Session Duration",
        value: "1.6 Hours",
        change: "▲3% vs last quarter",
        icon: ClockIcon,
        bgColor: `linear-gradient(135deg, ${theme.palette.warning.light} 0%, ${theme.palette.warning.main} 100%)`,
      },
      {
        title: "Active Tutors",
        value: "156",
        change: "+12 vs last quarter",
        icon: GroupIcon,
        bgColor: `linear-gradient(135deg, ${theme.palette.success.light} 0%, ${theme.palette.success.main} 100%)`,
      },
      {
        title: "Total Resources",
        value: "6,420",
        change: "+85 vs last quarter",
        icon: ResourceIcon,
        bgColor: `linear-gradient(135deg, ${theme.palette.secondary.light} 0%, ${theme.palette.secondary.main} 100%)`,
      },
    ],
    year: [
      {
        title: "Total Sessions",
        value: "14,250",
        change: "+25% vs last year",
        icon: SchoolIcon,
        bgColor: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
      },
      {
        title: "Avg. Session Duration",
        value: "1.55 Hours",
        change: "▲5% vs last year",
        icon: ClockIcon,
        bgColor: `linear-gradient(135deg, ${theme.palette.warning.light} 0%, ${theme.palette.warning.main} 100%)`,
      },
      {
        title: "Active Tutors",
        value: "340",
        change: "+45 vs last year",
        icon: GroupIcon,
        bgColor: `linear-gradient(135deg, ${theme.palette.success.light} 0%, ${theme.palette.success.main} 100%)`,
      },
      {
        title: "Total Resources",
        value: "28,750",
        change: "+450 vs last year",
        icon: ResourceIcon,
        bgColor: `linear-gradient(135deg, ${theme.palette.secondary.light} 0%, ${theme.palette.secondary.main} 100%)`,
      },
    ],
  }

  const metrics = metricsData[timePeriod]

  const reportData = [
    {
      id: "R001",
      date: "2023-10-25",
      tutor: "Dr. Alice Smith",
      subject: "Advanced Algorithms",
      students: 12,
      duration: 1.5,
      status: "Completed",
    },
    {
      id: "R002",
      date: "2023-10-26",
      tutor: "Prof. Bob Johnson",
      subject: "Linear Algebra",
      students: 8,
      duration: 2,
      status: "Completed",
    },
    {
      id: "R003",
      date: "2023-10-27",
      tutor: "Ms. Carol White",
      subject: "Quantum Physics",
      students: 15,
      duration: 1,
      status: "Completed",
    },
    {
      id: "R004",
      date: "2023-10-28",
      tutor: "Dr. David Brown",
      subject: "Machine Learning",
      students: 10,
      duration: 1.5,
      status: "Scheduled",
    },
    {
      id: "R005",
      date: "2023-10-29",
      tutor: "Dr. Alice Smith",
      subject: "Data Structures",
      students: 7,
      duration: 1,
      status: "Cancelled",
    },
    {
      id: "R006",
      date: "2023-10-30",
      tutor: "Prof. Bob Johnson",
      subject: "Calculus I",
      students: 9,
      duration: 2,
      status: "Completed",
    },
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return theme.palette.success.main
      case "Scheduled":
        return theme.palette.primary.main
      case "Cancelled":
        return theme.palette.error.main
      default:
        return theme.palette.text.secondary
    }
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
        {/* HEADER */}
        <Box component={motion.div} variants={itemVariants} sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: "text.primary" }}>
            Reports & Statistics
          </Typography>
        </Box>

        {/* TIME PERIOD SELECTOR */}
        <Box component={motion.div} variants={itemVariants}>
            <Paper sx={{ ...cardStyle, mb: 4, p: 3 }}>
            <Grid container spacing={3} alignItems="flex-end">
                <Grid item xs={12} sm={6} md="auto">
                <Box sx={{ width: 220 }}>
                <Typography sx={{ fontSize: "14px", fontWeight: 700, color: "text.primary", mb: 1 }}>
                    Time Period
                </Typography>
                <TextField
                    select
                    fullWidth
                    value={periodType}
                    onChange={(e) => setPeriodType(e.target.value)}
                    SelectProps={{ native: true }}
                    sx={{
                    "& .MuiOutlinedInput-root": {
                        height: "44px",
                        borderRadius: "8px",
                        fontSize: "14px",
                        backgroundColor: "background.paper",
                        border: `2px solid ${theme.palette.divider}`,
                        color: "text.primary",
                        "&:hover": { borderColor: "primary.main" },
                        "&.Mui-focused": { borderColor: "primary.main" },
                    },
                    "& .MuiOutlinedInput-input": { color: "text.primary" },
                    "& .MuiSvgIcon-root": { color: "text.secondary" },
                    "& select": { color: "text.primary" },
                    }}
                >
                    <option value="day" style={{ backgroundColor: theme.palette.background.paper, color: theme.palette.text.primary }}>Day</option>
                    <option value="week" style={{ backgroundColor: theme.palette.background.paper, color: theme.palette.text.primary }}>Week</option>
                    <option value="month" style={{ backgroundColor: theme.palette.background.paper, color: theme.palette.text.primary }}>Month</option>
                    <option value="year" style={{ backgroundColor: theme.palette.background.paper, color: theme.palette.text.primary }}>Year</option>
                </TextField>
                </Box>
                </Grid>

                <Grid item xs={12} sm={6} md="auto">
                <Box sx={{ width: 220 }}>
                <Typography sx={{ fontSize: "14px", fontWeight: 700, color: "text.primary", mb: 1 }}>
                    Selected Period
                </Typography>
                <Box sx={{ minHeight: "44px" }}>
                    {(periodType === "day" || periodType === "week") && (
                    <TextField
                        fullWidth
                        value={selectedDay ? format(parseISO(selectedDay), 'dd/MM/yyyy') : ''}
                        onClick={(e) => handleOpenPicker(e, 'selectedDay')}
                        InputProps={{
                            readOnly: true,
                            endAdornment: (
                            <InputAdornment position="end">
                                <EventIcon sx={{ cursor: 'pointer', color: 'text.secondary' }} />
                            </InputAdornment>
                            )
                        }}
                        sx={{
                        "& .MuiOutlinedInput-root": {
                            height: "44px",
                            borderRadius: "8px",
                            fontSize: "14px",
                            backgroundColor: "background.paper",
                            border: `2px solid ${theme.palette.divider}`,
                            color: "text.primary",
                            cursor: "pointer",
                            "&:hover": { borderColor: "primary.main" },
                            "&.Mui-focused": { borderColor: "primary.main" },
                        },
                        "& .MuiOutlinedInput-input": {
                            color: "text.primary",
                            fontSize: "14px",
                            padding: "10px 12px",
                            cursor: "pointer",
                        },
                        }}
                    />
                    )}
                    {periodType === "month" && (
                    <TextField
                        fullWidth
                        value={selectedMonth ? format(parseISO(selectedMonth + '-01'), 'MMMM yyyy') : ''}
                        onClick={(e) => handleOpenPicker(e, 'selectedMonth')}
                        InputProps={{
                            readOnly: true,
                            endAdornment: (
                            <InputAdornment position="end">
                                <EventIcon sx={{ cursor: 'pointer', color: 'text.secondary' }} />
                            </InputAdornment>
                            )
                        }}
                        sx={{
                        "& .MuiOutlinedInput-root": {
                            height: "44px",
                            borderRadius: "8px",
                            fontSize: "14px",
                            backgroundColor: "background.paper",
                            border: `2px solid ${theme.palette.divider}`,
                            color: "text.primary",
                            cursor: "pointer",
                            "&:hover": { borderColor: "primary.main" },
                            "&.Mui-focused": { borderColor: "primary.main" },
                        },
                        "& .MuiOutlinedInput-input": {
                            color: "text.primary",
                            fontSize: "14px",
                            padding: "10px 12px",
                            cursor: "pointer",
                        },
                        }}
                    />
                    )}
                    {periodType === "year" && (
                    <TextField
                        select
                        fullWidth
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(e.target.value)}
                        SelectProps={{ native: true }}
                        sx={{
                        "& .MuiOutlinedInput-root": {
                            height: "44px",
                            borderRadius: "8px",
                            fontSize: "14px",
                            backgroundColor: "background.paper",
                            border: `2px solid ${theme.palette.divider}`,
                            color: "text.primary",
                            "&:hover": { borderColor: "primary.main" },
                            "&.Mui-focused": { borderColor: "primary.main" },
                        },
                        "& .MuiOutlinedInput-input": { color: "text.primary" },
                        "& select": { color: "text.primary" },
                        }}
                    >
                        {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i).map(year => (
                        <option key={year} value={year} style={{ backgroundColor: theme.palette.background.paper, color: theme.palette.text.primary }}>{year}</option>
                        ))}
                    </TextField>
                    )}
                    <Popover
                        open={Boolean(pickerAnchor)}
                        anchorEl={pickerAnchor}
                        onClose={handleClosePicker}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                    >
                        {activePickerField === 'selectedMonth' ? (
                            <MonthCalendar
                                value={selectedMonth}
                                onChange={handleDateSelect}
                                onClose={handleClosePicker}
                            />
                        ) : (
                            <MiniCalendar
                                value={activePickerField === 'selectedDay' ? selectedDay : (activePickerField === 'startDate' ? filters.startDate : filters.endDate)}
                                onChange={handleDateSelect}
                                onClose={handleClosePicker}
                            />
                        )}
                    </Popover>
                </Box>
                </Box>
                </Grid>

                <Grid item xs={12} sm={12} md={6}>
                <Stack direction="row" spacing={2}>
                    <Button
                    startIcon={<FilterIcon />}
                    variant="contained"
                    sx={{
                        textTransform: "none",
                        fontWeight: 600,
                        px: 3,
                        borderRadius: "8px"
                    }}
                    >
                    Apply Filter
                    </Button>
                    <Button
                    startIcon={<DeleteIcon />}
                    variant="outlined"
                    onClick={() => {
                        setPeriodType("day")
                        setSelectedDay(new Date().toISOString().split('T')[0])
                        setSelectedMonth(new Date().toISOString().slice(0, 7))
                        setSelectedYear(new Date().getFullYear().toString())
                    }}
                    sx={{
                        color: "error.main",
                        border: `1px solid ${theme.palette.error.main}`,
                        textTransform: "none",
                        fontWeight: 600,
                        px: 3,
                        borderRadius: "8px",
                        "&:hover": { bgcolor: alpha(theme.palette.error.main, 0.1) },
                    }}
                    >
                    Clear Filters
                    </Button>
                </Stack>
                </Grid>
            </Grid>
            </Paper>
        </Box>

        {/* METRIC CARDS - 4 COLUMN */}
        <Grid container spacing={{ xs: 2, md: 0 }} justifyContent="space-between" sx={{ mb: 4 }}>
          {metrics.map((metric, index) => (
            <Grid 
                item xs={12} sm={6} key={index}
                component={motion.div} 
                variants={itemVariants}
                sx={{ width: { xs: '100%', sm: '48%', md: '23%' } }}
            >
              <MetricCard
                title={metric.title}
                value={metric.value}
                change={metric.change}
                icon={metric.icon}
                bgColor={metric.bgColor}
              />
            </Grid>
          ))}
        </Grid>

        {/* REPORT FILTERS SECTION */}
        <Box component={motion.div} variants={itemVariants}>
          <Paper sx={cardStyle}>
            <Box sx={{ mb: 3 }}>
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
                <FilterIcon sx={{ color: "primary.main", fontSize: "24px" }} />
                <Typography sx={{ fontWeight: 600, fontSize: "20px", color: "text.primary" }}>Report Filters</Typography>
                </Stack>
            </Box>

            <Grid container spacing={{ xs: 2, md: 3 }}>
                <Grid item xs={12} sm={6} md={2}>
                <Typography sx={{ fontSize: "14px", fontWeight: 700, color: "text.primary", mb: 1 }}>Report Type</Typography>
                <TextField
                    select
                    fullWidth
                    value={filters.reportType}
                    onChange={(e) => handleFilterChange("reportType", e.target.value)}
                    SelectProps={{ native: true }}
                    sx={{
                    "& .MuiOutlinedInput-root": {
                        height: "44px",
                        borderRadius: "8px",
                        fontSize: "14px",
                        backgroundColor: "background.paper",
                        border: `2px solid ${theme.palette.divider}`,
                        color: "text.primary",
                        "&:hover": {
                        borderColor: "primary.main",
                        },
                        "&.Mui-focused": {
                        borderColor: "primary.main",
                        },
                    },
                    "& .MuiOutlinedInput-input": {
                        color: "text.primary",
                    },
                    "& select": {
                        color: "text.primary",
                    },
                    "& select option": {
                        color: "text.primary",
                        backgroundColor: "background.paper",
                    },
                    }}
                >
                    <option style={{ color: theme.palette.text.primary, backgroundColor: theme.palette.background.paper }}>Session Summary</option>
                    <option style={{ color: theme.palette.text.primary, backgroundColor: theme.palette.background.paper }}>Tutor Performance</option>
                    <option style={{ color: theme.palette.text.primary, backgroundColor: theme.palette.background.paper }}>Student Activity</option>
                </TextField>
                </Grid>

                <Grid item xs={12} sm={6} md={2} width={200}>
                <Typography sx={{ fontSize: "14px", fontWeight: 700, color: "text.primary", mb: 1 }}>Start Date</Typography>
                <TextField
                    fullWidth
                    value={filters.startDate ? format(parseISO(filters.startDate), 'dd/MM/yyyy') : ''}
                    onClick={(e) => handleOpenPicker(e, 'startDate')}
                    InputProps={{
                        readOnly: true,
                        endAdornment: (
                        <InputAdornment position="end">
                            <EventIcon sx={{ cursor: 'pointer', color: 'text.secondary' }} />
                        </InputAdornment>
                        )
                    }}
                    sx={{
                    "& .MuiOutlinedInput-root": {
                        height: "44px",
                        borderRadius: "8px",
                        fontSize: "14px",
                        backgroundColor: "background.paper",
                        border: `2px solid ${theme.palette.divider}`,
                        color: "text.primary",
                        cursor: "pointer",
                        "&:hover": {
                        borderColor: "primary.main",
                        },
                        "&.Mui-focused": {
                        borderColor: "primary.main",
                        },
                    },
                    "& .MuiOutlinedInput-input": {
                        color: "text.primary",
                        cursor: "pointer",
                        fontSize: "14px",
                        padding: "10px 12px",
                    },
                    }}
                />
                </Grid>

                <Grid item xs={12} sm={6} md={2} width={200}>
                <Typography sx={{ fontSize: "14px", fontWeight: 700, color: "text.primary", mb: 1 }}>End Date</Typography>
                <TextField
                    fullWidth
                    value={filters.endDate ? format(parseISO(filters.endDate), 'dd/MM/yyyy') : ''}
                    onClick={(e) => handleOpenPicker(e, 'endDate')}
                    InputProps={{
                        readOnly: true,
                        endAdornment: (
                        <InputAdornment position="end">
                            <EventIcon sx={{ cursor: 'pointer', color: 'text.secondary' }} />
                        </InputAdornment>
                        )
                    }}
                    sx={{
                    "& .MuiOutlinedInput-root": {
                        height: "44px",
                        borderRadius: "8px",
                        fontSize: "14px",
                        backgroundColor: "background.paper",
                        border: `2px solid ${theme.palette.divider}`,
                        color: "text.primary",
                        cursor: "pointer",
                        "&:hover": {
                        borderColor: "primary.main",
                        },
                        "&.Mui-focused": {
                        borderColor: "primary.main",
                        },
                    },
                    "& .MuiOutlinedInput-input": {
                        color: "text.primary",
                        cursor: "pointer",
                        fontSize: "14px",
                        padding: "10px 12px",
                    },
                    }}
                />
                </Grid>

                <Grid item xs={12} sm={6} md={2}>
                <Typography sx={{ fontSize: "14px", fontWeight: 700, color: "text.primary", mb: 1 }}>Subject</Typography>
                <TextField
                    fullWidth
                    value={filters.subject}
                    onChange={(e) => handleFilterChange("subject", e.target.value)}
                    sx={{
                    "& .MuiOutlinedInput-root": {
                        height: "44px",
                        borderRadius: "8px",
                        fontSize: "14px",
                        backgroundColor: "background.paper",
                        border: `2px solid ${theme.palette.divider}`,
                        color: "text.primary",
                        "&:hover": {
                        borderColor: "primary.main",
                        },
                        "&.Mui-focused": {
                        borderColor: "primary.main",
                        },
                    },
                    "& .MuiOutlinedInput-input": {
                        color: "text.primary",
                        "&::placeholder": {
                        color: "text.secondary",
                        opacity: 1,
                        },
                    },
                    }}
                />
                </Grid>

                <Grid item xs={12} sm={6} md={2}>
                <Typography sx={{ fontSize: "14px", fontWeight: 700, color: "text.primary", mb: 1 }}>Tutor Name</Typography>
                <TextField
                    fullWidth
                    value={filters.tutorName}
                    onChange={(e) => handleFilterChange("tutorName", e.target.value)}
                    sx={{
                    "& .MuiOutlinedInput-root": {
                        height: "44px",
                        borderRadius: "8px",
                        fontSize: "14px",
                        backgroundColor: "background.paper",
                        border: `2px solid ${theme.palette.divider}`,
                        color: "text.primary",
                        "&:hover": {
                        borderColor: "primary.main",
                        },
                        "&.Mui-focused": {
                        borderColor: "primary.main",
                        },
                    },
                    "& .MuiOutlinedInput-input": {
                        color: "text.primary",
                        "&::placeholder": {
                        color: "text.secondary",
                        opacity: 1,
                        },
                    },
                    }}
                />
                </Grid>

                <Grid item xs={12} sm={6} md={2}>
                <Typography sx={{ fontSize: "14px", fontWeight: 700, color: "text.primary", mb: 1 }}>Student Name</Typography>
                <TextField
                    fullWidth
                    value={filters.studentName}
                    onChange={(e) => handleFilterChange("studentName", e.target.value)}
                    sx={{
                    "& .MuiOutlinedInput-root": {
                        height: "44px",
                        borderRadius: "8px",
                        fontSize: "14px",
                        backgroundColor: "background.paper",
                        border: `2px solid ${theme.palette.divider}`,
                        color: "text.primary",
                        "&:hover": {
                        borderColor: "primary.main",
                        },
                        "&.Mui-focused": {
                        borderColor: "primary.main",
                        },
                    },
                    "& .MuiOutlinedInput-input": {
                        color: "text.primary",
                        "&::placeholder": {
                        color: "text.secondary",
                        opacity: 1,
                        },
                    },
                    }}
                />
              </Grid>
            </Grid>

            {/* FILTER ACTIONS */}
            <Stack
              direction="row"
              spacing={2}
              sx={{ pt: 4, borderTop: `1px solid ${theme.palette.divider}`, flexWrap: "wrap", alignItems: "center" }}
            >
              <Button
              startIcon={<FilterIcon />}
              variant="contained"
              sx={{
                  textTransform: "none",
                  fontWeight: 600,
                  px: 3,
                  borderRadius: "8px"
              }}
              >
              Apply Filter
              </Button>

              <Button
              startIcon={<DeleteIcon />}
              onClick={handleClearFilters}
              sx={{
                  color: "error.main",
                  border: `1px solid ${theme.palette.error.main}`,
                  textTransform: "none",
                  fontWeight: 600,
                  px: 3,
                  borderRadius: "8px",
                  "&:hover": { bgcolor: alpha(theme.palette.error.main, 0.1) },
              }}
              >
              Clear Filters
              </Button>
            </Stack>
          </Paper>
        </Box>

        {/* OVERALL SESSION SUMMARY TABLE */}
        <Box component={motion.div} variants={itemVariants}>
            <Paper sx={{ ...cardStyle, mt: 4, mb: 4 }}>
            <Box sx={{ mb: 3 }}>
                <Typography sx={{ fontWeight: 600, fontSize: "20px", color: "text.primary" }}>
                Overall Session Summary
                </Typography>
                <Typography sx={{ fontSize: "15px", color: "text.secondary", mt: 0.8 }}>
                Detailed breakdown of tutoring sessions based on current filters.
                </Typography>
            </Box>

            <TableContainer>
                <Table>
                <TableHead>
                    <TableRow sx={{ bgcolor: alpha(theme.palette.primary.main, 0.05), borderBottom: `2px solid ${theme.palette.divider}` }}>
                    <TableCell sx={{ fontWeight: 700, fontSize: "14px", color: "text.secondary", textTransform: "uppercase" }}>
                        Report ID
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: "14px", color: "text.secondary", textTransform: "uppercase" }}>
                        Date
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: "14px", color: "text.secondary", textTransform: "uppercase" }}>
                        Tutor
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: "14px", color: "text.secondary", textTransform: "uppercase" }}>
                        Subject
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: "14px", color: "text.secondary", textTransform: "uppercase" }}>
                        Students Attended
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: "14px", color: "text.secondary", textTransform: "uppercase" }}>
                        Duration (Hours)
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: "14px", color: "text.secondary", textTransform: "uppercase" }}>
                        Status
                    </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {reportData.map((row, index) => (
                    <TableRow key={index} sx={{ borderBottom: `1px solid ${theme.palette.divider}`, "&:hover": { bgcolor: alpha(theme.palette.primary.main, 0.02) } }}>
                        <TableCell sx={{ fontSize: "14px", fontWeight: 600, color: "primary.main" }}>{row.id}</TableCell>
                        <TableCell sx={{ fontSize: "14px", color: "text.primary" }}>{format(new Date(row.date), 'dd/MM/yyyy')}</TableCell>
                        <TableCell sx={{ fontSize: "14px", color: "text.primary" }}>{row.tutor}</TableCell>
                        <TableCell sx={{ fontSize: "14px", color: "text.primary" }}>{row.subject}</TableCell>
                        <TableCell sx={{ fontSize: "14px", color: "text.primary", textAlign: "center" }}>
                        {row.students}
                        </TableCell>
                        <TableCell sx={{ fontSize: "14px", color: "text.primary", textAlign: "center" }}>
                        {row.duration}
                        </TableCell>
                        <TableCell>
                        <Box
                            sx={{
                            display: "inline-block",
                            px: 2,
                            py: 0.8,
                            borderRadius: "6px",
                            bgcolor: alpha(getStatusColor(row.status), 0.12),
                            color: getStatusColor(row.status),
                            fontWeight: 600,
                            fontSize: "13px",
                            }}
                        >
                            {row.status}
                        </Box>
                        </TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                </Table>
            </TableContainer>

            <Stack direction="row" spacing={2} sx={{ mt: 4, justifyContent: "flex-start" }}>
                <Button
                startIcon={<DownloadIcon />}
                sx={{
                    color: "primary.main",
                    border: `1px solid ${theme.palette.primary.main}`,
                    textTransform: "none",
                    fontWeight: 600,
                    px: 3,
                    borderRadius: "8px",
                    "&:hover": { bgcolor: alpha(theme.palette.primary.main, 0.1) },
                }}
                >
                Export to PDF
                </Button>

                <Button
                startIcon={<DownloadIcon />}
                sx={{
                    color: "success.main",
                    border: `1px solid ${theme.palette.success.main}`,
                    textTransform: "none",
                    fontWeight: 600,
                    px: 3,
                    borderRadius: "8px",
                    "&:hover": { bgcolor: alpha(theme.palette.success.main, 0.1) },
                }}
                >
                Export to Excel
                </Button>
            </Stack>
            </Paper>
        </Box>
      </Container>

      <AdminFooter />
    </Box>
  )
}