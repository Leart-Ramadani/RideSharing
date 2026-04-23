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
  { label: 'Total Payouts', value: '$142,800', change: 'All-time paid out' },
  { label: 'Pending Payouts', value: '$12,840', change: '15 batches waiting' },
  { label: 'Paid This Month', value: '$38,420', change: '+9% vs last month' },
  { label: 'Total Commission', value: '$18,210', change: '20% of gross earnings' },
]

const samplePayouts = [
  { id: 1, driver: 'Amina Yusuf', periodStart: '2025-04-01', periodEnd: '2025-04-15', totalAmount: '$1,240.00', commission: '$248.00', netAmount: '$992.00', status: 'Paid' },
  { id: 2, driver: 'Daniel Cruz', periodStart: '2025-04-01', periodEnd: '2025-04-15', totalAmount: '$980.00', commission: '$196.00', netAmount: '$784.00', status: 'Pending' },
  { id: 3, driver: 'Layla Nasser', periodStart: '2025-04-01', periodEnd: '2025-04-15', totalAmount: '$1,100.00', commission: '$220.00', netAmount: '$880.00', status: 'Paid' },
]

function DriverPayoutsPage() {
  const [form, setForm] = useState({
    driverId: '',
    periodStart: '',
    periodEnd: '',
    totalAmount: '',
    commission: '',
    netAmount: '',
    status: 'Pending',
  })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('New driver payout:', form)
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Typography variant="h4" fontWeight={700}>Driver Payouts</Typography>
      <StatsGrid items={stats} />

      <Paper elevation={0} sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>Driver Payout List</Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Driver</TableCell>
                <TableCell>Period Start</TableCell>
                <TableCell>Period End</TableCell>
                <TableCell>Total Amount</TableCell>
                <TableCell>Commission</TableCell>
                <TableCell>Net Amount</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {samplePayouts.map((payout) => (
                <TableRow key={payout.id}>
                  <TableCell>{payout.id}</TableCell>
                  <TableCell>{payout.driver}</TableCell>
                  <TableCell>{payout.periodStart}</TableCell>
                  <TableCell>{payout.periodEnd}</TableCell>
                  <TableCell>{payout.totalAmount}</TableCell>
                  <TableCell>{payout.commission}</TableCell>
                  <TableCell>{payout.netAmount}</TableCell>
                  <TableCell>{payout.status}</TableCell>
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
        <Typography variant="h6" fontWeight={600} gutterBottom>Add New Driver Payout</Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField select label="Driver" name="driverId" value={form.driverId} onChange={handleChange} fullWidth required>
                <MenuItem value="1">Amina Yusuf</MenuItem>
                <MenuItem value="2">Daniel Cruz</MenuItem>
                <MenuItem value="3">Layla Nasser</MenuItem>
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField select label="Status" name="status" value={form.status} onChange={handleChange} fullWidth>
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="Paid">Paid</MenuItem>
                <MenuItem value="Cancelled">Cancelled</MenuItem>
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField label="Period Start" name="periodStart" type="date" value={form.periodStart} onChange={handleChange} fullWidth InputLabelProps={{ shrink: true }} required />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField label="Period End" name="periodEnd" type="date" value={form.periodEnd} onChange={handleChange} fullWidth InputLabelProps={{ shrink: true }} required />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField label="Total Amount ($)" name="totalAmount" type="number" value={form.totalAmount} onChange={handleChange} fullWidth required />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField label="Commission ($)" name="commission" type="number" value={form.commission} onChange={handleChange} fullWidth />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField label="Net Amount ($)" name="netAmount" type="number" value={form.netAmount} onChange={handleChange} fullWidth />
            </Grid>
          </Grid>
          <Button type="submit" variant="contained" sx={{ mt: 2 }}>Save Payout</Button>
        </Box>
      </Paper>
    </Box>
  )
}

export default DriverPayoutsPage
