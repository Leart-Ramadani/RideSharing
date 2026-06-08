import { useEffect, useState } from 'react'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
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
import api from '../services/api'

function UserRolesPage() {
  const [userRoles, setUserRoles] = useState([])
  const [users, setUsers] = useState([])
  const [roles, setRoles] = useState([])
  const [form, setForm] = useState({ user_id: '', role_id: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchAll = () => {
    api.get('/user-roles').then((r) => setUserRoles(r.data)).catch(() => {})
    api.get('/users').then((r) => setUsers(r.data)).catch(() => {})
    api.get('/roles').then((r) => setRoles(r.data)).catch(() => {})
  }
  useEffect(() => { fetchAll() }, [])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true)
    try {
      await api.post('/user-roles', form)
      setForm({ user_id: '', role_id: '' }); fetchAll()
    } catch (err) {
      const errs = err.response?.data?.errors
      setError(errs ? Object.values(errs).flat().join(' ') : err.response?.data?.message || 'An error occurred.')
    } finally { setLoading(false) }
  }

  const handleDelete = async (id) => { if (confirm('Remove this role assignment?')) { await api.delete(`/user-roles/${id}`); fetchAll() } }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Typography variant="h4" fontWeight={700}>User Roles</Typography>

      <Paper elevation={0} sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>Role Assignments</Typography>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell><TableCell>User</TableCell><TableCell>Email</TableCell><TableCell>Role</TableCell><TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {userRoles.map((ur) => (
                <TableRow key={ur.id}>
                  <TableCell>{ur.id}</TableCell>
                  <TableCell>{ur.user ? `${ur.user.name} ${ur.user.last_name}` : '—'}</TableCell>
                  <TableCell>{ur.user?.email}</TableCell>
                  <TableCell>{ur.role?.name}</TableCell>
                  <TableCell><Button size="small" color="error" onClick={() => handleDelete(ur.id)}>Remove</Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Paper elevation={0} sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>Assign Role to User</Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid size={5}>
              <TextField select label="User" name="user_id" value={form.user_id} onChange={handleChange} fullWidth required>
                {users.map((u) => <MenuItem key={u.id} value={u.id}>{u.name} {u.last_name} ({u.email})</MenuItem>)}
              </TextField>
            </Grid>
            <Grid size={5}>
              <TextField select label="Role" name="role_id" value={form.role_id} onChange={handleChange} fullWidth required>
                {roles.map((r) => <MenuItem key={r.id} value={r.id}>{r.name}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid size={2} sx={{ display: 'flex', alignItems: 'center' }}>
              <Button type="submit" variant="contained" fullWidth disabled={loading}>
                {loading ? <CircularProgress size={20} color="inherit" /> : 'Assign'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  )
}

export default UserRolesPage
