import { useEffect, useState } from 'react'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import { Link } from 'react-router-dom'
import api from '../services/api'

const statusColors = {
  Pending: 'warning', Cancelled: 'error', Accepted: 'success',
}

function PassengerMyRequestsPage() {
  const [requests, setRequests] = useState([])
  const [error, setError] = useState('')

  const fetchRequests = () =>
    api.get('/passenger/ride-requests').then((r) => setRequests(r.data)).catch(() => {})

  useEffect(() => { fetchRequests() }, [])

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this ride request?')) return
    try {
      await api.patch(`/passenger/ride-requests/${id}/cancel`)
      fetchRequests()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to cancel request.')
    }
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h4" fontWeight={700}>My Requests</Typography>
        <Button component={Link} to="/passenger/request" variant="contained">+ New Request</Button>
      </Box>

      {error && <Alert severity="error">{error}</Alert>}

      <Paper elevation={0} sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>Ride Requests</Typography>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Pickup</TableCell>
                <TableCell>Dropoff</TableCell>
                <TableCell>Service</TableCell>
                <TableCell>Requested At</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {requests.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>{r.id}</TableCell>
                  <TableCell>{r.pickup_address}</TableCell>
                  <TableCell>{r.dropoff_address}</TableCell>
                  <TableCell>{r.service_type}</TableCell>
                  <TableCell>{r.requested_at ? new Date(r.requested_at).toLocaleString() : '—'}</TableCell>
                  <TableCell>
                    <Chip label={r.status} color={statusColors[r.status] ?? 'default'} size="small" />
                  </TableCell>
                  <TableCell>
                    {r.status === 'Pending' && (
                      <Button size="small" color="error" onClick={() => handleCancel(r.id)}>
                        Cancel
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {requests.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center">No requests found.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  )
}

export default PassengerMyRequestsPage
