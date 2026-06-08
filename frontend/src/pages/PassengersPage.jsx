import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
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

function PassengersPage() {
  const [passengers, setPassengers] = useState([])

  useEffect(() => {
    api.get('/passengers').then((r) => setPassengers(r.data)).catch(() => {})
  }, [])

  const stats = [
    { label: 'Total Passengers', value: passengers.length, change: 'Registered passengers' },
    {
      label: 'Avg Rating',
      value: passengers.length
        ? (passengers.reduce((s, p) => s + parseFloat(p.average_rating || 0), 0) / passengers.length).toFixed(1)
        : '—',
      change: 'Across all passengers',
    },
  ]

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Typography variant="h4" fontWeight={700}>Passengers</Typography>
      <StatsGrid items={stats} />

      <Paper elevation={0} sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>Passenger List</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Passengers are created through registration only.
        </Typography>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Registered</TableCell>
                <TableCell>Rating</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {passengers.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>{p.id}</TableCell>
                  <TableCell>{p.first_name} {p.user?.last_name}</TableCell>
                  <TableCell>{p.email}</TableCell>
                  <TableCell>{p.phone}</TableCell>
                  <TableCell>{p.registered_at}</TableCell>
                  <TableCell>{p.average_rating ?? '—'}</TableCell>
                </TableRow>
              ))}
              {passengers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center">No passengers registered yet.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  )
}

export default PassengersPage
