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
import api from '../services/api'

const statusColors = { Pending: 'warning', Paid: 'success', Cancelled: 'error' }
const emptyForm = { driver_id: '', period_start: '', period_end: '', total_amount: '', commission: '', net_amount: '', status: 'Pending' }

function DriverPayoutsPage() {
  const [payouts, setPayouts] = useState([])
  const [drivers, setDrivers] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editId, setEditId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchPayouts = () => api.get('/driver-payouts').then((r) => setPayouts(r.data)).catch(() => {})
  useEffect(() => {
    fetchPayouts()
    api.get('/drivers').then((r) => setDrivers(r.data)).catch(() => {})
  }, [])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true)
    try {
      editId ? await api.put(`/driver-payouts/${editId}`, form) : await api.post('/driver-payouts', form)
      setForm(emptyForm); setEditId(null); fetchPayouts()
    } catch (err) {
      const errs = err.response?.data?.errors
      setError(errs ? Object.values(errs).flat().join(' ') : 'An error occurred.')
    } finally { setLoading(false) }
  }

  const handleEdit = (p) => {
    setEditId(p.id)
    setForm({ driver_id: p.driver_id, period_start: p.period_start, period_end: p.period_end, total_amount: p.total_amount, commission: p.commission, net_amount: p.net_amount, status: p.status })
  }

  const handleDelete = async (id) => { if (confirm('Delete this payout?')) { await api.delete(`/driver-payouts/${id}`); fetchPayouts() } }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Typography variant="h4" fontWeight={700}>Driver Payouts</Typography>

      <Paper elevation={0} sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>Payout List</Typography>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell><TableCell>Driver</TableCell><TableCell>Period</TableCell>
                <TableCell>Total</TableCell><TableCell>Commission</TableCell><TableCell>Net</TableCell>
                <TableCell>Status</TableCell><TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {payouts.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>{p.id}</TableCell>
                  <TableCell>{p.driver ? `${p.driver.first_name} ${p.driver.last_name}` : '—'}</TableCell>
                  <TableCell>{p.period_start} → {p.period_end}</TableCell>
                  <TableCell>${p.total_amount}</TableCell>
                  <TableCell>${p.commission}</TableCell>
                  <TableCell>${p.net_amount}</TableCell>
                  <TableCell><Chip label={p.status} color={statusColors[p.status] ?? 'default'} size="small" /></TableCell>
                  <TableCell>
                    <Button size="small" onClick={() => handleEdit(p)}>Edit</Button>
                    <Button size="small" color="error" onClick={() => handleDelete(p.id)}>Delete</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Paper elevation={0} sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>{editId ? 'Edit Payout' : 'Add New Payout'}</Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid size={4}>
              <TextField select label="Driver" name="driver_id" value={form.driver_id} onChange={handleChange} fullWidth required>
                {drivers.map((d) => <MenuItem key={d.id} value={d.id}>{d.first_name} {d.last_name}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid size={4}><TextField label="Period Start" name="period_start" type="date" value={form.period_start} onChange={handleChange} fullWidth required InputLabelProps={{ shrink: true }} /></Grid>
            <Grid size={4}><TextField label="Period End" name="period_end" type="date" value={form.period_end} onChange={handleChange} fullWidth required InputLabelProps={{ shrink: true }} /></Grid>
            <Grid size={3}><TextField label="Total Amount ($)" name="total_amount" type="number" value={form.total_amount} onChange={handleChange} fullWidth required /></Grid>
            <Grid size={3}><TextField label="Commission ($)" name="commission" type="number" value={form.commission} onChange={handleChange} fullWidth required /></Grid>
            <Grid size={3}><TextField label="Net Amount ($)" name="net_amount" type="number" value={form.net_amount} onChange={handleChange} fullWidth required /></Grid>
            <Grid size={3}>
              <TextField select label="Status" name="status" value={form.status} onChange={handleChange} fullWidth>
                {['Pending', 'Paid', 'Cancelled'].map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid size={12}>
              <Button type="submit" variant="contained" disabled={loading}>
                {loading ? <CircularProgress size={20} color="inherit" /> : editId ? 'Update Payout' : 'Add Payout'}
              </Button>
              {editId && <Button sx={{ ml: 1 }} onClick={() => { setEditId(null); setForm(emptyForm) }}>Cancel</Button>}
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  )
}

export default DriverPayoutsPage
