import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Divider from '@mui/material/Divider'
import Paper from '@mui/material/Paper'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded'
import LockRoundedIcon from '@mui/icons-material/LockRounded'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

function ProfilePage() {
  const { user, login } = useAuth()
  const [profileSuccess, setProfileSuccess] = useState('')
  const [profileError, setProfileError]     = useState('')
  const [pwSuccess, setPwSuccess]           = useState('')
  const [pwError, setPwError]               = useState('')

  // Profile form
  const {
    control: profileControl,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors, isSubmitting: profileSubmitting },
  } = useForm({
    defaultValues: {
      name:         user?.name ?? '',
      last_name:    user?.last_name ?? '',
      phone_number: user?.phone_number ?? '',
    },
  })

  // Password form
  const {
    control: pwControl,
    handleSubmit: handlePwSubmit,
    reset: resetPw,
    formState: { errors: pwErrors, isSubmitting: pwSubmitting },
  } = useForm({
    defaultValues: { current_password: '', password: '', password_confirmation: '' },
  })

  const onProfileSubmit = async (data) => {
    setProfileError('')
    setProfileSuccess('')
    try {
      await api.patch('/auth/profile', data)
      setProfileSuccess('Profile updated successfully.')
    } catch (err) {
      const errs = err.response?.data?.errors
      setProfileError(errs ? Object.values(errs).flat().join(' ') : 'Update failed.')
    }
  }

  const onPwSubmit = async (data) => {
    setPwError('')
    setPwSuccess('')
    try {
      await api.patch('/auth/change-password', data)
      setPwSuccess('Password changed successfully.')
      resetPw()
    } catch (err) {
      const errs = err.response?.data?.errors
      setPwError(errs ? Object.values(errs).flat().join(' ') : err.response?.data?.message ?? 'Failed.')
    }
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Typography variant="h4" fontWeight={700}>My Profile</Typography>

      {/* Profile info */}
      <Paper elevation={0} sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AccountCircleRoundedIcon color="primary" /> Personal Information
        </Typography>
        <Divider sx={{ mb: 3 }} />

        {profileError   && <Alert severity="error"   sx={{ mb: 2 }} onClose={() => setProfileError('')}>{profileError}</Alert>}
        {profileSuccess && <Alert severity="success" sx={{ mb: 2 }} onClose={() => setProfileSuccess('')}>{profileSuccess}</Alert>}

        <Box component="form" onSubmit={handleProfileSubmit(onProfileSubmit)} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Controller
              name="name"
              control={profileControl}
              rules={{ required: 'First name is required' }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="First Name"
                  error={!!profileErrors.name}
                  helperText={profileErrors.name?.message}
                  sx={{ flex: 1, minWidth: 200 }}
                />
              )}
            />
            <Controller
              name="last_name"
              control={profileControl}
              rules={{ required: 'Last name is required' }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Last Name"
                  error={!!profileErrors.last_name}
                  helperText={profileErrors.last_name?.message}
                  sx={{ flex: 1, minWidth: 200 }}
                />
              )}
            />
          </Box>

          <TextField
            label="Email"
            value={user?.email ?? ''}
            disabled
            fullWidth
            helperText="Email cannot be changed."
          />

          <Controller
            name="phone_number"
            control={profileControl}
            render={({ field }) => (
              <TextField {...field} label="Phone Number" fullWidth />
            )}
          />

          <Button
            type="submit"
            variant="contained"
            disabled={profileSubmitting}
            sx={{ fontWeight: 700, alignSelf: 'flex-start' }}
          >
            {profileSubmitting ? <CircularProgress size={20} color="inherit" /> : 'Save Changes'}
          </Button>
        </Box>
      </Paper>

      {/* Change password */}
      <Paper elevation={0} sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <LockRoundedIcon color="primary" /> Change Password
        </Typography>
        <Divider sx={{ mb: 3 }} />

        {pwError   && <Alert severity="error"   sx={{ mb: 2 }} onClose={() => setPwError('')}>{pwError}</Alert>}
        {pwSuccess && <Alert severity="success" sx={{ mb: 2 }} onClose={() => setPwSuccess('')}>{pwSuccess}</Alert>}

        <Box component="form" onSubmit={handlePwSubmit(onPwSubmit)} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <Controller
            name="current_password"
            control={pwControl}
            rules={{ required: 'Current password is required' }}
            render={({ field }) => (
              <TextField
                {...field}
                type="password"
                label="Current Password"
                fullWidth
                error={!!pwErrors.current_password}
                helperText={pwErrors.current_password?.message}
              />
            )}
          />
          <Controller
            name="password"
            control={pwControl}
            rules={{ required: 'New password is required', minLength: { value: 8, message: 'Minimum 8 characters' } }}
            render={({ field }) => (
              <TextField
                {...field}
                type="password"
                label="New Password"
                fullWidth
                error={!!pwErrors.password}
                helperText={pwErrors.password?.message}
              />
            )}
          />
          <Controller
            name="password_confirmation"
            control={pwControl}
            rules={{ required: 'Please confirm your new password' }}
            render={({ field }) => (
              <TextField
                {...field}
                type="password"
                label="Confirm New Password"
                fullWidth
                error={!!pwErrors.password_confirmation}
                helperText={pwErrors.password_confirmation?.message}
              />
            )}
          />

          <Button
            type="submit"
            variant="outlined"
            disabled={pwSubmitting}
            sx={{ fontWeight: 700, alignSelf: 'flex-start' }}
          >
            {pwSubmitting ? <CircularProgress size={20} color="inherit" /> : 'Change Password'}
          </Button>
        </Box>
      </Paper>
    </Box>
  )
}

export default ProfilePage
