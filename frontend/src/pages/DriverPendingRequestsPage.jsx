import { useEffect, useState } from 'react'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import CircularProgress from '@mui/material/CircularProgress'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import CancelRoundedIcon from '@mui/icons-material/CancelRounded'
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded'
import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded'
import api from '../services/api'

const serviceColors = { Standard: 'primary', Premium: 'secondary', XL: 'warning' }

function DriverPendingRequestsPage() {
  const [requests, setRequests] = useState([])
  const [loading, setLoading]   = useState(true)
  const [actionId, setActionId] = useState(null) // which request is being acted on
  const [error, setError]       = useState('')
  const [success, setSuccess]   = useState('')

  const fetchRequests = () => {
    setLoading(true)
    api.get('/driver/ride-requests')
      .then((r) => setRequests(r.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchRequests()
    // Poll for new requests every 15 seconds
    const interval = setInterval(fetchRequests, 15000)
    return () => clearInterval(interval)
  }, [])

  const handleAccept = async (id) => {
    setError('')
    setSuccess('')
    setActionId(id)
    try {
      await api.post(`/driver/ride-requests/${id}/accept`)
      setSuccess('Ride accepted! Check "My Rides" to manage it.')
      fetchRequests()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to accept request.')
    } finally {
      setActionId(null)
    }
  }

  const handleReject = async (id) => {
    setError('')
    setSuccess('')
    setActionId(id)
    try {
      await api.post(`/driver/ride-requests/${id}/reject`)
      setSuccess('Request rejected.')
      fetchRequests()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reject request.')
    } finally {
      setActionId(null)
    }
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" fontWeight={700}>Pending Requests</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Accept a request to start the ride. Page refreshes automatically every 15s.
          </Typography>
        </Box>
        <Button startIcon={<RefreshRoundedIcon />} variant="outlined" onClick={fetchRequests}>
          Refresh
        </Button>
      </Box>

      {error   && <Alert severity="error"   onClose={() => setError('')}>{error}</Alert>}
      {success && <Alert severity="success" onClose={() => setSuccess('')}>{success}</Alert>}

      {loading && requests.length === 0 ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', pt: 6 }}>
          <CircularProgress />
        </Box>
      ) : requests.length === 0 ? (
        <Paper elevation={0} sx={{ p: 5, borderRadius: 3, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">No pending requests right now.</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            New requests will appear here automatically.
          </Typography>
        </Paper>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {requests.map((req) => (
            <Paper key={req.id} elevation={0} sx={{ p: 3, borderRadius: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
                <Box sx={{ flex: 1 }}>
                  {/* Passenger info */}
                  <Typography fontWeight={700} variant="h6">
                    {req.passenger?.user?.name} {req.passenger?.user?.last_name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {req.passenger?.user?.phone_number ?? 'No phone'}
                  </Typography>

                  {/* Locations */}
                  <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LocationOnRoundedIcon color="success" fontSize="small" />
                      <Typography variant="body2">
                        <strong>From:</strong> {req.pickup_address}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LocationOnRoundedIcon color="error" fontSize="small" />
                      <Typography variant="body2">
                        <strong>To:</strong> {req.dropoff_address}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ mt: 1.5, display: 'flex', gap: 1, alignItems: 'center' }}>
                    <Chip
                      label={req.service_type}
                      color={serviceColors[req.service_type] ?? 'default'}
                      size="small"
                    />
                    <Typography variant="caption" color="text.secondary">
                      Requested {new Date(req.requested_at).toLocaleTimeString()}
                    </Typography>
                  </Box>
                </Box>

                {/* Accept / Reject buttons */}
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <Button
                    variant="contained"
                    color="success"
                    startIcon={actionId === req.id ? <CircularProgress size={16} color="inherit" /> : <CheckCircleRoundedIcon />}
                    onClick={() => handleAccept(req.id)}
                    disabled={actionId !== null}
                    sx={{ fontWeight: 700 }}
                  >
                    Accept
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<CancelRoundedIcon />}
                    onClick={() => handleReject(req.id)}
                    disabled={actionId !== null}
                  >
                    Reject
                  </Button>
                </Box>
              </Box>
            </Paper>
          ))}
        </Box>
      )}
    </Box>
  )
}

export default DriverPendingRequestsPage
