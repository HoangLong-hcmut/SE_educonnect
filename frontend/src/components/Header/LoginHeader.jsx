import ComputerIcon from '@mui/icons-material/Computer'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import LightModeIcon from '@mui/icons-material/LightMode'
import SchoolIcon from '@mui/icons-material/School'
import { AppBar, Box, Button, MenuItem, Select, Toolbar, Typography } from '@mui/material'
import FormControl from '@mui/material/FormControl'
import { useColorScheme } from '@mui/material/styles'
import { useLocation, useNavigate } from 'react-router-dom'

function ModeSwitcher() {
  const { mode, setMode } = useColorScheme()

  const handleModeChange = (event) => {
    setMode(event.target.value)
  }

  if (!mode) {
    return null
  }

  const getModeIcon = () => {
    switch (mode) {
    case 'light':
      return <LightModeIcon fontSize='small' />
    case 'dark':
      return <DarkModeIcon fontSize='small' />
    case 'system':
      return <ComputerIcon fontSize='small' />
    default:
      return <LightModeIcon fontSize='small' />
    }
  }

  return (
    <FormControl>
      <Select
        labelId='mode-select-label'
        id='mode-select'
        value={mode}
        onChange={handleModeChange}
        sx={{
          minWidth: 'auto',
          width: '40px',
          fontSize: { xs: '0.75rem', sm: '1rem' },
          '& .MuiSelect-select': {
            paddingRight: '0 !important',
            paddingLeft: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }
        }}
        variant='standard'
        disableUnderline={true}
        IconComponent={() => null}
        renderValue={() => getModeIcon()}
      >
        <MenuItem value="light">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LightModeIcon fontSize='small'/> Light
          </Box>
        </MenuItem>
        <MenuItem value="dark">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <DarkModeIcon fontSize='small'/> Dark
          </Box>
        </MenuItem>
        <MenuItem value="system">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ComputerIcon fontSize='small'/> System
          </Box>
        </MenuItem>
      </Select>
    </FormControl>
  )
}

function Header() {
  const navigate = useNavigate()
  const location = useLocation()

  const navItems = [
    { label: 'Help', path: '/help' },
    { label: 'About', path: '/about' }
  ]

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        backdropFilter: 'blur(10px)',
        backgroundColor: (theme) =>
          theme.palette.mode === 'light'
            ? 'rgba(255, 255, 255, 0.8)'
            : 'rgba(33, 33, 33, 0.8)',
        color: 'text.primary'
      }}
    >
      <Toolbar sx={{ px: { xs: 2, sm: 3 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mr: { xs: 1, sm: 1.5 } }}>
            <SchoolIcon color="primary" sx={{ fontSize: { xs: 20, sm: 24 } }} />
          </Box>
          <Typography
            variant="h6"
            component="div"
            sx={{
              fontWeight: 600,
              fontSize: { xs: '1rem', sm: '1.25rem' }
            }}
          >
            EduConnect
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1 } }}>
          {navItems.map((item) => (
            <Button
              key={item.path}
              color="inherit"
              onClick={() => navigate(item.path)}
              sx={{
                fontWeight: location.pathname === item.path ? 'bold' : 'normal',
                textDecoration: location.pathname === item.path ? 'underline' : 'none',
                textUnderlineOffset: '4px',
                fontSize: { xs: '0.75rem', sm: '1rem' },
                px: { xs: 1, sm: 2 },
                minWidth: 'auto'
              }}
            >
              {item.label}
            </Button>
          ))}

          <ModeSwitcher />
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default Header