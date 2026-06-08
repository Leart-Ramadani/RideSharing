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

const emptyForm = { code: '', discount_percent: '', max_value: '', start_date: '', expiry_date: '', max_uses: '', status: 'Active' }

function PromoCodesPage() {
  const [promos, setPromos] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editId, setEditId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchPromos = () => api.get('/promo-codes').then((r) => setPromos(r.data)).catch(() => {})
  useEffect(() => { fetchPromos() }, [])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true)
    try {
      editId ? await api.put(`/promo-codes/${editId}`, form) : await api.post('/promo-codes', form)
      setForm(emptyForm); setEditId(null); fetchPromos()
    } catch (err) {
      const errs = err.response?.data?.errors
      setError(errs ? Object.values(errs).flat().join(' ') : 'An error occurred.')
    } finally { setLoading(false) }
  }

  const handleEdit = (p) => {
    setEditId(p.id)
    setForm({ code: p.code, discount_percent: p.discount_percent, max_value: p.max_value ?? '', start_date: p.start_date, expiry_date: p.expiry_date, max_uses: p.max_uses, status: p.status })
  }

  const handleDelete = async (id) => { if (confirm('Delete this promo code?')) { await api.delete(`/promo-codes/${id}`); fetchPromos() } }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Typography variant="h4" fontWeight={700}>Promo Codes</Typography>

      <Paper elevation={0} sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>Promo Code List</Typography>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell><TableCell>Code</TableCell><TableCell>Discount %</TableCell>
                <TableCell>Max Value</TableCell><TableCell>Start</TableCell><TableCell>Expiry</TableCell>
                <TableCell>Uses</TableCell><TableCell>Status</TableCell><TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {promos.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>{p.id}</TableCell>
                  <TableCell><strong>{p.code}</strong></TableCell>
                  <TableCell>{p.discount_percent}%</TableCell>
                  <TableCell>{p.max_value ? `$${p.max_value}` : '—'}</TableCell>
                  <TableCell>{p.start_date}</TableCell>
                  <TableCell>{p.expiry_date}</TableCell>
                  <TableCell>{p.times_used} / {p.max_uses}</TableCell>
                  <TableCell><Chip label={p.status} color={p.status === 'Active' ? 'success' : 'error'} size="small" /></TableCell>
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
        <Typography variant="h6" fontWeight={600} gutterBottom>{editId ? 'Edit Promo Code' : 'Add New Promo Code'}</Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid size={4}><TextField label="Code" name="code" value={form.code} onChange={handleChange} fullWidth required /></Grid>
            <Grid size={4}><TextField label="Discount %" name="discount_percent" type="number" value={form.discount_percent} onChange={handleChange} fullWidth required /></Grid>
            <Grid size={4}><TextField label="Max Value ($)" name="max_value" type="number" value={form.max_value} onChange={handleChange} fullWidth /></Grid>
            <Grid size={3}><TextField label="Start Date" name="start_date" type="date" value={form.start_date} onChange={handleChange} fullWidth required InputLabelProps={{ shrink: true }} /></Grid>
            <Grid size={3}><TextField label="Expiry Date" name="expiry_date" type="date" value={form.expiry_date} onChange={handleChange} fullWidth required InputLabelProps={{ shrink: true }} /></Grid>
            <Grid size={3}><TextField label="Max Uses" name="max_uses" type="number" value={form.max_uses} onChange={handleChange} fullWidth required /></Grid>
            <Grid size={3}>
              <TextField select label="Status" name="status" value={form.status} onChange={handleChange} fullWidth>
                {['Active', 'Inactive'].map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid size={12}>
              <Button type="submit" variant="contained" disabled={loading}>
                {loading ? <CircularProgress size={20} color="inherit" /> : editId ? 'Update Promo Code' : 'Add Promo Code'}
              </Button>
              {editId && <Button sx={{ ml: 1 }} onClick={() => { setEditId(null); setForm(emptyForm) }}>Cancel</Button>}
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  )
}

export default PromoCodesPage
