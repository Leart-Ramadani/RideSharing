import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import MenuItem from '@mui/material/MenuItem'
import Paper from '@mui/material/Paper'
import TextField from '@mui/material/TextField'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import Typography from '@mui/material/Typography'
import DirectionsCarFilledRoundedIcon from '@mui/icons-material/DirectionsCarFilledRounded'
import PersonRoundedIcon from '@mui/icons-material/PersonRounded'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function RegisterPage() {
  const { register: authRegister } = useAuth()
  const navigate = useNavigate()
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)

  const { control, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: {
      role: 'Passenger',
      name: '',
      last_name: '',
      email: '',
      phone_number: '',
      password: '',
      password_confirmation: '',
      license_number: '',
      license_expiry: '',
    },
  })

  const role = watch('role')
  const isDriver = role === 'Driver'

  const onSubmit = async (data) => {
    setServerError('')
    setLoading(true)
    try {
      const user = await authRegister(data)
      const roles = user.roles?.map((r) => r.normalized_name) ?? []
      if (roles.includes('DRIVER')) navigate('/driver/dashboard')
      else navigate('/passenger/dashboard')
    } catch (err) {
      const errs = err.response?.data?.errors
      if (errs) setServerError(Object.values(errs).flat().join(' '))
      else setServerError(err.response?.data?.message || 'Registration failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', bgcolor: 'background.default', px: 2, py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 540, borderRadius: 3 }}>
        <Typography variant="h5" fontWeight={700} gutterBottom>Create an account</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Join RideSharing as a driver or passenger.
        </Typography>

        {serverError && <Alert severity="error" sx={{ mb: 2 }}>{serverError}</Alert>}

        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>

          {/* Role selector */}
          <Box>
            <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>I want to join as</Typography>
            <Controller
              name="role"
              control={control}
              render={({ field }) => (
                <ToggleButtonGroup
                  exclusive
                  value={field.value}
                  onChange={(_, v) => v && field.onChange(v)}
                  fullWidth
                  size="large"
                >
                  <ToggleButton value="Passenger" sx={{ gap: 1, fontWeight: 600 }}>
                    <PersonRoundedIcon fontSize="small" /> Passenger
                  </ToggleButton>
                  <ToggleButton value="Driver" sx={{ gap: 1, fontWeight: 600 }}>
                    <DirectionsCarFilledRoundedIcon fontSize="small" /> Driver
                  </ToggleButton>
                </ToggleButtonGroup>
              )}
            />
          </Box>

          <Divider />

          {/* Personal info */}
          <Grid container spacing={2}>
            <Grid size={6}>
              <Controller name="name" control={control} rules={{ required: 'First name is required' }}
                render={({ field }) => (
                  <TextField {...field} label="First Name" fullWidth error={!!errors.name} helperText={errors.name?.message} />
                )}
              />
            </Grid>
            <Grid size={6}>
              <Controller name="last_name" control={control} rules={{ required: 'Last name is required' }}
                render={({ field }) => (
                  <TextField {...field} label="Last Name" fullWidth error={!!errors.last_name} helperText={errors.last_name?.message} />
                )}
              />
            </Grid>
          </Grid>

          <Controller name="email" control={control} rules={{ required: 'Email is required', pattern: { value: /\S+@\S+\.\S+/, message: 'Invalid email' } }}
            render={({ field }) => (
              <TextField {...field} label="Email" type="email" fullWidth error={!!errors.email} helperText={errors.email?.message} />
            )}
          />

          <Controller name="phone_number" control={control} rules={{ required: 'Phone number is required' }}
            render={({ field }) => (
              <TextField {...field} label="Phone Number" fullWidth error={!!errors.phone_number} helperText={errors.phone_number?.message} />
            )}
          />

          <Controller name="password" control={control} rules={{ required: 'Password is required', minLength: { value: 6, message: 'Min 6 characters' } }}
            render={({ field }) => (
              <TextField {...field} label="Password" type="password" fullWidth error={!!errors.password} helperText={errors.password?.message} />
            )}
          />

          <Controller name="password_confirmation" control={control} rules={{ required: 'Please confirm your password' }}
            render={({ field }) => (
              <TextField {...field} label="Confirm Password" type="password" fullWidth error={!!errors.password_confirmation} helperText={errors.password_confirmation?.message} />
            )}
          />

          {/* Driver-only fields */}
          {isDriver && (
            <>
              <Divider><Typography variant="caption" color="text.secondary">Driver Details</Typography></Divider>
              <Grid container spacing={2}>
                <Grid size={6}>
                  <Controller name="license_number" control={control} rules={{ required: isDriver ? 'License number is required' : false }}
                    render={({ field }) => (
                      <TextField {...field} label="License Number" fullWidth error={!!errors.license_number} helperText={errors.license_number?.message} />
                    )}
                  />
                </Grid>
                <Grid size={6}>
                  <Controller name="license_expiry" control={control} rules={{ required: isDriver ? 'Expiry date is required' : false }}
                    render={({ field }) => (
                      <TextField {...field} label="License Expiry" type="date" fullWidth InputLabelProps={{ shrink: true }}
                        error={!!errors.license_expiry} helperText={errors.license_expiry?.message} />
                    )}
                  />
                </Grid>
              </Grid>
            </>
          )}

          <Button type="submit" variant="contained" size="large" fullWidth disabled={loading} sx={{ mt: 1 }}>
            {loading ? <CircularProgress size={22} color="inherit" /> : 'Register'}
          </Button>
        </Box>

        <Typography variant="body2" sx={{ mt: 3, textAlign: 'center' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'inherit', fontWeight: 600 }}>Login</Link>
        </Typography>
      </Paper>
    </Box>
  )
}

export default RegisterPage
