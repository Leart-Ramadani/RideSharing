import { useState } from 'react'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Paper from '@mui/material/Paper'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function getRoleHome(user) {
  const roles = user?.roles?.map((r) => r.normalized_name) ?? []
  if (roles.includes('ADMIN')) return '/admin/dashboard'
  if (roles.includes('DRIVER')) return '/driver/dashboard'
  if (roles.includes('PASSENGER')) return '/passenger/dashboard'
  return '/admin/dashboard'
}

function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const user = await login(form.email, form.password)
      navigate(getRoleHome(user))
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', bgcolor: 'background.default', px: 2 }}>
      <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 420, borderRadius: 3 }}>
        <Typography variant="h5" fontWeight={700} gutterBottom>
          RideSharing — Login
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Sign in to your account to continue.
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField label="Email" name="email" type="email" value={form.email} onChange={handleChange} fullWidth required />
          <TextField label="Password" name="password" type="password" value={form.password} onChange={handleChange} fullWidth required />

          <Button type="submit" variant="contained" size="large" fullWidth disabled={loading}>
            {loading ? <CircularProgress size={22} color="inherit" /> : 'Login'}
          </Button>
        </Box>

        <Typography variant="body2" sx={{ mt: 3, textAlign: 'center' }}>
          Don&apos;t have an account?{' '}
          <Link to="/register" style={{ color: 'inherit', fontWeight: 600 }}>Register</Link>
        </Typography>
      </Paper>
    </Box>
  )
}

export default LoginPage
