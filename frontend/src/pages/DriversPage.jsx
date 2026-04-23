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
  { label: 'Total Drivers', value: '342', change: '+14 added this week' },
  { label: 'Active Drivers', value: '298', change: 'Currently online' },
  { label: 'Suspended Drivers', value: '7', change: '-2 from last week' },
  { label: 'Average Rating', value: '4.8', change: 'Across all drivers' },
]

const sampleDrivers = [
  { id: 1, firstName: 'Amina', lastName: 'Yusuf', email: 'amina@example.com', phone: '0681234567', licenseNo: 'DL-2021-001', licenseExpiry: '2026-05-01', avgRating: '4.9', status: 'Active' },
  { id: 2, firstName: 'Daniel', lastName: 'Cruz', email: 'daniel@example.com', phone: '0692345678', licenseNo: 'DL-2020-042', licenseExpiry: '2025-11-30', avgRating: '4.6', status: 'Active' },
  { id: 3, firstName: 'Layla', lastName: 'Nasser', email: 'layla@example.com', phone: '0673456789', licenseNo: 'DL-2019-087', licenseExpiry: '2024-08-15', avgRating: '4.7', status: 'Suspended' },
]

function DriversPage() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    licenseNo: '',
    licenseExpiry: '',
    status: 'Active',
  })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // TODO: Send POST request to /api/drivers
    console.log('New driver:', form)
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Typography variant="h4" fontWeight={700}>Drivers</Typography>

      <StatsGrid items={stats} />

      <Paper elevation={0} sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>Driver List</Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>First Name</TableCell>
                <TableCell>Last Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>License No.</TableCell>
                <TableCell>License Expiry</TableCell>
                <TableCell>Avg Rating</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sampleDrivers.map((driver) => (
                <TableRow key={driver.id}>
                  <TableCell>{driver.id}</TableCell>
                  <TableCell>{driver.firstName}</TableCell>
                  <TableCell>{driver.lastName}</TableCell>
                  <TableCell>{driver.email}</TableCell>
                  <TableCell>{driver.phone}</TableCell>
                  <TableCell>{driver.licenseNo}</TableCell>
                  <TableCell>{driver.licenseExpiry}</TableCell>
                  <TableCell>{driver.avgRating}</TableCell>
                  <TableCell>{driver.status}</TableCell>
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
        <Typography variant="h6" fontWeight={600} gutterBottom>Add New Driver</Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField label="First Name" name="firstName" value={form.firstName} onChange={handleChange} fullWidth required />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField label="Last Name" name="lastName" value={form.lastName} onChange={handleChange} fullWidth required />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField label="Email" name="email" type="email" value={form.email} onChange={handleChange} fullWidth required />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField label="Phone" name="phone" value={form.phone} onChange={handleChange} fullWidth />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField label="License Number" name="licenseNo" value={form.licenseNo} onChange={handleChange} fullWidth />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField label="License Expiry Date" name="licenseExpiry" type="date" value={form.licenseExpiry} onChange={handleChange} fullWidth InputLabelProps={{ shrink: true }} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField select label="Status" name="status" value={form.status} onChange={handleChange} fullWidth>
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Suspended">Suspended</MenuItem>
                <MenuItem value="Inactive">Inactive</MenuItem>
              </TextField>
            </Grid>
          </Grid>
          <Button type="submit" variant="contained" sx={{ mt: 2 }}>Save Driver</Button>
        </Box>
      </Paper>
    </Box>
  )
}

export default DriversPage
