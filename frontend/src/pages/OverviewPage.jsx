import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

const metrics = [
  { label: 'Active rides', value: '184', detail: '+12% from last hour' },
  { label: 'Online drivers', value: '72', detail: '8 waiting in hotspot zones' },
  { label: 'Open support cases', value: '9', detail: '2 high priority tickets' },
]

const activity = [
  'Airport pickup demand increased in the last 30 minutes.',
  'Driver verification queue cleared for the current shift.',
  'Payment settlement batch is scheduled for 18:00.',
]

function OverviewPage() {
  return (
    <Stack spacing={3}>
      <Grid container spacing={3}>
        {metrics.map((metric) => (
          <Grid key={metric.label} size={{ xs: 12, md: 4 }}>
            <Paper elevation={0} className="content-card metric-card">
              <Typography className="metric-label">{metric.label}</Typography>
              <Typography variant="h3" className="metric-value">
                {metric.value}
              </Typography>
              <Typography className="metric-detail">{metric.detail}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 7 }}>
          <Paper elevation={0} className="content-card">
            <Typography variant="h6" gutterBottom>
              Today&apos;s operations snapshot
            </Typography>
            <Typography className="card-copy">
              This is a plain test page inside the shared admin layout. Replace this block with real
              charts, recent bookings, or operational insights when you wire the backend.
            </Typography>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, lg: 5 }}>
          <Paper elevation={0} className="content-card">
            <Typography variant="h6" gutterBottom>
              Latest activity
            </Typography>
            <Stack spacing={1.5}>
              {activity.map((item) => (
                <Typography key={item} className="activity-item">
                  {item}
                </Typography>
              ))}
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Stack>
  )
}

export default OverviewPage
