import { Suspense, useEffect, useState } from 'react'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import CircularProgress from '@mui/material/CircularProgress'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import StatsGrid from '../components/layout/StatsGrid'
import api from '../services/api'

const statusColors = {
  Pending: 'warning', Accepted: 'primary', InProgress: 'info',
  Completed: 'success', Cancelled: 'error',
}

// Which status buttons to show for each current status
const nextStatuses = {
  Accepted:   [{ label: 'Start Trip', status: 'InProgress' }, { label: 'Cancel', status: 'Cancelled' }],
  InProgress: [{ label: 'Complete Trip', status: 'Completed' }, { label: 'Cancel', status: 'Cancelled' }],
}

function DriverMyRidesPage() {
  const [rides, setRides]         = useState([])
  const [error, setError]         = useState('')
  const [success, setSuccess]     = useState('')
  const [completing, setCompleting] = useState(null) // ride being completed
  const [distKm, setDistKm]       = useState('')
  const [durMin, setDurMin]       = useState('')

  const fetchRides = () => api.get('/driver/rides').then((r) => setRides(r.data)).catch(() => {})
  useEffect(() => { fetchRides() }, [])

  const handleStatusChange = async (rideId, newStatus, extras = {}) => {
    setError('')
    setSuccess('')
    try {
      await api.patch(`/driver/rides/${rideId}/status`, { status: newStatus, ...extras })
      setSuccess(`Ride status updated to "${newStatus}".`)
      fetchRides()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update status.')
    }
  }

  const handleCompleteSubmit = async () => {
    if (!completing) return
    await handleStatusChange(completing.id, 'Completed', {
      distance_km:  distKm || undefined,
      duration_min: durMin || undefined,
    })
    setCompleting(null)
    setDistKm('')
    setDurMin('')
  }

  const stats = [
    { label: 'Total', value: rides.length, change: 'All your rides' },
    { label: 'Active', value: rides.filter((r) => r.status === 'InProgress').length, change: 'In progress now' },
    { label: 'Completed', value: rides.filter((r) => r.status === 'Completed').length,  change: 'Finished rides' },
  ]

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Typography variant="h4" fontWeight={700}>My Rides</Typography>
      <StatsGrid items={stats} />

      {error && <Alert severity="error" onClose={() => setError('')}>{error}</Alert>}
      {success && <Alert severity="success" onClose={() => setSuccess('')}>{success}</Alert>}

      <Paper elevation={0} sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>Assigned Rides</Typography>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Passenger</TableCell>
                <TableCell>From</TableCell>
                <TableCell>To</TableCell>
                <TableCell>Fare</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rides.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>{r.id}</TableCell>
                  <TableCell>{r.passenger?.user?.name ?? '—'} {r.passenger?.user?.last_name ?? ''}</TableCell>
                  <TableCell sx={{ maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {r.pickup_address}
                  </TableCell>
                  <TableCell sx={{ maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {r.dropoff_address}
                  </TableCell>
                  <TableCell>
                    {r.total_fare ? `€${Number(r.total_fare).toFixed(2)}` : '—'}
                  </TableCell>
                  <TableCell>
                    <Chip label={r.status} color={statusColors[r.status] ?? 'default'} size="small" />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                      {/* Status transition buttons */}
                      {nextStatuses[r.status]?.map((action) => (
                        <Button
                          key={action.status}
                          size="small"
                          variant="outlined"
                          color={action.status === 'Cancelled' ? 'error' : action.status === 'Completed' ? 'success' : 'primary'}
                          onClick={() =>
                            action.status === 'Completed'
                              ? setCompleting(r)
                              : handleStatusChange(r.id, action.status)
                          }
                        >
                          {action.label}
                        </Button>
                      ))}
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
              {rides.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center">No rides assigned yet.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Complete Trip Dialog — enter km/min for fare calculation */}
      <Dialog open={!!completing} onClose={() => setCompleting(null)} maxWidth="xs" fullWidth>
        <DialogTitle fontWeight={700}>Complete Trip</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Enter the trip details so the fare can be calculated automatically.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label="Distance (km)"
              type="number"
              inputProps={{ min: 0.1, step: 0.1 }}
              value={distKm}
              onChange={(e) => setDistKm(e.target.value)}
              fullWidth
            />
            <TextField
              label="Duration (min)"
              type="number"
              inputProps={{ min: 1 }}
              value={durMin}
              onChange={(e) => setDurMin(e.target.value)}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={() => setCompleting(null)}>Cancel</Button>
          <Button variant="contained" onClick={handleCompleteSubmit} sx={{ fontWeight: 700 }}>
            Complete &amp; Calculate Fare
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default DriverMyRidesPage
