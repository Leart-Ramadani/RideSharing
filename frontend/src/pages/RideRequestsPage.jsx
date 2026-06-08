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
import api from '../services/api'

const statusColors = { Pending: 'warning', Accepted: 'success', Cancelled: 'error' }

function RideRequestsPage() {
  const [requests, setRequests] = useState([])

  useEffect(() => {
    api.get('/ride-requests').then((r) => setRequests(r.data)).catch(() => {})
  }, [])

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box>
        <Typography variant="h4" fontWeight={700}>Ride Requests</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          View-only. Passengers create requests; drivers accept them.
        </Typography>
      </Box>

      <Paper elevation={0} sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>All Requests</Typography>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Passenger</TableCell>
                <TableCell>Pickup</TableCell>
                <TableCell>Dropoff</TableCell>
                <TableCell>Service</TableCell>
                <TableCell>Requested At</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {requests.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>{r.id}</TableCell>
                  <TableCell>
                    {r.passenger ? `${r.passenger.first_name} ${r.passenger.last_name}` : '—'}
                  </TableCell>
                  <TableCell>{r.pickup_address}</TableCell>
                  <TableCell>{r.dropoff_address}</TableCell>
                  <TableCell>{r.service_type}</TableCell>
                  <TableCell>{r.requested_at ? new Date(r.requested_at).toLocaleString() : '—'}</TableCell>
                  <TableCell>
                    <Chip label={r.status} color={statusColors[r.status] ?? 'default'} size="small" />
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

export default RideRequestsPage
