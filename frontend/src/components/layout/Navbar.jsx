import { useState } from 'react'
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded'
import AppBar from '@mui/material/AppBar'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Stack from '@mui/material/Stack'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const COLLAPSED_SIDEBAR_WIDTH = 92
const EXPANDED_SIDEBAR_WIDTH = 280

function Navbar({ collapsed, pageSubtitle, pageTitle }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [anchorEl, setAnchorEl] = useState(null)
  const sidebarWidth = collapsed ? COLLAPSED_SIDEBAR_WIDTH : EXPANDED_SIDEBAR_WIDTH

  const handleLogout = async () => {
    setAnchorEl(null)
    await logout()
    navigate('/login')
  }

  const initials = user ? `${user.name?.[0] ?? ''}${user.last_name?.[0] ?? ''}`.toUpperCase() : 'AU'
  const displayName = user ? `${user.name} ${user.last_name}` : 'Admin User'
  const roleLabel = user?.roles?.[0]?.name ?? 'System User'

  return (
    <AppBar
      position="fixed"
      color="inherit"
      elevation={0}
      className="border-b border-slate-200/70 bg-white/80 backdrop-blur-xl transition-[margin,width] duration-300 ease-in-out dark:border-slate-800 dark:bg-slate-950/70"
      sx={{
        width: { lg: `calc(100% - ${sidebarWidth}px)` },
        ml: { lg: `${sidebarWidth}px` },
      }}
    >
      <Toolbar className="flex min-h-[80px] items-center justify-between gap-4 px-4 sm:px-6">
        <Stack direction="row" spacing={2} alignItems="center" className="min-w-0">
          <Box className="min-w-0">
            <Typography variant="h5" className="truncate text-slate-900 dark:text-slate-100">
              {pageTitle}
            </Typography>
            <Typography variant="body2" className="truncate text-slate-500 dark:text-slate-400">
              {pageSubtitle}
            </Typography>
          </Box>
        </Stack>

        <Stack direction="row" spacing={1.5} alignItems="center">
          <button
            type="button"
            onClick={(e) => setAnchorEl(e.currentTarget)}
            className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white/70 px-2 py-1.5 shadow-sm transition hover:border-sky-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-900/80 dark:hover:border-sky-700"
          >
            <Avatar sx={{ width: 38, height: 38, bgcolor: 'primary.main' }}>{initials}</Avatar>
            <Box className="hidden text-left sm:block">
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{displayName}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{roleLabel}</p>
            </Box>
          </button>

          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
            <MenuItem onClick={handleLogout} sx={{ gap: 1 }}>
              <LogoutRoundedIcon fontSize="small" />
              Logout
            </MenuItem>
          </Menu>
        </Stack>
      </Toolbar>
    </AppBar>
  )
}

export default Navbar
