import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Paper from '@mui/material/Paper'
import Switch from '@mui/material/Switch'
import FormControlLabel from '@mui/material/FormControlLabel'
import Typography from '@mui/material/Typography'
import DirectionsCarRoundedIcon from '@mui/icons-material/DirectionsCarRounded'
import AssignmentTurnedInRoundedIcon from '@mui/icons-material/AssignmentTurnedInRounded'
import EuroRoundedIcon from '@mui/icons-material/EuroRounded'
import NotificationsActiveRoundedIcon from '@mui/icons-material/NotificationsActiveRounded'
import { Link } from 'react-router-dom'
import StatsGrid from '../components/layout/StatsGrid'
import api from '../services/api'

const statusColors = {
  Pending: 'warning', Accepted: 'primary', InProgress: 'info',
  Completed: 'success', Cancelled: 'error',
}

function DriverDashboardPage() {
  const [profile, setProfile]         = useState(null)
  const [rides, setRides]             = useState([])
  const [togglingOnline, setTogglingOnline] = useState(false)

  const fetchProfile = () => {
    api.get('/driver/me').then((r) => setProfile(r.data)).catch(() => {})
  }
  const fetchRides = () => {
    api.get('/driver/rides').then((r) => setRides(r.data)).catch(() => {})
  }

  useEffect(() => {
    fetchProfile()
    fetchRides()
  }, [])

  const handleToggleOnline = async () => {
    setTogglingOnline(true)
    try {
      const res = await api.patch('/driver/availability')
      // Optimistically update local state
      setProfile((prev) => prev ? { ...prev, is_online: res.data.is_online } : prev)
    } catch {
      // silently fail — UI shows stale value, user can retry
    } finally {
      setTogglingOnline(false)
    }
  }

  const stats = [
    { label: 'Total Rides',    value: rides.length,                                              change: 'All assigned rides' },
    { label: 'Completed',      value: rides.filter((r) => r.status === 'Completed').length,      change: 'Finished successfully' },
    { label: 'In Progress',    value: rides.filter((r) => r.status === 'InProgress').length,     change: 'Active now' },
    { label: 'Total Earnings', value: `€${Number(profile?.total_earnings ?? 0).toFixed(2)}`,     change: 'From completed rides' },
  ]

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h4" fontWeight={700}>
          Welcome back, {profile?.user?.name ?? 'Driver'}!
        </Typography>

        {/* Online / Offline toggle */}
        <Paper
          elevation={0}
          sx={{
            px: 2.5,
            py: 1.5,
            borderRadius: 3,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            border: 1,
            borderColor: profile?.is_online ? 'success.main' : 'divider',
          }}
        >
          <Box
            sx={{
              width: 10, height: 10, borderRadius: '50%',
              bgcolor: profile?.is_online ? 'success.main' : 'grey.500',
              boxShadow: profile?.is_online ? '0 0 6px #22c55e' : 'none',
            }}
          />
          <FormControlLabel
            control={
              <Switch
                checked={!!profile?.is_online}
                onChange={handleToggleOnline}
                disabled={togglingOnline}
                color="success"
                size="small"
              />
            }
            label={
              <Typography variant="body2" fontWeight={600}>
                {profile?.is_online ? 'Online' : 'Offline'}
              </Typography>
            }
            labelPlacement="start"
            sx={{ m: 0 }}
          />
        </Paper>
      </Box>

      <StatsGrid items={stats} />

      {/* Quick Actions */}
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <Button
          component={Link}
          to="/driver/requests"
          variant="contained"
          startIcon={<NotificationsActiveRoundedIcon />}
          sx={{ fontWeight: 700 }}
        >
          View Pending Requests
        </Button>
        <Button
          component={Link}
          to="/driver/rides"
          variant="outlined"
          startIcon={<AssignmentTurnedInRoundedIcon />}
        >
          My Rides
        </Button>
      </Box>

      {/* Driver Profile Card */}
      {profile && (
        <Paper elevation={0} sx={{ p: 3, borderRadius: 3 }}>
          <Typography variant="h6" fontWeight={600} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <DirectionsCarRoundedIcon color="primary" /> Driver Profile
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mt: 1 }}>
            <Box>
              <Typography variant="caption" color="text.secondary">Full Name</Typography>
              <Typography fontWeight={600}>{profile.user?.name} {profile.user?.last_name}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">Email</Typography>
              <Typography fontWeight={600}>{profile.user?.email}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">Phone</Typography>
              <Typography fontWeight={600}>{profile.user?.phone_number ?? '—'}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">License No.</Typography>
              <Typography fontWeight={600}>{profile.license_number}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">License Expiry</Typography>
              <Typography fontWeight={600}>{profile.license_expiry}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">Avg. Rating</Typography>
              <Typography fontWeight={600}>{profile.average_rating ?? '—'} ⭐</Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">Status</Typography>
              <Box sx={{ mt: 0.5 }}>
                <Chip label={profile.status} color={profile.status === 'Active' ? 'success' : 'warning'} size="small" />
              </Box>
            </Box>
          </Box>
        </Paper>
      )}

      {/* Recent Rides */}
      <Paper elevation={0} sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AssignmentTurnedInRoundedIcon color="primary" /> Recent Rides
        </Typography>
        {rides.length === 0 ? (
          <Typography color="text.secondary">No rides assigned yet.</Typography>
        ) : (
          rides.slice(0, 5).map((r) => (
            <Box
              key={r.id}
              sx={{ py: 1.5, borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            >
              <Box>
                <Typography fontWeight={600}>{r.pickup_address} → {r.dropoff_address}</Typography>
                <Typography variant="caption" color="text.secondary">
                  Passenger: {r.passenger?.user?.name ?? '—'}
                  {r.total_fare ? ` · €${Number(r.total_fare).toFixed(2)}` : ''}
                </Typography>
              </Box>
              <Chip
                label={r.status}
                color={statusColors[r.status] ?? 'default'}
                size="small"
              />
            </Box>
          ))
        )}
      </Paper>
    </Box>
  )
}

export default DriverDashboardPage
