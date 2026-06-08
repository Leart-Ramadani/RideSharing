import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import DirectionsCarFilledRoundedIcon from '@mui/icons-material/DirectionsCarFilledRounded'
import { Link } from 'react-router-dom'
import StatsGrid from '../components/layout/StatsGrid'
import api from '../services/api'

const statusColors = {
  Pending: 'warning', Accepted: 'primary', InProgress: 'info',
  Completed: 'success', Cancelled: 'error',
}

function PassengerDashboardPage() {
  const [rides, setRides] = useState([])
  const [requests, setRequests] = useState([])

  useEffect(() => {
    api.get('/passenger/rides').then((r) => setRides(r.data)).catch(() => {})
    api.get('/passenger/ride-requests').then((r) => setRequests(r.data)).catch(() => {})
  }, [])

  const stats = [
    { label: 'Total Rides', value: rides.length, change: 'All your rides' },
    { label: 'Completed', value: rides.filter((r) => r.status === 'Completed').length, change: 'Finished rides' },
    { label: 'Pending Requests', value: requests.filter((r) => r.status === 'Pending').length, change: 'Awaiting driver' },
  ]

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h4" fontWeight={700}>Passenger Dashboard</Typography>
        <Button
          component={Link}
          to="/passenger/request"
          variant="contained"
          startIcon={<DirectionsCarFilledRoundedIcon />}
          sx={{ fontWeight: 700 }}
        >
          Request a Ride
        </Button>
      </Box>

      <StatsGrid items={stats} />

      <Paper elevation={0} sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>Recent Rides</Typography>
        {rides.length === 0 ? (
          <Typography color="text.secondary">No rides yet. Request your first ride!</Typography>
        ) : (
          rides.slice(0, 5).map((r) => (
            <Box key={r.id} sx={{ py: 1.5, borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography fontWeight={600}>{r.pickup_address} → {r.dropoff_address}</Typography>
                <Typography variant="caption" color="text.secondary">
                  Driver: {r.driver?.user ? `${r.driver.user.name} ${r.driver.user.last_name}` : 'Not assigned'}
                </Typography>
              </Box>
              <Chip label={r.status} color={statusColors[r.status] ?? 'default'} size="small" />
            </Box>
          ))
        )}
      </Paper>
    </Box>
  )
}

export default PassengerDashboardPage
