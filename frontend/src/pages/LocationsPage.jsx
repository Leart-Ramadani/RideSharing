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

const emptyForm = { name: '', address: '', latitude: '', longitude: '', type: 'General' }

function LocationsPage() {
  const [locations, setLocations] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editId, setEditId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchLocations = () => api.get('/locations').then((r) => setLocations(r.data)).catch(() => {})
  useEffect(() => { fetchLocations() }, [])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true)
    try {
      editId ? await api.put(`/locations/${editId}`, form) : await api.post('/locations', form)
      setForm(emptyForm); setEditId(null); fetchLocations()
    } catch (err) {
      const errs = err.response?.data?.errors
      setError(errs ? Object.values(errs).flat().join(' ') : 'An error occurred.')
    } finally { setLoading(false) }
  }

  const handleEdit = (l) => {
    setEditId(l.id)
    setForm({ name: l.name, address: l.address, latitude: l.latitude, longitude: l.longitude, type: l.type })
  }

  const handleDelete = async (id) => { if (confirm('Delete this location?')) { await api.delete(`/locations/${id}`); fetchLocations() } }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Typography variant="h4" fontWeight={700}>Locations</Typography>

      <Paper elevation={0} sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>Location List</Typography>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell><TableCell>Name</TableCell><TableCell>Address</TableCell>
                <TableCell>Latitude</TableCell><TableCell>Longitude</TableCell><TableCell>Type</TableCell><TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {locations.map((l) => (
                <TableRow key={l.id}>
                  <TableCell>{l.id}</TableCell>
                  <TableCell>{l.name}</TableCell>
                  <TableCell>{l.address}</TableCell>
                  <TableCell>{l.latitude}</TableCell>
                  <TableCell>{l.longitude}</TableCell>
                  <TableCell>{l.type}</TableCell>
                  <TableCell>
                    <Button size="small" onClick={() => handleEdit(l)}>Edit</Button>
                    <Button size="small" color="error" onClick={() => handleDelete(l.id)}>Delete</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Paper elevation={0} sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>{editId ? 'Edit Location' : 'Add New Location'}</Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid size={4}><TextField label="Name" name="name" value={form.name} onChange={handleChange} fullWidth required /></Grid>
            <Grid size={8}><TextField label="Address" name="address" value={form.address} onChange={handleChange} fullWidth required /></Grid>
            <Grid size={3}><TextField label="Latitude" name="latitude" type="number" value={form.latitude} onChange={handleChange} fullWidth required /></Grid>
            <Grid size={3}><TextField label="Longitude" name="longitude" type="number" value={form.longitude} onChange={handleChange} fullWidth required /></Grid>
            <Grid size={3}>
              <TextField select label="Type" name="type" value={form.type} onChange={handleChange} fullWidth>
                {['General', 'Airport', 'Transit', 'Landmark', 'Hospital', 'Hotel'].map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid size={12}>
              <Button type="submit" variant="contained" disabled={loading}>
                {loading ? <CircularProgress size={20} color="inherit" /> : editId ? 'Update Location' : 'Add Location'}
              </Button>
              {editId && <Button sx={{ ml: 1 }} onClick={() => { setEditId(null); setForm(emptyForm) }}>Cancel</Button>}
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  )
}

export default LocationsPage
