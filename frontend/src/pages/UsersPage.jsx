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

const emptyForm = { name: '', last_name: '', email: '', phone_number: '', password: '', status: 'Active' }

function UsersPage() {
  const [users, setUsers] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editId, setEditId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchUsers = () => api.get('/users').then((r) => setUsers(r.data)).catch(() => {})
  useEffect(() => { fetchUsers() }, [])

  const stats = [
    { label: 'Total Users', value: users.length, change: 'All registered accounts' },
    { label: 'Active', value: users.filter((u) => u.status === 'Active').length, change: 'Currently active' },
    { label: 'Suspended', value: users.filter((u) => u.status === 'Suspended').length, change: 'Suspended accounts' },
  ]

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true)
    try {
      editId ? await api.put(`/users/${editId}`, form) : await api.post('/users', form)
      setForm(emptyForm); setEditId(null); fetchUsers()
    } catch (err) {
      const errs = err.response?.data?.errors
      setError(errs ? Object.values(errs).flat().join(' ') : 'An error occurred.')
    } finally { setLoading(false) }
  }

  const handleEdit = (u) => {
    setEditId(u.id)
    setForm({ name: u.name, last_name: u.last_name, email: u.email, phone_number: u.phone_number ?? '', password: '', status: u.status })
  }

  const handleDelete = async (id) => {
    if (confirm('Delete this user?')) { await api.delete(`/users/${id}`); fetchUsers() }
  }
  const handleToggle = async (u) => { await api.patch(`/users/${u.id}/toggle-status`); fetchUsers() }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Typography variant="h4" fontWeight={700}>Users</Typography>
      <StatsGrid items={stats} />

      <Paper elevation={0} sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>User List</Typography>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell><TableCell>First Name</TableCell><TableCell>Last Name</TableCell>
                <TableCell>Email</TableCell><TableCell>Phone</TableCell><TableCell>Roles</TableCell>
                <TableCell>Status</TableCell><TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((u) => (
                <TableRow key={u.id}>
                  <TableCell>{u.id}</TableCell>
                  <TableCell>{u.name}</TableCell>
                  <TableCell>{u.last_name}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>{u.phone_number}</TableCell>
                  <TableCell>{u.roles?.map((r) => r.name).join(', ') || '—'}</TableCell>
                  <TableCell><Chip label={u.status} color={u.status === 'Active' ? 'success' : 'error'} size="small" /></TableCell>
                  <TableCell>
                    <Button size="small" onClick={() => handleEdit(u)}>Edit</Button>
                    <Button size="small" onClick={() => handleToggle(u)}>{u.status === 'Active' ? 'Suspend' : 'Activate'}</Button>
                    <Button size="small" color="error" onClick={() => handleDelete(u.id)}>Delete</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Paper elevation={0} sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>{editId ? 'Edit User' : 'Add New User'}</Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid size={6}><TextField label="First Name" name="name" value={form.name} onChange={handleChange} fullWidth required /></Grid>
            <Grid size={6}><TextField label="Last Name" name="last_name" value={form.last_name} onChange={handleChange} fullWidth required /></Grid>
            <Grid size={6}><TextField label="Email" name="email" type="email" value={form.email} onChange={handleChange} fullWidth required /></Grid>
            <Grid size={6}><TextField label="Phone" name="phone_number" value={form.phone_number} onChange={handleChange} fullWidth /></Grid>
            <Grid size={6}><TextField label="Password" name="password" type="password" value={form.password} onChange={handleChange} fullWidth placeholder={editId ? 'Leave blank to keep' : ''} /></Grid>
            <Grid size={6}>
              <TextField select label="Status" name="status" value={form.status} onChange={handleChange} fullWidth>
                {['Active', 'Suspended', 'Inactive'].map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid size={12}>
              <Button type="submit" variant="contained" disabled={loading}>
                {loading ? <CircularProgress size={20} color="inherit" /> : editId ? 'Update User' : 'Add User'}
              </Button>
              {editId && <Button sx={{ ml: 1 }} onClick={() => { setEditId(null); setForm(emptyForm) }}>Cancel</Button>}
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  )
}

export default UsersPage
