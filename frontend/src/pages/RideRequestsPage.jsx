import { useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import MenuItem from '@mui/material/MenuItem'
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

const stats = [
  { label: 'Pending Requests', value: '48', change: 'Awaiting a driver' },
  { label: 'Accepted Today', value: '312', change: '87% acceptance rate' },
  { label: 'Cancelled Today', value: '21', change: '-5 vs yesterday' },
  { label: 'Avg Wait Time', value: '3.2 min', change: 'Stable response time' },
]

const sampleRequests = [
  { id: 1, passenger: 'Sara Johnson', startAddress: 'Airport Terminal 2', endAddress: 'City Center Hotel', requestDate: '2025-04-21 08:15', serviceType: 'Standard', status: 'Accepted' },
  { id: 2, passenger: 'Niko Petrov', startAddress: 'Train Station', endAddress: 'Business Park', requestDate: '2025-04-21 09:30', serviceType: 'Premium', status: 'Pending' },
  { id: 3, passenger: 'Maria Chen', startAddress: 'University Gate', endAddress: 'Shopping Mall', requestDate: '2025-04-21 10:00', serviceType: 'Standard', status: 'Cancelled' },
]

function RideRequestsPage() {
  const [form, setForm] = useState({
    passengerId: '',
    startAddress: '',
    endAddress: '',
    serviceType: 'Standard',
    status: 'Pending',
  })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // TODO: Send POST request to /api/ride-requests
    console.log('New ride request:', form)
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Typography variant="h4" fontWeight={700}>Ride Requests</Typography>

      <StatsGrid items={stats} />

      <Paper elevation={0} sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>Ride Request List</Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Passenger</TableCell>
                <TableCell>Start Address</TableCell>
                <TableCell>End Address</TableCell>
                <TableCell>Request Date</TableCell>
                <TableCell>Service Type</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sampleRequests.map((req) => (
                <TableRow key={req.id}>
                  <TableCell>{req.id}</TableCell>
                  <TableCell>{req.passenger}</TableCell>
                  <TableCell>{req.startAddress}</TableCell>
                  <TableCell>{req.endAddress}</TableCell>
                  <TableCell>{req.requestDate}</TableCell>
                  <TableCell>{req.serviceType}</TableCell>
                  <TableCell>{req.status}</TableCell>
                  <TableCell>
                    <Button size="small">Edit</Button>
                    <Button size="small" color="error">Delete</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Paper elevation={0} sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>Add New Ride Request</Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField select label="Passenger" name="passengerId" value={form.passengerId} onChange={handleChange} fullWidth required>
                <MenuItem value="1">Sara Johnson</MenuItem>
                <MenuItem value="2">Niko Petrov</MenuItem>
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField select label="Service Type" name="serviceType" value={form.serviceType} onChange={handleChange} fullWidth>
                <MenuItem value="Standard">Standard</MenuItem>
                <MenuItem value="Premium">Premium</MenuItem>
                <MenuItem value="XL">XL</MenuItem>
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField label="Start Address" name="startAddress" value={form.startAddress} onChange={handleChange} fullWidth required />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField label="End Address" name="endAddress" value={form.endAddress} onChange={handleChange} fullWidth required />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField select label="Status" name="status" value={form.status} onChange={handleChange} fullWidth>
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="Accepted">Accepted</MenuItem>
                <MenuItem value="Cancelled">Cancelled</MenuItem>
              </TextField>
            </Grid>
          </Grid>
          <Button type="submit" variant="contained" sx={{ mt: 2 }}>Save Request</Button>
        </Box>
      </Paper>
    </Box>
  )
}

export default RideRequestsPage
