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

const emptyForm = { driver_id: '', make: '', model: '', year: '', color: '', plate_number: '', seats: '', fuel_type: 'Gasoline', status: 'Active' }

function VehiclesPage() {
  const [vehicles, setVehicles] = useState([])
  const [drivers, setDrivers] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editId, setEditId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchVehicles = () => api.get('/vehicles').then((r) => setVehicles(r.data)).catch(() => {})
  useEffect(() => {
    fetchVehicles()
    api.get('/drivers').then((r) => setDrivers(r.data)).catch(() => {})
  }, [])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true)
    try {
      editId ? await api.put(`/vehicles/${editId}`, form) : await api.post('/vehicles', form)
      setForm(emptyForm); setEditId(null); fetchVehicles()
    } catch (err) {
      const errs = err.response?.data?.errors
      setError(errs ? Object.values(errs).flat().join(' ') : 'An error occurred.')
    } finally { setLoading(false) }
  }

  const handleEdit = (v) => {
    setEditId(v.id)
    setForm({ driver_id: v.driver_id, make: v.make, model: v.model, year: v.year, color: v.color, plate_number: v.plate_number, seats: v.seats, fuel_type: v.fuel_type, status: v.status })
  }

  const handleDelete = async (id) => { if (confirm('Delete this vehicle?')) { await api.delete(`/vehicles/${id}`); fetchVehicles() } }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Typography variant="h4" fontWeight={700}>Vehicles</Typography>

      <Paper elevation={0} sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>Vehicle List</Typography>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell><TableCell>Driver</TableCell><TableCell>Make</TableCell><TableCell>Model</TableCell>
                <TableCell>Year</TableCell><TableCell>Color</TableCell><TableCell>Plate</TableCell>
                <TableCell>Seats</TableCell><TableCell>Fuel</TableCell><TableCell>Status</TableCell><TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {vehicles.map((v) => (
                <TableRow key={v.id}>
                  <TableCell>{v.id}</TableCell>
                  <TableCell>{v.driver ? `${v.driver.first_name} ${v.driver.last_name}` : '—'}</TableCell>
                  <TableCell>{v.make}</TableCell>
                  <TableCell>{v.model}</TableCell>
                  <TableCell>{v.year}</TableCell>
                  <TableCell>{v.color}</TableCell>
                  <TableCell>{v.plate_number}</TableCell>
                  <TableCell>{v.seats}</TableCell>
                  <TableCell>{v.fuel_type}</TableCell>
                  <TableCell><Chip label={v.status} color={v.status === 'Active' ? 'success' : 'error'} size="small" /></TableCell>
                  <TableCell>
                    <Button size="small" onClick={() => handleEdit(v)}>Edit</Button>
                    <Button size="small" color="error" onClick={() => handleDelete(v.id)}>Delete</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Paper elevation={0} sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>{editId ? 'Edit Vehicle' : 'Add New Vehicle'}</Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid size={4}>
              <TextField select label="Driver" name="driver_id" value={form.driver_id} onChange={handleChange} fullWidth required>
                {drivers.map((d) => <MenuItem key={d.id} value={d.id}>{d.first_name} {d.last_name}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid size={4}><TextField label="Make" name="make" value={form.make} onChange={handleChange} fullWidth required /></Grid>
            <Grid size={4}><TextField label="Model" name="model" value={form.model} onChange={handleChange} fullWidth required /></Grid>
            <Grid size={3}><TextField label="Year" name="year" type="number" value={form.year} onChange={handleChange} fullWidth required /></Grid>
            <Grid size={3}><TextField label="Color" name="color" value={form.color} onChange={handleChange} fullWidth required /></Grid>
            <Grid size={3}><TextField label="Plate Number" name="plate_number" value={form.plate_number} onChange={handleChange} fullWidth required /></Grid>
            <Grid size={3}><TextField label="Seats" name="seats" type="number" value={form.seats} onChange={handleChange} fullWidth required /></Grid>
            <Grid size={4}>
              <TextField select label="Fuel Type" name="fuel_type" value={form.fuel_type} onChange={handleChange} fullWidth>
                {['Gasoline', 'Diesel', 'Electric', 'Hybrid'].map((f) => <MenuItem key={f} value={f}>{f}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid size={4}>
              <TextField select label="Status" name="status" value={form.status} onChange={handleChange} fullWidth>
                {['Active', 'Inactive'].map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid size={12}>
              <Button type="submit" variant="contained" disabled={loading}>
                {loading ? <CircularProgress size={20} color="inherit" /> : editId ? 'Update Vehicle' : 'Add Vehicle'}
              </Button>
              {editId && <Button sx={{ ml: 1 }} onClick={() => { setEditId(null); setForm(emptyForm) }}>Cancel</Button>}
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  )
}

export default VehiclesPage
