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
  { label: 'Total Locations', value: '84', change: '+3 added this week' },
  { label: 'Pickup Zones', value: '42', change: 'Active zones' },
  { label: 'Drop-off Zones', value: '31', change: 'Active zones' },
  { label: 'Custom Points', value: '11', change: 'Landmarks & hubs' },
]

const sampleLocations = [
  { id: 1, name: 'International Airport', address: 'Airport Road, Terminal 1', latitude: '41.3275', longitude: '19.8187', type: 'Pickup Zone' },
  { id: 2, name: 'Central Train Station', address: 'Station Square 1', latitude: '41.3312', longitude: '19.8345', type: 'Pickup Zone' },
  { id: 3, name: 'City Center Mall', address: 'Main Boulevard 22', latitude: '41.3290', longitude: '19.8201', type: 'Drop-off Zone' },
]

function LocationsPage() {
  const [form, setForm] = useState({
    name: '',
    address: '',
    latitude: '',
    longitude: '',
    type: 'Pickup Zone',
  })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // TODO: Send POST request to /api/locations
    console.log('New location:', form)
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Typography variant="h4" fontWeight={700}>Locations</Typography>

      <StatsGrid items={stats} />

      <Paper elevation={0} sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>Location List</Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Address</TableCell>
                <TableCell>Latitude</TableCell>
                <TableCell>Longitude</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sampleLocations.map((loc) => (
                <TableRow key={loc.id}>
                  <TableCell>{loc.id}</TableCell>
                  <TableCell>{loc.name}</TableCell>
                  <TableCell>{loc.address}</TableCell>
                  <TableCell>{loc.latitude}</TableCell>
                  <TableCell>{loc.longitude}</TableCell>
                  <TableCell>{loc.type}</TableCell>
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
        <Typography variant="h6" fontWeight={600} gutterBottom>Add New Location</Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField label="Location Name" name="name" value={form.name} onChange={handleChange} fullWidth required />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField select label="Type" name="type" value={form.type} onChange={handleChange} fullWidth>
                <MenuItem value="Pickup Zone">Pickup Zone</MenuItem>
                <MenuItem value="Drop-off Zone">Drop-off Zone</MenuItem>
                <MenuItem value="Landmark">Landmark</MenuItem>
                <MenuItem value="Hub">Hub</MenuItem>
              </TextField>
            </Grid>
            <Grid size={12}>
              <TextField label="Address" name="address" value={form.address} onChange={handleChange} fullWidth required />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField label="Latitude" name="latitude" type="number" value={form.latitude} onChange={handleChange} fullWidth />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField label="Longitude" name="longitude" type="number" value={form.longitude} onChange={handleChange} fullWidth />
            </Grid>
          </Grid>
          <Button type="submit" variant="contained" sx={{ mt: 2 }}>Save Location</Button>
        </Box>
      </Paper>
    </Box>
  )
}

export default LocationsPage
