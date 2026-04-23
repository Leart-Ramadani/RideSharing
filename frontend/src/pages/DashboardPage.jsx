import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import StatsGrid from '../components/layout/StatsGrid'

const stats = [
  { label: 'Total Rides Today', value: '2,481', change: '+8.4% vs yesterday' },
  { label: 'Active Drivers', value: '342', change: '+21 newly active' },
  { label: 'New Passengers', value: '184', change: '+12.1% this week' },
  { label: 'Revenue Today', value: '$48,220', change: '+11.2% vs yesterday' },
]

const recentRides = [
  { id: 1, passenger: 'Sara Johnson', driver: 'Amina Yusuf', from: 'Airport', to: 'Downtown', status: 'Completed' },
  { id: 2, passenger: 'Niko Petrov', driver: 'Daniel Cruz', from: 'Train Station', to: 'Hotel Zone', status: 'In Progress' },
  { id: 3, passenger: 'Maria Chen', driver: 'Layla Nasser', from: 'University', to: 'Mall', status: 'Completed' },
  { id: 4, passenger: 'John Doe', driver: 'Carlos Rivera', from: 'Hospital', to: 'Suburb North', status: 'Cancelled' },
]

function DashboardPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <Typography variant="h4" fontWeight={700}>Dashboard</Typography>

      <StatsGrid items={stats} />

      <Paper elevation={0} sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          Recent Rides
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Passenger</TableCell>
                <TableCell>Driver</TableCell>
                <TableCell>From</TableCell>
                <TableCell>To</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {recentRides.map((ride) => (
                <TableRow key={ride.id}>
                  <TableCell>{ride.id}</TableCell>
                  <TableCell>{ride.passenger}</TableCell>
                  <TableCell>{ride.driver}</TableCell>
                  <TableCell>{ride.from}</TableCell>
                  <TableCell>{ride.to}</TableCell>
                  <TableCell>{ride.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </div>
  )
}

export default DashboardPage
