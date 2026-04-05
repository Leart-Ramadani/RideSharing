import AppBar from '@mui/material/AppBar'
import Avatar from '@mui/material/Avatar'
import Badge from '@mui/material/Badge'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import InputBase from '@mui/material/InputBase'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded'

function AdminLayout({ activePage, children, navigationItems, onNavigate, pageSubtitle, pageTitle }) {
  const groupedNavigation = navigationItems.reduce((groups, item) => {
    if (!groups[item.section]) {
      groups[item.section] = []
    }

    groups[item.section].push(item)
    return groups
  }, {})

  return (
    <Box className="admin-shell">
      <Box component="aside" className="sidebar">
        <Stack spacing={3} sx={{ height: '100%' }}>
          <Box>
            <Typography className="brand-kicker">RideSharing</Typography>
            <Typography variant="h5" className="brand-title">
              Control Room
            </Typography>
            <Typography className="brand-copy">
              Admin tools, operations, and monitoring live in one workspace.
            </Typography>
          </Box>

          <Box className="status-card">
            <Typography className="status-label">System status</Typography>
            <Typography variant="h6">Stable</Typography>
            <Typography className="status-copy">
              Driver matching and payments are operating normally.
            </Typography>
            <Chip label="Realtime sync active" size="small" className="status-chip" />
          </Box>

          <Stack spacing={2} sx={{ flex: 1 }}>
            {Object.entries(groupedNavigation).map(([section, items]) => (
              <Box key={section}>
                <Typography className="nav-section-title">{section}</Typography>
                <Stack spacing={1} sx={{ mt: 1.5 }}>
                  {items.map((item) => {
                    const Icon = item.icon
                    const isActive = item.id === activePage

                    return (
                      <Button
                        key={item.id}
                        className={`nav-item${isActive ? ' active' : ''}`}
                        onClick={() => onNavigate(item.id)}
                        startIcon={<Icon />}
                        variant="text"
                      >
                        {item.label}
                      </Button>
                    )
                  })}
                </Stack>
              </Box>
            ))}
          </Stack>

          <Paper elevation={0} className="sidebar-footer">
            <Typography className="sidebar-footer-title">Ops note</Typography>
            <Typography className="sidebar-footer-copy">
              Use the overview and users pages to validate the shared dashboard layout.
            </Typography>
          </Paper>
        </Stack>
      </Box>

      <Box className="content-shell">
        <AppBar position="static" elevation={0} className="topbar">
          <Toolbar className="topbar-toolbar">
            <Box>
              <Typography variant="h4" className="page-title">
                {pageTitle}
              </Typography>
              <Typography className="page-subtitle">{pageSubtitle}</Typography>
            </Box>

            <Stack direction="row" spacing={1.5} alignItems="center">
              <Paper elevation={0} className="search-box">
                <SearchRoundedIcon fontSize="small" />
                <InputBase placeholder="Search rides, drivers, payouts..." />
              </Paper>

              <IconButton className="topbar-icon-button">
                <Badge color="error" badgeContent={3}>
                  <NotificationsRoundedIcon />
                </Badge>
              </IconButton>

              <IconButton className="topbar-icon-button">
                <SettingsRoundedIcon />
              </IconButton>

              <Divider orientation="vertical" flexItem />

              <Stack direction="row" spacing={1.5} alignItems="center">
                <Avatar sx={{ bgcolor: '#0f766e' }}>AD</Avatar>
                <Box>
                  <Typography className="profile-name">Admin User</Typography>
                  <Typography className="profile-role">Operations Lead</Typography>
                </Box>
              </Stack>
            </Stack>
          </Toolbar>
        </AppBar>

        <Box component="main" className="page-content">
          {children}
        </Box>
      </Box>
    </Box>
  )
}

export default AdminLayout
