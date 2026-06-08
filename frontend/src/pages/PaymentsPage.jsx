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

const statusColors = { Pending: 'warning', Completed: 'success', Failed: 'error', Refunded: 'info' }
const emptyForm = { ride_id: '', amount: '', payment_method: 'Cash', status: 'Pending', reference: '' }

function PaymentsPage() {
  const [payments, setPayments] = useState([])
  const [rides, setRides] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editId, setEditId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchPayments = () => api.get('/payments').then((r) => setPayments(r.data)).catch(() => {})
  useEffect(() => {
    fetchPayments()
    api.get('/rides').then((r) => setRides(r.data)).catch(() => {})
  }, [])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true)
    try {
      editId ? await api.put(`/payments/${editId}`, form) : await api.post('/payments', form)
      setForm(emptyForm); setEditId(null); fetchPayments()
    } catch (err) {
      const errs = err.response?.data?.errors
      setError(errs ? Object.values(errs).flat().join(' ') : 'An error occurred.')
    } finally { setLoading(false) }
  }

  const handleEdit = (p) => {
    setEditId(p.id)
    setForm({ ride_id: p.ride_id, amount: p.amount, payment_method: p.payment_method, status: p.status, reference: p.reference ?? '' })
  }

  const handleDelete = async (id) => { if (confirm('Delete this payment?')) { await api.delete(`/payments/${id}`); fetchPayments() } }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Typography variant="h4" fontWeight={700}>Payments</Typography>

      <Paper elevation={0} sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>Payment List</Typography>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell><TableCell>Ride #</TableCell><TableCell>Amount</TableCell>
                <TableCell>Method</TableCell><TableCell>Reference</TableCell><TableCell>Status</TableCell><TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {payments.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>{p.id}</TableCell>
                  <TableCell>{p.ride_id}</TableCell>
                  <TableCell>${p.amount}</TableCell>
                  <TableCell>{p.payment_method}</TableCell>
                  <TableCell>{p.reference || '—'}</TableCell>
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
        <Typography variant="h6" fontWeight={600} gutterBottom>{editId ? 'Edit Payment' : 'Add New Payment'}</Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid size={4}>
              <TextField select label="Ride" name="ride_id" value={form.ride_id} onChange={handleChange} fullWidth required>
                {rides.map((r) => <MenuItem key={r.id} value={r.id}>Ride #{r.id} ({r.pickup_address} → {r.dropoff_address})</MenuItem>)}
              </TextField>
            </Grid>
            <Grid size={4}><TextField label="Amount ($)" name="amount" type="number" value={form.amount} onChange={handleChange} fullWidth required /></Grid>
            <Grid size={4}>
              <TextField select label="Payment Method" name="payment_method" value={form.payment_method} onChange={handleChange} fullWidth>
                {['Cash', 'Card', 'Online', 'Wallet'].map((m) => <MenuItem key={m} value={m}>{m}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid size={4}><TextField label="Reference" name="reference" value={form.reference} onChange={handleChange} fullWidth /></Grid>
            <Grid size={4}>
              <TextField select label="Status" name="status" value={form.status} onChange={handleChange} fullWidth>
                {['Pending', 'Completed', 'Failed', 'Refunded'].map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid size={12}>
              <Button type="submit" variant="contained" disabled={loading}>
                {loading ? <CircularProgress size={20} color="inherit" /> : editId ? 'Update Payment' : 'Add Payment'}
              </Button>
              {editId && <Button sx={{ ml: 1 }} onClick={() => { setEditId(null); setForm(emptyForm) }}>Cancel</Button>}
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  )
}

export default PaymentsPage
