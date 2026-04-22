import { useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
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
  { label: 'Total Passengers', value: '8,420', change: '+184 this week' },
  { label: 'Active Passengers', value: '7,910', change: '94% of total' },
  { label: 'New This Month', value: '256', change: '+9% vs last month' },
  { label: 'Average Rating', value: '4.7', change: 'Passenger quality score' },
]

const samplePassengers = [
  { id: 1, firstName: 'Sara', lastName: 'Johnson', email: 'sara@example.com', phone: '0681234567', registrationDate: '2024-01-15', avgRating: '4.8' },
  { id: 2, firstName: 'Niko', lastName: 'Petrov', email: 'niko@example.com', phone: '0692345678', registrationDate: '2024-03-22', avgRating: '4.5' },
  { id: 3, firstName: 'Maria', lastName: 'Chen', email: 'maria@example.com', phone: '0673456789', registrationDate: '2023-11-08', avgRating: '4.9' },
]

function PassengersPage() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // TODO: Send POST request to /api/passengers
    console.log('New passenger:', form)
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Typography variant="h4" fontWeight={700}>Passengers</Typography>

      <StatsGrid items={stats} />

      <Paper elevation={0} sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>Passenger List</Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>First Name</TableCell>
                <TableCell>Last Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Registration Date</TableCell>
                <TableCell>Avg Rating</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {samplePassengers.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>{p.id}</TableCell>
                  <TableCell>{p.firstName}</TableCell>
                  <TableCell>{p.lastName}</TableCell>
                  <TableCell>{p.email}</TableCell>
                  <TableCell>{p.phone}</TableCell>
                  <TableCell>{p.registrationDate}</TableCell>
                  <TableCell>{p.avgRating}</TableCell>
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
        <Typography variant="h6" fontWeight={600} gutterBottom>Add New Passenger</Typography>
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
          </Grid>
          <Button type="submit" variant="contained" sx={{ mt: 2 }}>Save Passenger</Button>
        </Box>
      </Paper>
    </Box>
  )
}

export default PassengersPage
