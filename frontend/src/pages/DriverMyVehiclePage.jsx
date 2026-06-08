import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import DirectionsCarRoundedIcon from '@mui/icons-material/DirectionsCarRounded'
import api from '../services/api'

function InfoItem({ label, value }) {
  return (
    <Box>
      <Typography variant="caption" color="text.secondary" display="block">{label}</Typography>
      <Typography fontWeight={600}>{value ?? '—'}</Typography>
    </Box>
  )
}

function DriverMyVehiclePage() {
  const [vehicles, setVehicles] = useState([])

  useEffect(() => {
    api.get('/driver/me').then((r) => setVehicles(r.data.vehicles ?? [])).catch(() => {})
  }, [])

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Typography variant="h4" fontWeight={700}>My Vehicle</Typography>

      {vehicles.length === 0 ? (
        <Paper elevation={0} sx={{ p: 4, borderRadius: 3, textAlign: 'center' }}>
          <DirectionsCarRoundedIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
          <Typography color="text.secondary">No vehicle registered. Contact the administrator to add your vehicle.</Typography>
        </Paper>
      ) : (
        vehicles.map((v) => (
          <Paper key={v.id} elevation={0} sx={{ p: 3, borderRadius: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
              <DirectionsCarRoundedIcon color="primary" />
              <Typography variant="h6" fontWeight={700}>
                {v.make} {v.model} ({v.year})
              </Typography>
              <Chip label={v.status} color={v.status === 'Active' ? 'success' : 'warning'} size="small" />
            </Box>
            <Grid container spacing={3}>
              <Grid size={4}><InfoItem label="Make" value={v.make} /></Grid>
              <Grid size={4}><InfoItem label="Model" value={v.model} /></Grid>
              <Grid size={4}><InfoItem label="Year" value={v.year} /></Grid>
              <Grid size={4}><InfoItem label="Color" value={v.color} /></Grid>
              <Grid size={4}><InfoItem label="Plate Number" value={v.plate_number} /></Grid>
              <Grid size={4}><InfoItem label="Seats" value={v.seats} /></Grid>
              <Grid size={4}><InfoItem label="Fuel Type" value={v.fuel_type} /></Grid>
            </Grid>
          </Paper>
        ))
      )}
    </Box>
  )
}

export default DriverMyVehiclePage
