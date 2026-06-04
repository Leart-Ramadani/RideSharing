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

const emptyForm = { ride_id: '', rater_id: '', rated_id: '', score: '5', comment: '' }

function RatingsPage() {
  const [ratings, setRatings] = useState([])
  const [rides, setRides] = useState([])
  const [users, setUsers] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editId, setEditId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchRatings = () => api.get('/ratings').then((r) => setRatings(r.data)).catch(() => {})
  useEffect(() => {
    fetchRatings()
    api.get('/rides').then((r) => setRides(r.data)).catch(() => {})
    api.get('/users').then((r) => setUsers(r.data)).catch(() => {})
  }, [])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true)
    try {
      editId ? await api.put(`/ratings/${editId}`, form) : await api.post('/ratings', form)
      setForm(emptyForm); setEditId(null); fetchRatings()
    } catch (err) {
      const errs = err.response?.data?.errors
      setError(errs ? Object.values(errs).flat().join(' ') : 'An error occurred.')
    } finally { setLoading(false) }
  }

  const handleEdit = (r) => {
    setEditId(r.id)
    setForm({ ride_id: r.ride_id, rater_id: r.rater_id, rated_id: r.rated_id, score: r.score, comment: r.comment ?? '' })
  }

  const handleDelete = async (id) => { if (confirm('Delete this rating?')) { await api.delete(`/ratings/${id}`); fetchRatings() } }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Typography variant="h4" fontWeight={700}>Ratings</Typography>

      <Paper elevation={0} sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>Rating List</Typography>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell><TableCell>Ride #</TableCell><TableCell>Rater</TableCell>
                <TableCell>Rated</TableCell><TableCell>Score</TableCell><TableCell>Comment</TableCell><TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {ratings.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>{r.id}</TableCell>
                  <TableCell>{r.ride_id}</TableCell>
                  <TableCell>{r.rater ? `${r.rater.name} ${r.rater.last_name}` : '—'}</TableCell>
                  <TableCell>{r.rated ? `${r.rated.name} ${r.rated.last_name}` : '—'}</TableCell>
                  <TableCell>{'★'.repeat(r.score)}</TableCell>
                  <TableCell>{r.comment || '—'}</TableCell>
                  <TableCell>
                    <Button size="small" onClick={() => handleEdit(r)}>Edit</Button>
                    <Button size="small" color="error" onClick={() => handleDelete(r.id)}>Delete</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Paper elevation={0} sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>{editId ? 'Edit Rating' : 'Add New Rating'}</Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid size={4}>
              <TextField select label="Ride" name="ride_id" value={form.ride_id} onChange={handleChange} fullWidth required>
                {rides.map((r) => <MenuItem key={r.id} value={r.id}>Ride #{r.id}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid size={4}>
              <TextField select label="Rater (who rates)" name="rater_id" value={form.rater_id} onChange={handleChange} fullWidth required>
                {users.map((u) => <MenuItem key={u.id} value={u.id}>{u.name} {u.last_name}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid size={4}>
              <TextField select label="Rated (who is rated)" name="rated_id" value={form.rated_id} onChange={handleChange} fullWidth required>
                {users.map((u) => <MenuItem key={u.id} value={u.id}>{u.name} {u.last_name}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid size={3}>
              <TextField select label="Score" name="score" value={form.score} onChange={handleChange} fullWidth required>
                {[1, 2, 3, 4, 5].map((s) => <MenuItem key={s} value={s}>{s} Star{s > 1 ? 's' : ''}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid size={9}><TextField label="Comment (optional)" name="comment" value={form.comment} onChange={handleChange} fullWidth /></Grid>
            <Grid size={12}>
              <Button type="submit" variant="contained" disabled={loading}>
                {loading ? <CircularProgress size={20} color="inherit" /> : editId ? 'Update Rating' : 'Add Rating'}
              </Button>
              {editId && <Button sx={{ ml: 1 }} onClick={() => { setEditId(null); setForm(emptyForm) }}>Cancel</Button>}
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  )
}

export default RatingsPage
