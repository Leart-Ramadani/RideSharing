import { useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
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

const stats = [
  { label: 'Total Ratings', value: '18,420', change: '+312 this week' },
  { label: 'Average Rating', value: '4.8', change: 'System-wide score' },
  { label: '5-Star Ratings', value: '12,310', change: '67% of all ratings' },
  { label: '1-Star Ratings', value: '280', change: '1.5% — needs review' },
]

const sampleRatings = [
  { id: 1, rideId: 101, rater: 'Sara Johnson', ratedPerson: 'Amina Yusuf', points: 5, comment: 'Excellent driver, very polite!', ratingDate: '2025-04-21' },
  { id: 2, rideId: 102, rater: 'Amina Yusuf', ratedPerson: 'Niko Petrov', points: 4, comment: 'Good passenger, on time.', ratingDate: '2025-04-21' },
  { id: 3, rideId: 103, rater: 'Maria Chen', ratedPerson: 'Daniel Cruz', points: 3, comment: 'Acceptable, but took a longer route.', ratingDate: '2025-04-20' },
]

function RatingsPage() {
  const [form, setForm] = useState({
    rideId: '',
    raterId: '',
    ratedPersonId: '',
    points: '',
    comment: '',
  })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // TODO: Send POST request to /api/ratings
    console.log('New rating:', form)
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Typography variant="h4" fontWeight={700}>Ratings</Typography>

      <StatsGrid items={stats} />

      <Paper elevation={0} sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>Rating List</Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Ride ID</TableCell>
                <TableCell>Rater</TableCell>
                <TableCell>Rated Person</TableCell>
                <TableCell>Points</TableCell>
                <TableCell>Comment</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sampleRatings.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>{r.id}</TableCell>
                  <TableCell>{r.rideId}</TableCell>
                  <TableCell>{r.rater}</TableCell>
                  <TableCell>{r.ratedPerson}</TableCell>
                  <TableCell>{r.points} / 5</TableCell>
                  <TableCell>{r.comment}</TableCell>
                  <TableCell>{r.ratingDate}</TableCell>
                  <TableCell>
                    <Button size="small">Edit</Button>
                    <Button size="small" color="error">Delete</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Paper elevation={0} sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>Add New Rating</Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField select label="Ride" name="rideId" value={form.rideId} onChange={handleChange} fullWidth required>
                <MenuItem value="101">Ride #101</MenuItem>
                <MenuItem value="102">Ride #102</MenuItem>
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField select label="Points (1-5)" name="points" value={form.points} onChange={handleChange} fullWidth required>
                <MenuItem value="1">1 — Very Bad</MenuItem>
                <MenuItem value="2">2 — Bad</MenuItem>
                <MenuItem value="3">3 — Average</MenuItem>
                <MenuItem value="4">4 — Good</MenuItem>
                <MenuItem value="5">5 — Excellent</MenuItem>
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField select label="Rater (who is rating)" name="raterId" value={form.raterId} onChange={handleChange} fullWidth required>
                <MenuItem value="1">Sara Johnson (Passenger)</MenuItem>
                <MenuItem value="2">Amina Yusuf (Driver)</MenuItem>
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField select label="Rated Person" name="ratedPersonId" value={form.ratedPersonId} onChange={handleChange} fullWidth required>
                <MenuItem value="1">Amina Yusuf (Driver)</MenuItem>
                <MenuItem value="2">Sara Johnson (Passenger)</MenuItem>
              </TextField>
            </Grid>
            <Grid size={12}>
              <TextField label="Comment" name="comment" value={form.comment} onChange={handleChange} fullWidth multiline rows={2} />
            </Grid>
          </Grid>
          <Button type="submit" variant="contained" sx={{ mt: 2 }}>Save Rating</Button>
        </Box>
      </Paper>
    </Box>
  )
}

export default RatingsPage
