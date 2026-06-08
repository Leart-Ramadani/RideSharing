import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import CircularProgress from '@mui/material/CircularProgress'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import Paper from '@mui/material/Paper'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded'
import CalculateRoundedIcon from '@mui/icons-material/CalculateRounded'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

const serviceLabels = {
  Standard: 'Standard — basic sedan',
  Premium:  'Premium — comfort ride',
  XL:       'XL — large vehicle (5+ seats)',
}

function PassengerRequestRidePage() {
  const navigate = useNavigate()
  const [loading, setLoading]         = useState(false)
  const [serverError, setServerError] = useState('')
  const [success, setSuccess]         = useState(false)
  const [estimates, setEstimates]     = useState(null)
  const [estimating, setEstimating]   = useState(false)

  const { control, handleSubmit, reset, watch, formState: { errors } } = useForm({
    defaultValues: {
      pickup_address:  '',
      dropoff_address: '',
      service_type:    'Standard',
      distance_km:     '',
    },
  })

  const distanceKm   = watch('distance_km')
  const selectedType = watch('service_type')

  // Fetch fare estimates from the API based on distance
  const handleEstimate = async () => {
    const km = parseFloat(distanceKm)
    if (!km || km <= 0) return
    setEstimating(true)
    setEstimates(null)
    try {
      const res = await api.get('/passenger/fare-estimate', { params: { distance_km: km, duration_min: 15 } })
      setEstimates(res.data)
    } catch {
      setEstimates(null)
    } finally {
      setEstimating(false)
    }
  }

  const onSubmit = async (data) => {
    setServerError('')
    setLoading(true)
    try {
      await api.post('/passenger/ride-requests', {
        pickup_address:  data.pickup_address,
        dropoff_address: data.dropoff_address,
        service_type:    data.service_type,
      })
      setSuccess(true)
      reset()
      setEstimates(null)
    } catch (err) {
      const errs = err.response?.data?.errors
      setServerError(errs ? Object.values(errs).flat().join(' ') : 'Failed to submit request.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, pt: 6 }}>
        <CheckCircleOutlineRoundedIcon sx={{ fontSize: 64, color: 'success.main' }} />
        <Typography variant="h5" fontWeight={700}>Ride Requested!</Typography>
        <Typography color="text.secondary">Your request has been submitted. A driver will accept it shortly.</Typography>
        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
          <Button variant="contained" onClick={() => setSuccess(false)}>Request Another</Button>
          <Button variant="outlined" onClick={() => navigate('/passenger/ride-requests')}>View My Requests</Button>
        </Box>
      </Box>
    )
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box>
        <Typography variant="h4" fontWeight={700}>Request a Ride</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Fill in your trip details below. You can estimate the fare before submitting.
        </Typography>
      </Box>

      <Paper elevation={0} sx={{ p: 3, borderRadius: 3, maxWidth: 600 }}>
        {serverError && <Alert severity="error" sx={{ mb: 2 }}>{serverError}</Alert>}

        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <Controller
            name="pickup_address"
            control={control}
            rules={{ required: 'Pickup address is required' }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Pickup Address"
                placeholder="e.g. Pristina, Str. Perandori Justinian 10"
                fullWidth
                error={!!errors.pickup_address}
                helperText={errors.pickup_address?.message}
              />
            )}
          />

          <Controller
            name="dropoff_address"
            control={control}
            rules={{ required: 'Dropoff address is required' }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Dropoff Address"
                placeholder="e.g. Pristina, Str. UCK 44"
                fullWidth
                error={!!errors.dropoff_address}
                helperText={errors.dropoff_address?.message}
              />
            )}
          />

          <Controller
            name="service_type"
            control={control}
            render={({ field }) => (
              <TextField {...field} select label="Service Type" fullWidth>
                {Object.entries(serviceLabels).map(([val, label]) => (
                  <MenuItem key={val} value={val}>{label}</MenuItem>
                ))}
              </TextField>
            )}
          />

          {/* Fare Estimation Section */}
          <Divider />
          <Box>
            <Typography variant="body2" fontWeight={600} gutterBottom>
              Optional: Estimate Fare
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
              <Controller
                name="distance_km"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Approx. Distance (km)"
                    type="number"   
                    size="small"
                    sx={{ width: 180 }}
                  />
                )}
              />
              <Button
                variant="outlined"
                size="small"
                startIcon={estimating ? <CircularProgress size={14} color="inherit" /> : <CalculateRoundedIcon />}
                onClick={handleEstimate}
                disabled={estimating || !distanceKm}
                sx={{ mt: 0.5 }}
              >
                Estimate
              </Button>
            </Box>

            {estimates && (
              <Box sx={{ mt: 1.5, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {estimates.map((e) => (
                  <Chip
                    key={e.service_type}
                    label={`${e.service_type}: €${e.estimated}`}
                    color={e.service_type === selectedType ? 'primary' : 'default'}
                    variant={e.service_type === selectedType ? 'filled' : 'outlined'}
                    size="small"
                  />
                ))}
                {estimates[0]?.is_peak_hour && (
                  <Chip label="Peak hours — surcharge applied" color="warning" size="small" />
                )}
              </Box>
            )}
          </Box>
          <Divider />

          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={loading}
            sx={{ fontWeight: 700 }}
          >
            {loading ? <CircularProgress size={22} color="inherit" /> : 'Submit Request'}
          </Button>
        </Box>
      </Paper>
    </Box>
  )
}

export default PassengerRequestRidePage
