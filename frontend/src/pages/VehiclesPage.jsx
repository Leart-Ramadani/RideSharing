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
  { label: 'Total Vehicles', value: '312', change: '+10 added this month' },
  { label: 'Available', value: '289', change: 'Ready for dispatch' },
  { label: 'In Maintenance', value: '23', change: '6 urgent repairs' },
  { label: 'Unassigned', value: '11', change: 'No driver assigned' },
]

const sampleVehicles = [
  { id: 1, driver: 'Amina Yusuf', brand: 'Toyota', model: 'Prius', year: '2022', color: 'White', plate: 'RS-2041', seats: 4, fuelType: 'Hybrid', status: 'Active' },
  { id: 2, driver: 'Daniel Cruz', brand: 'Tesla', model: 'Model 3', year: '2023', color: 'Black', plate: 'EV-1032', seats: 5, fuelType: 'Electric', status: 'Active' },
  { id: 3, driver: 'Unassigned', brand: 'Hyundai', model: 'Accent', year: '2020', color: 'Silver', plate: 'HY-5521', seats: 5, fuelType: 'Petrol', status: 'Maintenance' },
]

function VehiclesPage() {
  const [form, setForm] = useState({
    driverId: '',
    brand: '',
    model: '',
    year: '',
    color: '',
    plate: '',
    seats: '',
    fuelType: 'Petrol',
    status: 'Active',
  })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // TODO: Send POST request to /api/vehicles
    console.log('New vehicle:', form)
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Typography variant="h4" fontWeight={700}>Vehicles</Typography>

      <StatsGrid items={stats} />

      <Paper elevation={0} sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>Vehicle List</Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Driver</TableCell>
                <TableCell>Brand</TableCell>
                <TableCell>Model</TableCell>
                <TableCell>Year</TableCell>
                <TableCell>Color</TableCell>
                <TableCell>Plate</TableCell>
                <TableCell>Seats</TableCell>
                <TableCell>Fuel Type</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sampleVehicles.map((v) => (
                <TableRow key={v.id}>
                  <TableCell>{v.id}</TableCell>
                  <TableCell>{v.driver}</TableCell>
                  <TableCell>{v.brand}</TableCell>
                  <TableCell>{v.model}</TableCell>
                  <TableCell>{v.year}</TableCell>
                  <TableCell>{v.color}</TableCell>
                  <TableCell>{v.plate}</TableCell>
                  <TableCell>{v.seats}</TableCell>
                  <TableCell>{v.fuelType}</TableCell>
                  <TableCell>{v.status}</TableCell>
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
        <Typography variant="h6" fontWeight={600} gutterBottom>Add New Vehicle</Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField select label="Driver" name="driverId" value={form.driverId} onChange={handleChange} fullWidth required>
                <MenuItem value="1">Amina Yusuf</MenuItem>
                <MenuItem value="2">Daniel Cruz</MenuItem>
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField label="Brand" name="brand" value={form.brand} onChange={handleChange} fullWidth required />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField label="Model" name="model" value={form.model} onChange={handleChange} fullWidth required />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField label="Year" name="year" type="number" value={form.year} onChange={handleChange} fullWidth />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField label="Color" name="color" value={form.color} onChange={handleChange} fullWidth />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField label="Plate Number" name="plate" value={form.plate} onChange={handleChange} fullWidth />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField label="Number of Seats" name="seats" type="number" value={form.seats} onChange={handleChange} fullWidth />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField select label="Fuel Type" name="fuelType" value={form.fuelType} onChange={handleChange} fullWidth>
                <MenuItem value="Petrol">Petrol</MenuItem>
                <MenuItem value="Diesel">Diesel</MenuItem>
                <MenuItem value="Electric">Electric</MenuItem>
                <MenuItem value="Hybrid">Hybrid</MenuItem>
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField select label="Status" name="status" value={form.status} onChange={handleChange} fullWidth>
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Maintenance">Maintenance</MenuItem>
                <MenuItem value="Inactive">Inactive</MenuItem>
              </TextField>
            </Grid>
          </Grid>
          <Button type="submit" variant="contained" sx={{ mt: 2 }}>Save Vehicle</Button>
        </Box>
      </Paper>
    </Box>
  )
}

export default VehiclesPage
