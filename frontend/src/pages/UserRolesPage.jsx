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
  { label: 'Total Assignments', value: '1,240', change: 'User-role pairs' },
  { label: 'Admin Users', value: '3', change: 'Full access granted' },
  { label: 'Driver Users', value: '342', change: 'Active role holders' },
  { label: 'Passenger Users', value: '895', change: 'Registered passengers' },
]

const sampleUserRoles = [
  { id: 1, user: 'Sara Johnson', email: 'sara@example.com', role: 'Admin' },
  { id: 2, user: 'Amina Yusuf', email: 'amina@example.com', role: 'Driver' },
  { id: 3, user: 'Niko Petrov', email: 'niko@example.com', role: 'Passenger' },
]

function UserRolesPage() {
  const [form, setForm] = useState({
    userId: '',
    roleId: '',
  })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // TODO: Send POST request to /api/user-roles
    console.log('New user-role assignment:', form)
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Typography variant="h4" fontWeight={700}>User Roles</Typography>

      <StatsGrid items={stats} />

      <Paper elevation={0} sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>User Role Assignments</Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>User</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sampleUserRoles.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.id}</TableCell>
                  <TableCell>{row.user}</TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>{row.role}</TableCell>
                  <TableCell>
                    <Button size="small" color="error">Remove</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Paper elevation={0} sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>Assign Role to User</Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField select label="Select User" name="userId" value={form.userId} onChange={handleChange} fullWidth required>
                <MenuItem value="1">Sara Johnson</MenuItem>
                <MenuItem value="2">Amina Yusuf</MenuItem>
                <MenuItem value="3">Niko Petrov</MenuItem>
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField select label="Select Role" name="roleId" value={form.roleId} onChange={handleChange} fullWidth required>
                <MenuItem value="1">Admin</MenuItem>
                <MenuItem value="2">Manager</MenuItem>
                <MenuItem value="3">Driver</MenuItem>
                <MenuItem value="4">Passenger</MenuItem>
              </TextField>
            </Grid>
          </Grid>
          <Button type="submit" variant="contained" sx={{ mt: 2 }}>Assign Role</Button>
        </Box>
      </Paper>
    </Box>
  )
}

export default UserRolesPage
