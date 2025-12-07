import { extendTheme } from '@mui/material/styles'
import { red } from '@mui/material/colors'

// Create a theme instance.
const theme = extendTheme({
  colorSchemeSelector: 'class',
  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: '#4473AF',
          header: 'rgba(255, 255, 255, 0.8)'
        },
        secondary: {
          main: '#19857b'
        },
        error: {
          main: red[500]
        },
        background: {
          default: '#f5f7fa',
          paper: '#ffffff',
          neutral: '#fafafa'
        }
      }
    },
    dark: {
      palette: {
        primary: {
          main: '#90caf9',
          header: 'rgba(33, 33, 33, 0.8)'
        },
        secondary: {
          main: '#f48fb1'
        },
        error: {
          main: red[300]
        },
        background: {
          default: '#121212',
          paper: '#1e1e1e',
          neutral: '#2c2c2c'
        }
      }
    }
  }
})

export default theme