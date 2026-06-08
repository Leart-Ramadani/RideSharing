import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/material/styles'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line,
} from 'recharts'
import StatsGrid from '../components/layout/StatsGrid'
import api from '../services/api'

const STATUS_COLORS = {
  Completed: '#22c55e',
  InProgress: '#3b82f6',
  Pending: '#f59e0b',
  Cancelled: '#ef4444',
  Accepted: '#8b5cf6',
}

const statusColors = {
  Completed: 'success', InProgress: 'info',
  Pending: 'warning', Cancelled: 'error', Accepted: 'primary',
}

function DashboardPage() {
  const [stats, setStats]       = useState([])
  const [rides, setRides]       = useState([])
  const [chartData, setChartData] = useState({ ridesPerDay: [], revenuePerDay: [], ridesByStatus: [] })
  const theme                   = useTheme()
  const isDark                  = theme.palette.mode === 'dark'

  useEffect(() => {
    api.get('/dashboard').then((res) => {
      const d = res.data
      setStats([
        { label: 'Total Users',      value: d.total_users,      change: 'Registered accounts' },
        { label: 'Active Drivers',   value: d.active_drivers,   change: `${d.online_drivers ?? 0} online now` },
        { label: 'Total Passengers', value: d.total_passengers, change: 'Registered passengers' },
        { label: 'Total Revenue',    value: `€${Number(d.total_revenue).toFixed(2)}`, change: 'From completed rides' },
        { label: 'Total Rides',      value: d.total_rides,      change: `${d.completed_rides} completed` },
        { label: 'Pending Requests', value: d.pending_requests, change: 'Awaiting driver' },
      ])
      setChartData({
        ridesPerDay:    d.rides_per_day    ?? [],
        revenuePerDay:  d.revenue_per_day  ?? [],
        ridesByStatus:  d.rides_by_status  ?? [],
      })
    }).catch(() => {})

    api.get('/rides').then((res) => setRides(res.data.slice(0, 8))).catch(() => {})
  }, [])

  const gridText = isDark ? '#94a3b8' : '#64748b'

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Typography variant="h4" fontWeight={700}>Dashboard</Typography>

      <StatsGrid items={stats} />

      {/* Charts row */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' }, gap: 3 }}>
        {/* Rides per day bar chart */}
        <Paper elevation={0} sx={{ p: 3, borderRadius: 3 }}>
          <Typography variant="h6" fontWeight={600} gutterBottom>Rides — Last 7 Days</Typography>
          {chartData.ridesPerDay.length === 0 ? (
            <Typography color="text.secondary" sx={{ py: 3 }}>No ride data yet.</Typography>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={chartData.ridesPerDay} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#1e293b' : '#e2e8f0'} />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11, fill: gridText }}
                  tickFormatter={(v) => v.slice(5)} // show MM-DD
                />
                <YAxis tick={{ fontSize: 11, fill: gridText }} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: theme.palette.background.paper, border: 'none', borderRadius: 8 }}
                />
                <Bar dataKey="rides" name="Rides" fill={theme.palette.primary.main} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </Paper>

        {/* Ride status pie chart */}
        <Paper elevation={0} sx={{ p: 3, borderRadius: 3 }}>
          <Typography variant="h6" fontWeight={600} gutterBottom>Rides by Status</Typography>
          {chartData.ridesByStatus.length === 0 ? (
            <Typography color="text.secondary" sx={{ py: 3 }}>No data yet.</Typography>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={chartData.ridesByStatus}
                  dataKey="count"
                  nameKey="status"
                  cx="50%"
                  cy="50%"
                  outerRadius={75}
                  label={({ status, percent }) => `${status} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {chartData.ridesByStatus.map((entry) => (
                    <Cell key={entry.status} fill={STATUS_COLORS[entry.status] ?? '#94a3b8'} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: theme.palette.background.paper, border: 'none', borderRadius: 8 }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </Paper>
      </Box>

      {/* Revenue line chart */}
      <Paper elevation={0} sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>Revenue — Last 7 Days (€)</Typography>
        {chartData.revenuePerDay.length === 0 ? (
          <Typography color="text.secondary" sx={{ py: 3 }}>No revenue data yet.</Typography>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData.revenuePerDay} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#1e293b' : '#e2e8f0'} />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: gridText }}
                tickFormatter={(v) => v.slice(5)}
              />
              <YAxis tick={{ fontSize: 11, fill: gridText }} />
              <Tooltip
                formatter={(val) => [`€${Number(val).toFixed(2)}`, 'Revenue']}
                contentStyle={{ backgroundColor: theme.palette.background.paper, border: 'none', borderRadius: 8 }}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke={theme.palette.secondary.main}
                strokeWidth={2}
                dot={{ fill: theme.palette.secondary.main }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </Paper>

      {/* Recent rides table */}
      <Paper elevation={0} sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>Recent Rides</Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Passenger</TableCell>
                <TableCell>Driver</TableCell>
                <TableCell>From</TableCell>
                <TableCell>To</TableCell>
                <TableCell>Fare</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rides.length === 0 ? (
                <TableRow><TableCell colSpan={7} align="center">No rides yet.</TableCell></TableRow>
              ) : rides.map((ride) => (
                <TableRow key={ride.id}>
                  <TableCell>{ride.id}</TableCell>
                  <TableCell>
                    {ride.passenger?.user
                      ? `${ride.passenger.user.name} ${ride.passenger.user.last_name}`
                      : '—'}
                  </TableCell>
                  <TableCell>
                    {ride.driver?.user
                      ? `${ride.driver.user.name} ${ride.driver.user.last_name}`
                      : '—'}
                  </TableCell>
                  <TableCell>{ride.pickup_address}</TableCell>
                  <TableCell>{ride.dropoff_address}</TableCell>
                  <TableCell>
                    {ride.total_fare ? `€${Number(ride.total_fare).toFixed(2)}` : '—'}
                  </TableCell>
                  <TableCell>
                    <Chip label={ride.status} color={statusColors[ride.status] ?? 'default'} size="small" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  )
}

export default DashboardPage
