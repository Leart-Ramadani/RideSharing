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
  { label: 'Revenue Today', value: '$48,220', change: '+11.2% vs yesterday' },
  { label: 'Completed Payments', value: '2,401', change: '98.9% success rate' },
  { label: 'Pending Payments', value: '42', change: 'Awaiting processing' },
  { label: 'Refunds', value: '9', change: '2 require manual review' },
]

const samplePayments = [
  { id: 1, rideId: 101, amount: '$18.40', paymentMethod: 'Credit Card', paymentDate: '2025-04-21 08:22', status: 'Completed', reference: 'PAY-20250421-001' },
  { id: 2, rideId: 102, amount: '$24.10', paymentMethod: 'Cash', paymentDate: '2025-04-21 09:45', status: 'Completed', reference: 'PAY-20250421-002' },
  { id: 3, rideId: 103, amount: '$11.50', paymentMethod: 'Wallet', paymentDate: '2025-04-21 10:12', status: 'Pending', reference: 'PAY-20250421-003' },
]

function PaymentsPage() {
  const [form, setForm] = useState({
    rideId: '',
    amount: '',
    paymentMethod: 'Credit Card',
    status: 'Pending',
    reference: '',
  })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // TODO: Send POST request to /api/payments
    console.log('New payment:', form)
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Typography variant="h4" fontWeight={700}>Payments</Typography>

      <StatsGrid items={stats} />

      <Paper elevation={0} sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>Payment List</Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Ride ID</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Payment Method</TableCell>
                <TableCell>Payment Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Reference</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {samplePayments.map((pay) => (
                <TableRow key={pay.id}>
                  <TableCell>{pay.id}</TableCell>
                  <TableCell>{pay.rideId}</TableCell>
                  <TableCell>{pay.amount}</TableCell>
                  <TableCell>{pay.paymentMethod}</TableCell>
                  <TableCell>{pay.paymentDate}</TableCell>
                  <TableCell>{pay.status}</TableCell>
                  <TableCell>{pay.reference}</TableCell>
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
        <Typography variant="h6" fontWeight={600} gutterBottom>Add New Payment</Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField select label="Ride" name="rideId" value={form.rideId} onChange={handleChange} fullWidth required>
                <MenuItem value="101">Ride #101 — Sara Johnson</MenuItem>
                <MenuItem value="102">Ride #102 — Niko Petrov</MenuItem>
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField label="Amount ($)" name="amount" type="number" value={form.amount} onChange={handleChange} fullWidth required />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField select label="Payment Method" name="paymentMethod" value={form.paymentMethod} onChange={handleChange} fullWidth>
                <MenuItem value="Credit Card">Credit Card</MenuItem>
                <MenuItem value="Cash">Cash</MenuItem>
                <MenuItem value="Wallet">Wallet</MenuItem>
                <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField select label="Status" name="status" value={form.status} onChange={handleChange} fullWidth>
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="Completed">Completed</MenuItem>
                <MenuItem value="Refunded">Refunded</MenuItem>
                <MenuItem value="Failed">Failed</MenuItem>
              </TextField>
            </Grid>
            <Grid size={12}>
              <TextField label="Reference Number" name="reference" value={form.reference} onChange={handleChange} fullWidth />
            </Grid>
          </Grid>
          <Button type="submit" variant="contained" sx={{ mt: 2 }}>Save Payment</Button>
        </Box>
      </Paper>
    </Box>
  )
}

export default PaymentsPage
