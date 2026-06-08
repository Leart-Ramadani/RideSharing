import { useEffect, useState } from 'react'
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
import Rating from '@mui/material/Rating'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import StarRoundedIcon from '@mui/icons-material/StarRounded'
import StatsGrid from '../components/layout/StatsGrid'
import api from '../services/api'

const statusColors = {
  Pending: 'warning', Accepted: 'primary', InProgress: 'info',
  Completed: 'success', Cancelled: 'error',
}

function PassengerMyRidesPage() {
  const [rides, setRides]                   = useState([])
  const [ratingRide, setRatingRide]         = useState(null)
  const [score, setScore]                   = useState(5)
  const [comment, setComment]               = useState('')
  const [ratingLoading, setRatingLoading]   = useState(false)
  const [ratingError, setRatingError]       = useState('')
  const [success, setSuccess]               = useState('')

  const fetchRides = () => {
    api.get('/passenger/rides').then((r) => setRides(r.data)).catch(() => {})
  }
  useEffect(() => { fetchRides() }, [])

  const stats = [
    { label: 'Total Rides',  value: rides.length, change: 'All time' },
    { label: 'Completed',    value: rides.filter((r) => r.status === 'Completed').length, change: 'Finished rides' },
    { label: 'Cancelled',    value: rides.filter((r) => r.status === 'Cancelled').length, change: 'Cancelled rides' },
    {
      label: 'Total Spent',
      value: `€${rides.filter((r) => r.total_fare).reduce((s, r) => s + Number(r.total_fare), 0).toFixed(2)}`,
      change: 'Wallet payments',
    },
  ]

  const handleRateOpen = (ride) => {
    setRatingRide(ride)
    setScore(5)
    setComment('')
    setRatingError('')
  }

  const handleRateSubmit = async () => {
    setRatingLoading(true)
    setRatingError('')
    try {
      await api.post(`/passenger/rides/${ratingRide.id}/rate`, { score, comment })
      setSuccess('Rating submitted. Thank you!')
      setRatingRide(null)
      fetchRides()
    } catch (err) {
      const errs = err.response?.data?.errors
      setRatingError(errs ? Object.values(errs).flat().join(' ') : err.response?.data?.message ?? 'Failed.')
    } finally {
      setRatingLoading(false)
    }
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Typography variant="h4" fontWeight={700}>My Rides</Typography>

      <StatsGrid items={stats} />

      {success && <Alert severity="success" onClose={() => setSuccess('')}>{success}</Alert>}

      <Paper elevation={0} sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>Ride History</Typography>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Driver</TableCell>
                <TableCell>From</TableCell>
                <TableCell>To</TableCell>
                <TableCell>Fare</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Rate</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rides.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">No rides yet.</TableCell>
                </TableRow>
              ) : rides.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>{r.id}</TableCell>
                  <TableCell>
                    {r.driver?.user ? `${r.driver.user.name} ${r.driver.user.last_name}` : '—'}
                  </TableCell>
                  <TableCell sx={{ maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {r.pickup_address}
                  </TableCell>
                  <TableCell sx={{ maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {r.dropoff_address}
                  </TableCell>
                  <TableCell>
                    {r.total_fare ? `€${Number(r.total_fare).toFixed(2)}` : '—'}
                  </TableCell>
                  <TableCell>
                    <Chip label={r.status} color={statusColors[r.status] ?? 'default'} size="small" />
                  </TableCell>
                  <TableCell>
                    {r.status === 'Completed' && !r.already_rated ? (
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<StarRoundedIcon />}
                        onClick={() => handleRateOpen(r)}
                      >
                        Rate
                      </Button>
                    ) : r.already_rated ? (
                      <Chip label="Rated" color="success" size="small" variant="outlined" />
                    ) : '—'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Rating Dialog */}
      <Dialog open={!!ratingRide} onClose={() => setRatingRide(null)} maxWidth="xs" fullWidth>
        <DialogTitle fontWeight={700}>Rate Your Driver</DialogTitle>
        <DialogContent>
          {ratingError && <Alert severity="error" sx={{ mb: 2 }}>{ratingError}</Alert>}
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            How was your experience with{' '}
            <strong>
              {ratingRide?.driver?.user?.name} {ratingRide?.driver?.user?.last_name}
            </strong>
            ?
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <Rating
              value={score}
              onChange={(_, newVal) => setScore(newVal)}
              size="large"
            />
          </Box>
          <TextField
            label="Comment (optional)"
            multiline
            rows={3}
            fullWidth
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Tell us about your experience..."
          />
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={() => setRatingRide(null)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleRateSubmit}
            disabled={ratingLoading}
            sx={{ fontWeight: 700 }}
          >
            {ratingLoading ? <CircularProgress size={20} color="inherit" /> : 'Submit Rating'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default PassengerMyRidesPage
