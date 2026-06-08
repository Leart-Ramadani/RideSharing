import { useEffect, useState } from 'react'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import CircularProgress from '@mui/material/CircularProgress'
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
import api from '../services/api'

const emptyForm = {
  name: '', last_name: '', email: '', phone_number: '', password: '',
  license_number: '', license_expiry: '', status: 'Active',
}

function DriversPage() {
  const [drivers, setDrivers] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editId, setEditId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchDrivers = () => api.get('/drivers').then((r) => setDrivers(r.data)).catch(() => {})
  useEffect(() => { fetchDrivers() }, [])

  const stats = [
    { label: 'Total Drivers', value: drivers.length, change: 'All registered drivers' },
    { label: 'Active', value: drivers.filter((d) => d.status === 'Active').length, change: 'Currently active' },
    { label: 'Avg Rating', value: drivers.length ? (drivers.reduce((s, d) => s + parseFloat(d.average_rating || 0), 0) / drivers.length).toFixed(1) : '—', change: 'Across all drivers' },
  ]

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (editId) {
        // On update, don't send password unless filled
        const payload = { ...form }
        if (!payload.password) delete payload.password
        await api.put(`/drivers/${editId}`, payload)
      } else {
        await api.post('/drivers', form)
      }
      setForm(emptyForm)
      setEditId(null)
      fetchDrivers()
    } catch (err) {
      const errs = err.response?.data?.errors
      setError(errs ? Object.values(errs).flat().join(' ') : 'An error occurred.')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (d) => {
    setEditId(d.id)
    setForm({
      name: d.user?.name ?? '',
      last_name: d.user?.last_name ?? '',
      email: d.user?.email ?? '',
      phone_number: d.user?.phone_number ?? '',
      password: '',
      license_number: d.license_number ?? '',
      license_expiry: d.license_expiry ?? '',
      status: d.status ?? 'Active',
    })
  }

  const handleDelete = async (id) => {
    if (window.confirm('Delete this driver and their user account?')) {
      await api.delete(`/drivers/${id}`)
      fetchDrivers()
    }
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Typography variant="h4" fontWeight={700}>Drivers</Typography>
      <StatsGrid items={stats} />

      <Paper elevation={0} sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>Driver List</Typography>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>License No.</TableCell>
                <TableCell>Expiry</TableCell>
                <TableCell>Rating</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {drivers.map((d) => (
                <TableRow key={d.id}>
                  <TableCell>{d.id}</TableCell>
                  <TableCell>{d.user?.name} {d.user?.last_name}</TableCell>
                  <TableCell>{d.user?.email}</TableCell>
                  <TableCell>{d.user?.phone_number}</TableCell>
                  <TableCell>{d.license_number}</TableCell>
                  <TableCell>{d.license_expiry}</TableCell>
                  <TableCell>{d.average_rating ?? '—'}</TableCell>
                  <TableCell>
                    <Chip label={d.status} color={d.status === 'Active' ? 'success' : 'warning'} size="small" />
                  </TableCell>
                  <TableCell>
                    <Button size="small" onClick={() => handleEdit(d)}>Edit</Button>
                    <Button size="small" color="error" onClick={() => handleDelete(d.id)}>Delete</Button>
                  </TableCell>
                </TableRow>
              ))}
              {drivers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} align="center">No drivers found.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Paper elevation={0} sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          {editId ? 'Edit Driver' : 'Add New Driver'}
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid size={4}>
              <TextField label="First Name" name="name" value={form.name} onChange={handleChange} fullWidth required />
            </Grid>
            <Grid size={4}>
              <TextField label="Last Name" name="last_name" value={form.last_name} onChange={handleChange} fullWidth required />
            </Grid>
            <Grid size={4}>
              <TextField label="Email" name="email" type="email" value={form.email} onChange={handleChange} fullWidth required={!editId} disabled={!!editId} />
            </Grid>
            <Grid size={4}>
              <TextField label="Phone Number" name="phone_number" value={form.phone_number} onChange={handleChange} fullWidth required />
            </Grid>
            <Grid size={4}>
              <TextField label={editId ? 'New Password (leave blank to keep)' : 'Password'} name="password" type="password"
                value={form.password} onChange={handleChange} fullWidth required={!editId} />
            </Grid>
            <Grid size={4}>
              <TextField select label="Status" name="status" value={form.status} onChange={handleChange} fullWidth>
                {['Active', 'Suspended', 'Inactive'].map((s) => (
                  <MenuItem key={s} value={s}>{s}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={6}>
              <TextField label="License Number" name="license_number" value={form.license_number} onChange={handleChange} fullWidth required />
            </Grid>
            <Grid size={6}>
              <TextField label="License Expiry" name="license_expiry" type="date" value={form.license_expiry}
                onChange={handleChange} fullWidth required InputLabelProps={{ shrink: true }} />
            </Grid>
            <Grid size={12}>
              <Button type="submit" variant="contained" disabled={loading}>
                {loading ? <CircularProgress size={20} color="inherit" /> : editId ? 'Update Driver' : 'Add Driver'}
              </Button>
              {editId && (
                <Button sx={{ ml: 1 }} onClick={() => { setEditId(null); setForm(emptyForm) }}>
                  Cancel
                </Button>
              )}
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  )
}

export default DriversPage
