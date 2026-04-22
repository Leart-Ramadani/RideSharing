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
  { label: 'Total Promo Codes', value: '24', change: '+3 created this month' },
  { label: 'Active Codes', value: '8', change: 'Currently usable' },
  { label: 'Expired Codes', value: '14', change: 'No longer valid' },
  { label: 'Total Uses', value: '1,842', change: 'All-time redemptions' },
]

const samplePromoCodes = [
  { id: 1, code: 'SUMMER25', discountPct: '25%', maxValue: '$10.00', startDate: '2025-06-01', endDate: '2025-08-31', maxUses: 500, status: 'Inactive' },
  { id: 2, code: 'WELCOME10', discountPct: '10%', maxValue: '$5.00', startDate: '2025-01-01', endDate: '2025-12-31', maxUses: 1000, status: 'Active' },
  { id: 3, code: 'RIDE50', discountPct: '50%', maxValue: '$15.00', startDate: '2025-04-01', endDate: '2025-04-30', maxUses: 100, status: 'Active' },
]

function PromoCodesPage() {
  const [form, setForm] = useState({
    code: '',
    discountPct: '',
    maxValue: '',
    startDate: '',
    endDate: '',
    maxUses: '',
    status: 'Active',
  })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // TODO: Send POST request to /api/promo-codes
    console.log('New promo code:', form)
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Typography variant="h4" fontWeight={700}>Promo Codes</Typography>

      <StatsGrid items={stats} />

      <Paper elevation={0} sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>Promo Code List</Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Code</TableCell>
                <TableCell>Discount %</TableCell>
                <TableCell>Max Value</TableCell>
                <TableCell>Start Date</TableCell>
                <TableCell>End Date</TableCell>
                <TableCell>Max Uses</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {samplePromoCodes.map((promo) => (
                <TableRow key={promo.id}>
                  <TableCell>{promo.id}</TableCell>
                  <TableCell>{promo.code}</TableCell>
                  <TableCell>{promo.discountPct}</TableCell>
                  <TableCell>{promo.maxValue}</TableCell>
                  <TableCell>{promo.startDate}</TableCell>
                  <TableCell>{promo.endDate}</TableCell>
                  <TableCell>{promo.maxUses}</TableCell>
                  <TableCell>{promo.status}</TableCell>
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
        <Typography variant="h6" fontWeight={600} gutterBottom>Add New Promo Code</Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField label="Promo Code" name="code" value={form.code} onChange={handleChange} fullWidth required />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField label="Discount (%)" name="discountPct" type="number" value={form.discountPct} onChange={handleChange} fullWidth required />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField label="Max Discount Value ($)" name="maxValue" type="number" value={form.maxValue} onChange={handleChange} fullWidth />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField label="Max Uses" name="maxUses" type="number" value={form.maxUses} onChange={handleChange} fullWidth />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField label="Start Date" name="startDate" type="date" value={form.startDate} onChange={handleChange} fullWidth InputLabelProps={{ shrink: true }} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField label="End Date" name="endDate" type="date" value={form.endDate} onChange={handleChange} fullWidth InputLabelProps={{ shrink: true }} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField select label="Status" name="status" value={form.status} onChange={handleChange} fullWidth>
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Inactive">Inactive</MenuItem>
              </TextField>
            </Grid>
          </Grid>
          <Button type="submit" variant="contained" sx={{ mt: 2 }}>Save Promo Code</Button>
        </Box>
      </Paper>
    </Box>
  )
}

export default PromoCodesPage
