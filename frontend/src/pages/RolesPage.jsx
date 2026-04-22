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
  { label: 'Total Roles', value: '4', change: 'Defined in system' },
  { label: 'Admin Roles', value: '1', change: 'Full access' },
  { label: 'Manager Roles', value: '1', change: 'Operational access' },
  { label: 'Custom Roles', value: '2', change: 'Driver, Passenger' },
]

const sampleRoles = [
  { id: 1, name: 'Admin', description: 'Full access to the entire system', normalizedName: 'ADMIN' },
  { id: 2, name: 'Manager', description: 'Manages operations and drivers', normalizedName: 'MANAGER' },
  { id: 3, name: 'Driver', description: 'Access to driver-specific features', normalizedName: 'DRIVER' },
  { id: 4, name: 'Passenger', description: 'Access to passenger-specific features', normalizedName: 'PASSENGER' },
]

function RolesPage() {
  const [form, setForm] = useState({
    name: '',
    description: '',
    normalizedName: '',
  })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // TODO: Send POST request to /api/roles
    console.log('New role:', form)
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Typography variant="h4" fontWeight={700}>Roles</Typography>

      <StatsGrid items={stats} />

      <Paper elevation={0} sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>Role List</Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Role Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Normalized Name</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sampleRoles.map((role) => (
                <TableRow key={role.id}>
                  <TableCell>{role.id}</TableCell>
                  <TableCell>{role.name}</TableCell>
                  <TableCell>{role.description}</TableCell>
                  <TableCell>{role.normalizedName}</TableCell>
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
        <Typography variant="h6" fontWeight={600} gutterBottom>Add New Role</Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField label="Role Name" name="name" value={form.name} onChange={handleChange} fullWidth required />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField label="Normalized Name" name="normalizedName" value={form.normalizedName} onChange={handleChange} fullWidth />
            </Grid>
            <Grid size={12}>
              <TextField label="Description" name="description" value={form.description} onChange={handleChange} fullWidth multiline rows={2} />
            </Grid>
          </Grid>
          <Button type="submit" variant="contained" sx={{ mt: 2 }}>Save Role</Button>
        </Box>
      </Paper>
    </Box>
  )
}

export default RolesPage
