import ComputerIcon from '@mui/icons-material/Computer'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import LightModeIcon from '@mui/icons-material/LightMode'
import SchoolIcon from '@mui/icons-material/School'
import NotificationsIcon from '@mui/icons-material/Notifications'
import MenuIcon from '@mui/icons-material/Menu'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import FormControl from '@mui/material/FormControl'
import SearchIcon from '@mui/icons-material/Search'
import InputBase from '@mui/material/InputBase'
import IconButton from '@mui/material/IconButton'
import Badge from '@mui/material/Badge'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'

import { useState } from 'react'
import { useColorScheme, styled, alpha } from '@mui/material/styles'
import { useLocation, useNavigate } from 'react-router-dom'

import theme from '../../theme'
import { useAuthStore } from '../../stores/useAuthStore'

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

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25)
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto'
  }
}))

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}))

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch'
      }
    }
  }
}))

function Header() {
  const navigate = useNavigate()
  const location = useLocation()
  const { signOut } = useAuthStore()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const handleSignOut = async (e) => {
    e.preventDefault()
    try {
      await signOut()
      navigate('/login')
    } catch (error) {
      console.error('Signout error:', error)
    }
  }

  const navItems = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'My Calendar', path: '/calendar' },
    { label: 'My Profile', path: '/profile' },
    { label: 'My students', path: '/students' },
    { label: 'Resources', path: '/resources' }
  ]

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', pt: 4 }}>
      <Box sx={{ py: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <SchoolIcon color="primary" sx={{ mr: 1 }} />
        <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
          EduConnect
        </Typography>
      </Box>
      <List>
        {navItems.map((item) => (
          <ListItem key={item.path} disablePadding sx={{ justifyContent: 'center', my: 1 }}>
            <ListItemButton 
              onClick={() => navigate(item.path)}
              sx={{ 
                textAlign: 'center',
                borderRadius: 2,
                width: '80%',
                color: location.pathname === item.path ? 'primary.main' : 'text.primary',
                bgcolor: location.pathname === item.path ? (theme) => alpha(theme.palette.primary.main, 0.1) : 'transparent',
                '&:hover': {
                  bgcolor: 'action.hover'
                }
              }}
            >
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  )

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        backdropFilter: 'blur(10px)',
        backgroundColor: theme.vars.palette.primary.header,
        color: 'text.primary'
      }}
    >
      <Toolbar sx={{ px: { xs: 2, sm: 3 }, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { xs: 'flex', '@media (min-width: 1290px)': { display: 'none' } } }}
          >
            <MenuIcon />
          </IconButton>
          
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

        <Box sx={{ display: { xs: 'none', '@media (min-width: 1290px)': { display: 'block' } } }}>
          {navItems.map((item) => (
            <Button
              key={item.path}
              color="inherit"
              onClick={() => navigate(item.path)}
              sx={{
                fontWeight: location.pathname === item.path ? 'bold' : 'normal',
                color: location.pathname === item.path ? 'primary.main' : 'text.primary',
                fontSize: { xs: '0.75rem', sm: '1rem' },
                px: { xs: 1, sm: 2 },
                minWidth: 'auto'
              }}
            >
              {item.label}
            </Button>
          ))}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ 'aria-label': 'search' }}
            />
          </Search>
          <Badge badgeContent={5} color="error">
            <NotificationsIcon sx={{ ml: 2 }} />
          </Badge>
          <ModeSwitcher />
          <Button onClick={handleSignOut}>
            Sign Out
          </Button>
        </Box>
      </Toolbar>
      <Box component="nav">
        <Drawer
          variant="temporary"
          anchor="left"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true // Better open performance on mobile.
          }}
          PaperProps={{
            sx: {
              width: 250
            }
          }}
          sx={{
            display: { xs: 'block', '@media (min-width: 1290px)': { display: 'none' } }
          }}
        >
          {drawer}
        </Drawer>
      </Box>
    </AppBar>
  )
}

export default Header