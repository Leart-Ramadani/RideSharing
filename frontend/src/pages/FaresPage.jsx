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
  { label: 'Total Fare Types', value: '3', change: 'Standard, Premium, XL' },
  { label: 'Active Fares', value: '3', change: 'All currently active' },
  { label: 'Base Price (min)', value: '$2.00', change: 'Standard fare' },
  { label: 'Peak Multiplier', value: '1.5x', change: 'Applies 7-9am, 5-7pm' },
]

const sampleFares = [
  { id: 1, serviceType: 'Standard', basePrice: '$2.00', pricePerKm: '$0.80', pricePerMin: '$0.15', peakHourRate: '$1.20', status: 'Active' },
  { id: 2, serviceType: 'Premium', basePrice: '$5.00', pricePerKm: '$1.50', pricePerMin: '$0.30', peakHourRate: '$2.00', status: 'Active' },
  { id: 3, serviceType: 'XL', basePrice: '$4.00', pricePerKm: '$1.20', pricePerMin: '$0.25', peakHourRate: '$1.80', status: 'Active' },
]

function FaresPage() {
  const [form, setForm] = useState({
    serviceType: '',
    basePrice: '',
    pricePerKm: '',
    pricePerMin: '',
    peakHourRate: '',
    status: 'Active',
  })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // TODO: Send POST request to /api/fares
    console.log('New fare:', form)
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Typography variant="h4" fontWeight={700}>Fares</Typography>

      <StatsGrid items={stats} />

      <Paper elevation={0} sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>Fare List</Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Service Type</TableCell>
                <TableCell>Base Price</TableCell>
                <TableCell>Price per km</TableCell>
                <TableCell>Price per min</TableCell>
                <TableCell>Peak Hour Rate</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sampleFares.map((fare) => (
                <TableRow key={fare.id}>
                  <TableCell>{fare.id}</TableCell>
                  <TableCell>{fare.serviceType}</TableCell>
                  <TableCell>{fare.basePrice}</TableCell>
                  <TableCell>{fare.pricePerKm}</TableCell>
                  <TableCell>{fare.pricePerMin}</TableCell>
                  <TableCell>{fare.peakHourRate}</TableCell>
                  <TableCell>{fare.status}</TableCell>
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
        <Typography variant="h6" fontWeight={600} gutterBottom>Add New Fare</Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField select label="Service Type" name="serviceType" value={form.serviceType} onChange={handleChange} fullWidth required>
                <MenuItem value="Standard">Standard</MenuItem>
                <MenuItem value="Premium">Premium</MenuItem>
                <MenuItem value="XL">XL</MenuItem>
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField label="Base Price ($)" name="basePrice" type="number" value={form.basePrice} onChange={handleChange} fullWidth required />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField label="Price per km ($)" name="pricePerKm" type="number" value={form.pricePerKm} onChange={handleChange} fullWidth required />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField label="Price per minute ($)" name="pricePerMin" type="number" value={form.pricePerMin} onChange={handleChange} fullWidth required />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField label="Peak Hour Rate ($)" name="peakHourRate" type="number" value={form.peakHourRate} onChange={handleChange} fullWidth />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField select label="Status" name="status" value={form.status} onChange={handleChange} fullWidth>
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Inactive">Inactive</MenuItem>
              </TextField>
            </Grid>
          </Grid>
          <Button type="submit" variant="contained" sx={{ mt: 2 }}>Save Fare</Button>
        </Box>
      </Paper>
    </Box>
  )
}

export default FaresPage
