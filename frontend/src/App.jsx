import { useEffect, useState } from 'react'
import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import AppRoutes from './routes/AppRoutes'

function createAppTheme(mode) {
  return createTheme({
    palette: {
      mode,
      primary: {
        main: mode === 'dark' ? '#38bdf8' : '#0284c7',
      },
      secondary: {
        main: '#14b8a6',
      },
      background: {
        default: mode === 'dark' ? '#0f172a' : '#f8fafc',
        paper: mode === 'dark' ? '#111c34' : '#ffffff',
      },
    },
    shape: {
      borderRadius: 18,
    },
    typography: {
      fontFamily: '"Inter", "Segoe UI", sans-serif',
      h4: {
        fontWeight: 700,
      },
      h5: {
        fontWeight: 700,
      },
      h6: {
        fontWeight: 600,
      },
    },
    components: {
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            borderRight: '0',
          },
        },
      },
    },
  })
}

function App() {
  const [colorMode, setColorMode] = useState(() => localStorage.getItem('ridesharing-admin-mode') || 'light')

  useEffect(() => {
    localStorage.setItem('ridesharing-admin-mode', colorMode)
    document.documentElement.classList.toggle('dark', colorMode === 'dark')
  }, [colorMode])

  const theme = createAppTheme(colorMode)

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppRoutes
        colorMode={colorMode}
        onToggleColorMode={() => setColorMode((currentMode) => (currentMode === 'light' ? 'dark' : 'light'))}
      />
    </ThemeProvider>
  )
}

export default App
