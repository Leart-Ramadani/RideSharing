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

const emptyForm = { service_type: '', base_price: '', price_per_km: '', price_per_min: '', peak_hour_rate: '1', status: 'Active' }

function FaresPage() {
  const [fares, setFares] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editId, setEditId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchFares = () => api.get('/fares').then((r) => setFares(r.data)).catch(() => {})
  useEffect(() => { fetchFares() }, [])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true)
    try {
      editId ? await api.put(`/fares/${editId}`, form) : await api.post('/fares', form)
      setForm(emptyForm); setEditId(null); fetchFares()
    } catch (err) {
      const errs = err.response?.data?.errors
      setError(errs ? Object.values(errs).flat().join(' ') : 'An error occurred.')
    } finally { setLoading(false) }
  }

  const handleEdit = (f) => {
    setEditId(f.id)
    setForm({ service_type: f.service_type, base_price: f.base_price, price_per_km: f.price_per_km, price_per_min: f.price_per_min, peak_hour_rate: f.peak_hour_rate, status: f.status })
  }

  const handleDelete = async (id) => { if (confirm('Delete this fare?')) { await api.delete(`/fares/${id}`); fetchFares() } }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Typography variant="h4" fontWeight={700}>Fares</Typography>

      <Paper elevation={0} sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>Fare List</Typography>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell><TableCell>Service Type</TableCell><TableCell>Base Price</TableCell>
                <TableCell>Per km</TableCell><TableCell>Per min</TableCell><TableCell>Peak Rate</TableCell>
                <TableCell>Status</TableCell><TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {fares.map((f) => (
                <TableRow key={f.id}>
                  <TableCell>{f.id}</TableCell>
                  <TableCell>{f.service_type}</TableCell>
                  <TableCell>${f.base_price}</TableCell>
                  <TableCell>${f.price_per_km}</TableCell>
                  <TableCell>${f.price_per_min}</TableCell>
                  <TableCell>{f.peak_hour_rate}x</TableCell>
                  <TableCell><Chip label={f.status} color={f.status === 'Active' ? 'success' : 'error'} size="small" /></TableCell>
                  <TableCell>
                    <Button size="small" onClick={() => handleEdit(f)}>Edit</Button>
                    <Button size="small" color="error" onClick={() => handleDelete(f.id)}>Delete</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Paper elevation={0} sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>{editId ? 'Edit Fare' : 'Add New Fare'}</Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid size={4}><TextField label="Service Type" name="service_type" value={form.service_type} onChange={handleChange} fullWidth required /></Grid>
            <Grid size={4}><TextField label="Base Price ($)" name="base_price" type="number" value={form.base_price} onChange={handleChange} fullWidth required /></Grid>
            <Grid size={4}><TextField label="Price per km ($)" name="price_per_km" type="number" value={form.price_per_km} onChange={handleChange} fullWidth required /></Grid>
            <Grid size={4}><TextField label="Price per min ($)" name="price_per_min" type="number" value={form.price_per_min} onChange={handleChange} fullWidth required /></Grid>
            <Grid size={4}><TextField label="Peak Hour Rate (multiplier)" name="peak_hour_rate" type="number" value={form.peak_hour_rate} onChange={handleChange} fullWidth /></Grid>
            <Grid size={4}>
              <TextField select label="Status" name="status" value={form.status} onChange={handleChange} fullWidth>
                {['Active', 'Inactive'].map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid size={12}>
              <Button type="submit" variant="contained" disabled={loading}>
                {loading ? <CircularProgress size={20} color="inherit" /> : editId ? 'Update Fare' : 'Add Fare'}
              </Button>
              {editId && <Button sx={{ ml: 1 }} onClick={() => { setEditId(null); setForm(emptyForm) }}>Cancel</Button>}
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  )
}

export default FaresPage
