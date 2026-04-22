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
  { label: 'Total Rides Today', value: '2,481', change: '+8.4% vs yesterday' },
  { label: 'Active Rides', value: '126', change: 'Currently in progress' },
  { label: 'Completed Today', value: '2,312', change: '93% completion rate' },
  { label: 'Cancelled Today', value: '64', change: '-6 since yesterday' },
]

const sampleRides = [
  { id: 1, passenger: 'Sara Johnson', driver: 'Amina Yusuf', vehicle: 'Toyota Prius', startAddress: 'Airport Terminal 1', endAddress: 'Downtown Hotel', distanceKm: '12.4', durationMin: '22', status: 'Completed' },
  { id: 2, passenger: 'Niko Petrov', driver: 'Daniel Cruz', vehicle: 'Tesla Model 3', startAddress: 'Train Station', endAddress: 'Business Park', distanceKm: '7.2', durationMin: '15', status: 'In Progress' },
  { id: 3, passenger: 'Maria Chen', driver: 'Layla Nasser', vehicle: 'Honda City', startAddress: 'University Campus', endAddress: 'Shopping Mall', distanceKm: '5.8', durationMin: '12', status: 'Completed' },
]

function RidesPage() {
  const [form, setForm] = useState({
    passengerId: '',
    driverId: '',
    vehicleId: '',
    startAddress: '',
    endAddress: '',
    distanceKm: '',
    durationMin: '',
    status: 'Pending',
  })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // TODO: Send POST request to /api/rides
    console.log('New ride:', form)
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Typography variant="h4" fontWeight={700}>Rides</Typography>

      <StatsGrid items={stats} />

      <Paper elevation={0} sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>Ride List</Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Passenger</TableCell>
                <TableCell>Driver</TableCell>
                <TableCell>Vehicle</TableCell>
                <TableCell>Start Address</TableCell>
                <TableCell>End Address</TableCell>
                <TableCell>Distance (km)</TableCell>
                <TableCell>Duration (min)</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sampleRides.map((ride) => (
                <TableRow key={ride.id}>
                  <TableCell>{ride.id}</TableCell>
                  <TableCell>{ride.passenger}</TableCell>
                  <TableCell>{ride.driver}</TableCell>
                  <TableCell>{ride.vehicle}</TableCell>
                  <TableCell>{ride.startAddress}</TableCell>
                  <TableCell>{ride.endAddress}</TableCell>
                  <TableCell>{ride.distanceKm}</TableCell>
                  <TableCell>{ride.durationMin}</TableCell>
                  <TableCell>{ride.status}</TableCell>
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
        <Typography variant="h6" fontWeight={600} gutterBottom>Add New Ride</Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField select label="Passenger" name="passengerId" value={form.passengerId} onChange={handleChange} fullWidth required>
                <MenuItem value="1">Sara Johnson</MenuItem>
                <MenuItem value="2">Niko Petrov</MenuItem>
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField select label="Driver" name="driverId" value={form.driverId} onChange={handleChange} fullWidth required>
                <MenuItem value="1">Amina Yusuf</MenuItem>
                <MenuItem value="2">Daniel Cruz</MenuItem>
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField select label="Vehicle" name="vehicleId" value={form.vehicleId} onChange={handleChange} fullWidth required>
                <MenuItem value="1">Toyota Prius (RS-2041)</MenuItem>
                <MenuItem value="2">Tesla Model 3 (EV-1032)</MenuItem>
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField select label="Status" name="status" value={form.status} onChange={handleChange} fullWidth>
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="In Progress">In Progress</MenuItem>
                <MenuItem value="Completed">Completed</MenuItem>
                <MenuItem value="Cancelled">Cancelled</MenuItem>
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField label="Start Address" name="startAddress" value={form.startAddress} onChange={handleChange} fullWidth required />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField label="End Address" name="endAddress" value={form.endAddress} onChange={handleChange} fullWidth required />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField label="Distance (km)" name="distanceKm" type="number" value={form.distanceKm} onChange={handleChange} fullWidth />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField label="Duration (minutes)" name="durationMin" type="number" value={form.durationMin} onChange={handleChange} fullWidth />
            </Grid>
          </Grid>
          <Button type="submit" variant="contained" sx={{ mt: 2 }}>Save Ride</Button>
        </Box>
      </Paper>
    </Box>
  )
}

export default RidesPage
