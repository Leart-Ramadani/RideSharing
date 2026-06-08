import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import StatsGrid from '../components/layout/StatsGrid'
import api from '../services/api'

const statusColors = {
  Pending: 'warning', Accepted: 'primary', InProgress: 'info',
  Completed: 'success', Cancelled: 'error',
}

function RidesPage() {
  const [rides, setRides] = useState([])

  useEffect(() => {
    api.get('/rides').then((r) => setRides(r.data)).catch(() => {})
  }, [])

  const stats = [
    { label: 'Total Rides', value: rides.length, change: 'All time' },
    { label: 'Completed', value: rides.filter((r) => r.status === 'Completed').length, change: 'Successfully finished' },
    { label: 'In Progress', value: rides.filter((r) => r.status === 'InProgress').length, change: 'Currently active' },
    { label: 'Cancelled', value: rides.filter((r) => r.status === 'Cancelled').length, change: 'Cancelled rides' },
  ]

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box>
        <Typography variant="h4" fontWeight={700}>Rides</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          View-only. Rides are created by passengers and managed by drivers.
        </Typography>
      </Box>

      <StatsGrid items={stats} />

      <Paper elevation={0} sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>Ride List</Typography>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Passenger</TableCell>
                <TableCell>Driver</TableCell>
                <TableCell>Pickup</TableCell>
                <TableCell>Dropoff</TableCell>
                <TableCell>Distance</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rides.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>{r.id}</TableCell>
                  <TableCell>
                    {r.passenger ? `${r.passenger.first_name} ${r.passenger.last_name}` : '—'}
                  </TableCell>
                  <TableCell>
                    {r.driver ? `${r.driver.first_name} ${r.driver.last_name}` : '—'}
                  </TableCell>
                  <TableCell>{r.pickup_address}</TableCell>
                  <TableCell>{r.dropoff_address}</TableCell>
                  <TableCell>{r.distance_km ? `${r.distance_km} km` : '—'}</TableCell>
                  <TableCell>
                    <Chip label={r.status} color={statusColors[r.status] ?? 'default'} size="small" />
                  </TableCell>
                </TableRow>
              ))}
              {rides.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center">No rides found.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  )
}

export default RidesPage
